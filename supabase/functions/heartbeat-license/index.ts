import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    const { session_token, ea_instance_id } = await req.json();

    if (!session_token || !ea_instance_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing session token or EA instance ID' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Update session heartbeat
    const { data: session, error } = await supabase
      .from('license_sessions')
      .update({ 
        last_heartbeat: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('session_token', session_token)
      .eq('ea_instance_id', ea_instance_id)
      .eq('is_active', true)
      .select('*, licenses:license_id(status, expires_at)')
      .single();

    if (error || !session) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid session token' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Check if license is still valid
    const license = session.licenses;
    if (license.status !== 'active') {
      // Deactivate session
      await supabase
        .from('license_sessions')
        .update({ is_active: false })
        .eq('id', session.id);

      return new Response(JSON.stringify({ 
        success: false, 
        error: `License is ${license.status}`,
        action: 'terminate'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Check license expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      // Mark license as expired and deactivate session
      await supabase
        .from('licenses')
        .update({ status: 'expired' })
        .eq('id', session.license_id);

      await supabase
        .from('license_sessions')
        .update({ is_active: false })
        .eq('id', session.id);

      return new Response(JSON.stringify({ 
        success: false, 
        error: 'License has expired',
        action: 'terminate'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Clean up any expired sessions
    await supabase.rpc('cleanup_expired_sessions');

    return new Response(JSON.stringify({ 
      success: true,
      expires_at: session.expires_at,
      license_status: license.status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Heartbeat error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});