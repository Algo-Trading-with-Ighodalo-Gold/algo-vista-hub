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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userData.user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'worker')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const { product_id, days, max_accounts } = await req.json();

    if (!product_id) {
      return new Response(JSON.stringify({ error: 'product_id is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Use service role for database access
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get Cloudflare Worker URL from environment
    const CLOUDFLARE_WORKER_URL = Deno.env.get('CLOUDFLARE_WORKER_URL');
    
    if (!CLOUDFLARE_WORKER_URL) {
      console.error('CLOUDFLARE_WORKER_URL not configured');
      return new Response(JSON.stringify({ error: 'Cloudflare Worker URL not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Call Cloudflare Worker to sync license
    const cloudflareResponse = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id,
        days: days || 365,
        max_accounts: max_accounts || 1,
      }),
    });

    if (!cloudflareResponse.ok) {
      const errorText = await cloudflareResponse.text();
      console.error('Cloudflare Worker error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to sync license to Cloudflare',
        details: errorText 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: cloudflareResponse.status,
      });
    }

    const cloudflareData = await cloudflareResponse.json();

    return new Response(JSON.stringify({ 
      success: true,
      message: 'License synced to Cloudflare successfully',
      data: cloudflareData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Sync license error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
