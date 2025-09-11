import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardware fingerprinting helper
function generateHardwareFingerprint(data: any): string {
  const components = [
    data.cpu_id || '',
    data.motherboard_id || '',
    data.disk_serial || '',
    data.mac_address || '',
    data.system_uuid || ''
  ].filter(Boolean);
  
  return btoa(components.join('|')).substring(0, 32);
}

// Rate limiting helper
async function checkRateLimit(supabase: any, licenseId: string): Promise<boolean> {
  const { data: license } = await supabase
    .from('licenses')
    .select('last_hour_validations, max_validations_per_hour, last_hour_reset')
    .eq('id', licenseId)
    .single();

  if (!license) return false;

  const now = new Date();
  const lastReset = new Date(license.last_hour_reset);
  const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

  // Reset counter if more than an hour has passed
  if (hoursSinceReset >= 1) {
    await supabase
      .from('licenses')
      .update({
        last_hour_validations: 1,
        last_hour_reset: now.toISOString()
      })
      .eq('id', licenseId);
    return true;
  }

  // Check if under rate limit
  if (license.last_hour_validations >= license.max_validations_per_hour) {
    return false;
  }

  // Increment counter
  await supabase
    .from('licenses')
    .update({
      last_hour_validations: license.last_hour_validations + 1
    })
    .eq('id', licenseId);

  return true;
}

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
    const { 
      license_key, 
      hardware_info, 
      mt5_account, 
      ea_product_code,
      ea_instance_id 
    } = await req.json();

    if (!license_key || !hardware_info || !ea_product_code) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Missing required parameters' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Generate hardware fingerprint
    const hardware_fingerprint = generateHardwareFingerprint(hardware_info);

    // Get license details
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select(`
        *,
        ea_products:ea_product_id (
          product_code,
          name,
          max_concurrent_sessions,
          requires_hardware_binding
        ),
        subscription_tiers!inner (
          included_eas,
          max_concurrent_sessions
        )
      `)
      .eq('license_key', license_key)
      .single();

    if (licenseError || !license) {
      await supabase.from('license_validations').insert({
        license_id: null,
        validation_result: 'revoked',
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        failure_reason: 'License not found',
        suspicious_activity: true
      });

      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Invalid license key' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Check license status
    if (license.status !== 'active') {
      await supabase.from('license_validations').insert({
        license_id: license.id,
        validation_result: license.status as any,
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        failure_reason: `License status: ${license.status}`
      });

      return new Response(JSON.stringify({ 
        valid: false, 
        error: `License is ${license.status}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await supabase.from('licenses').update({ status: 'expired' }).eq('id', license.id);
      
      await supabase.from('license_validations').insert({
        license_id: license.id,
        validation_result: 'expired',
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        failure_reason: 'License expired'
      });

      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'License has expired' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Check rate limiting
    const rateLimitOk = await checkRateLimit(supabase, license.id);
    if (!rateLimitOk) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Rate limit exceeded' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    // Check EA product authorization
    let authorized = false;
    if (license.license_type === 'individual_ea') {
      authorized = license.ea_products?.product_code === ea_product_code;
    } else {
      // Check tier-based access
      const tierEAs = license.subscription_tiers?.included_eas || [];
      authorized = tierEAs.includes(ea_product_code);
    }

    if (!authorized) {
      await supabase.from('license_validations').insert({
        license_id: license.id,
        validation_result: 'revoked',
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        failure_reason: `EA ${ea_product_code} not authorized for this license`,
        suspicious_activity: true
      });

      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'EA not authorized for this license' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Hardware fingerprint validation (strong protection)
    if (license.hardware_fingerprint && license.hardware_fingerprint !== hardware_fingerprint) {
      await supabase.from('license_validations').insert({
        license_id: license.id,
        validation_result: 'hardware_mismatch',
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        failure_reason: 'Hardware fingerprint mismatch',
        suspicious_activity: true
      });

      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Hardware mismatch - license bound to different machine' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // First-time hardware binding
    if (!license.hardware_fingerprint) {
      await supabase
        .from('licenses')
        .update({ hardware_fingerprint })
        .eq('id', license.id);
    }

    // Clean up expired sessions
    await supabase.rpc('cleanup_expired_sessions');

    // Check concurrent sessions
    const { count: activeSessions } = await supabase
      .from('license_sessions')
      .select('*', { count: 'exact' })
      .eq('license_id', license.id)
      .eq('is_active', true);

    const maxSessions = license.license_type === 'individual_ea' 
      ? license.ea_products?.max_concurrent_sessions || 1
      : license.subscription_tiers?.max_concurrent_sessions || 1;

    if (activeSessions >= maxSessions) {
      // Check if this is the same EA instance trying to reconnect
      const { data: existingSession } = await supabase
        .from('license_sessions')
        .select('*')
        .eq('license_id', license.id)
        .eq('ea_instance_id', ea_instance_id)
        .eq('is_active', true)
        .single();

      if (!existingSession) {
        await supabase.from('license_validations').insert({
          license_id: license.id,
          validation_result: 'concurrent_violation',
          hardware_fingerprint,
          ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
          user_agent: req.headers.get('user-agent'),
          mt5_account_number: mt5_account,
          ea_instance_id,
          failure_reason: `Max concurrent sessions (${maxSessions}) exceeded`
        });

        return new Response(JSON.stringify({ 
          valid: false, 
          error: `Maximum concurrent sessions (${maxSessions}) exceeded` 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        });
      }
    }

    // Create or update session
    const sessionToken = crypto.randomUUID();
    const { data: session } = await supabase
      .from('license_sessions')
      .upsert({
        license_id: license.id,
        session_token: sessionToken,
        hardware_fingerprint,
        ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        user_agent: req.headers.get('user-agent'),
        mt5_account_number: mt5_account,
        ea_instance_id,
        last_heartbeat: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }, {
        onConflict: 'ea_instance_id'
      })
      .select()
      .single();

    // Update license validation stats
    await supabase
      .from('licenses')
      .update({
        last_validated_at: new Date().toISOString(),
        validation_count: license.validation_count + 1
      })
      .eq('id', license.id);

    // Log successful validation
    await supabase.from('license_validations').insert({
      license_id: license.id,
      session_id: session?.id,
      validation_result: 'valid',
      hardware_fingerprint,
      ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
      user_agent: req.headers.get('user-agent'),
      mt5_account_number: mt5_account,
      ea_instance_id
    });

    return new Response(JSON.stringify({ 
      valid: true,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      max_sessions: maxSessions,
      current_sessions: (activeSessions || 0) + 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('License validation error:', error);
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Internal server error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});