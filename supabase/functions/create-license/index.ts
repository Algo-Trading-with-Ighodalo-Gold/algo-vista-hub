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
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
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

    const { 
      license_type, 
      ea_product_code, 
      tier_code,
      stripe_subscription_id,
      stripe_customer_id,
      duration_months = 12 
    } = await req.json();

    if (!license_type || (!ea_product_code && !tier_code)) {
      return new Response(JSON.stringify({ 
        error: 'License type and either EA product code or tier code required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Use service role for license creation
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Generate unique license key
    let licenseKey = '';
    let isUnique = false;
    while (!isUnique) {
      const { data: keyData } = await serviceSupabase.rpc('generate_license_key');
      licenseKey = keyData;
      const { data: existing } = await serviceSupabase
        .from('licenses')
        .select('id')
        .eq('license_key', licenseKey)
        .single();
      isUnique = !existing;
    }

    let licenseData: any = {
      user_id: userData.user.id,
      license_key: licenseKey,
      license_type,
      status: 'active',
      stripe_subscription_id,
      stripe_customer_id,
      expires_at: new Date(Date.now() + duration_months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      issued_at: new Date().toISOString()
    };

    // Declare eaProduct outside the if block for Cloudflare sync
    let eaProduct: any = null;

    if (license_type === 'individual_ea') {
      // Get EA product details from products table (linked to Cloudflare)
      // Try products table first, fallback to ea_products for backward compatibility
      
      const { data: productFromProducts } = await serviceSupabase
        .from('products')
        .select('*')
        .or(`product_code.eq.${ea_product_code},id.eq.${ea_product_code}`)
        .single();

      if (productFromProducts) {
        eaProduct = productFromProducts;
      } else {
        // Fallback to ea_products for backward compatibility
        const { data: productFromEaProducts } = await serviceSupabase
          .from('ea_products')
          .select('*')
          .eq('product_code', ea_product_code)
          .single();
        
        if (productFromEaProducts) {
          eaProduct = productFromEaProducts;
        }
      }

      if (!eaProduct) {
        return new Response(JSON.stringify({ error: 'EA product not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }

      licenseData.ea_product_id = eaProduct.id;
      licenseData.ea_product_name = eaProduct.name;
      licenseData.max_concurrent_sessions = eaProduct.max_concurrent_sessions || 1;
    } else {
      // Get tier details
      const { data: tier } = await serviceSupabase
        .from('subscription_tiers')
        .select('*')
        .eq('tier_code', tier_code)
        .single();

      if (!tier) {
        return new Response(JSON.stringify({ error: 'Subscription tier not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }

      licenseData.max_concurrent_sessions = tier.max_concurrent_sessions;
    }

    // Create license
    const { data: license, error: licenseError } = await serviceSupabase
      .from('licenses')
      .insert(licenseData)
      .select()
      .single();

    if (licenseError) {
      console.error('License creation error:', licenseError);
      return new Response(JSON.stringify({ error: 'Failed to create license' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Sync license to Cloudflare if product code is available
    if (ea_product_code && license.expires_at) {
      try {
        const CLOUDFLARE_WORKER_URL = Deno.env.get('CLOUDFLARE_WORKER_URL');
        if (CLOUDFLARE_WORKER_URL) {
          // Calculate days from expiration
          const expiresAt = new Date(license.expires_at);
          const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          // Get max accounts from product
          let maxAccounts = 1;
          if (eaProduct) {
            maxAccounts = eaProduct.max_mt5_accounts || eaProduct.max_concurrent_sessions || 1;
          }
          
          await fetch(CLOUDFLARE_WORKER_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: ea_product_code,
              days: days,
              max_accounts: maxAccounts,
            }),
          });
          
          console.log(`License synced to Cloudflare for product ${ea_product_code}`);
        }
      } catch (cloudflareError: any) {
        console.error('Error syncing license to Cloudflare:', cloudflareError);
        // Don't fail the license creation if Cloudflare sync fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      license: {
        id: license.id,
        license_key: license.license_key,
        license_type: license.license_type,
        status: license.status,
        expires_at: license.expires_at,
        max_concurrent_sessions: license.max_concurrent_sessions
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Create license error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});