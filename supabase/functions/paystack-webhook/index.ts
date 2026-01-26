import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    const PAYSTACK_WEBHOOK_SECRET = Deno.env.get('PAYSTACK_WEBHOOK_SECRET');
    
    if (!PAYSTACK_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Paystack secret key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    if (PAYSTACK_WEBHOOK_SECRET && signature) {
      const hash = await crypto.subtle.digest(
        'SHA-512',
        new TextEncoder().encode(PAYSTACK_WEBHOOK_SECRET + body)
      );
      const computedSignature = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== computedSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }

    const event = JSON.parse(body);
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const transaction = event.data;
      const reference = transaction.reference;
      const userId = transaction.metadata?.user_id;
      const productId = transaction.metadata?.eaId || transaction.metadata?.productId;
      const productCode = transaction.metadata?.eaId || transaction.metadata?.productCode;

      if (!userId) {
        console.error('No user_id in transaction metadata');
        return new Response(
          JSON.stringify({ error: 'User ID not found in metadata' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Update transaction status (if transactions table exists)
      try {
        await serviceSupabase
          .from('transactions')
          .update({
            status: 'completed',
            payment_reference: reference,
            metadata: {
              ...transaction.metadata,
              paystack_data: transaction,
            },
          })
          .eq('payment_reference', reference);
      } catch (error) {
        // Transactions table might not exist, continue anyway
        console.log('Could not update transaction in database:', error);
      }

      // Create license if product is specified
      if (productId || productCode) {
        try {
          // Get product details
          let product = null;
          if (productCode) {
            const { data: productData } = await serviceSupabase
              .from('products')
              .select('*')
              .or(`product_code.eq.${productCode},id.eq.${productCode}`)
              .single();
            
            if (!productData) {
              const { data: eaProductData } = await serviceSupabase
                .from('ea_products')
                .select('*')
                .eq('product_code', productCode)
                .single();
              product = eaProductData;
            } else {
              product = productData;
            }
          } else if (productId) {
            const { data: productData } = await serviceSupabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();
            
            if (!productData) {
              const { data: eaProductData } = await serviceSupabase
                .from('ea_products')
                .select('*')
                .eq('id', productId)
                .single();
              product = eaProductData;
            } else {
              product = productData;
            }
          }

          if (product) {
            // Generate license key
            const licenseKey = `ALG-${userId.substring(0, 8)}-${product.product_code || product.id}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            // Calculate expiration (default 1 year)
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            // Create license
            const { data: createdLicense } = await serviceSupabase.from('licenses').insert({
              user_id: userId,
              license_key: licenseKey,
              license_type: 'individual_ea',
              status: 'active',
              ea_product_id: product.id,
              ea_product_name: product.name,
              max_concurrent_sessions: product.max_concurrent_sessions || 1,
              expires_at: expiresAt.toISOString(),
              issued_at: new Date().toISOString(),
            }).select().single();

            console.log(`License created for user ${userId}, product ${product.name}`);

            // Sync license to Cloudflare
            if (createdLicense && product.product_code) {
              try {
                const CLOUDFLARE_WORKER_URL = Deno.env.get('CLOUDFLARE_WORKER_URL');
                if (CLOUDFLARE_WORKER_URL) {
                  // Calculate days from expiration
                  const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  await fetch(CLOUDFLARE_WORKER_URL, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      product_id: product.product_code,
                      days: days,
                      max_accounts: product.max_mt5_accounts || product.max_concurrent_sessions || 1,
                    }),
                  });
                  
                  console.log(`License synced to Cloudflare for product ${product.product_code}`);
                }
              } catch (cloudflareError: any) {
                console.error('Error syncing license to Cloudflare:', cloudflareError);
                // Don't fail the webhook if Cloudflare sync fails
              }
            }
          }
        } catch (licenseError: any) {
          console.error('Error creating license:', licenseError);
          // Don't fail the webhook if license creation fails
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
