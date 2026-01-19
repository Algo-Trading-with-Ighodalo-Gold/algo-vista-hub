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
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Paystack secret key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get reference from query params or request body
    const url = new URL(req.url);
    let reference = url.searchParams.get('reference');
    
    // If not in query params, try request body
    if (!reference) {
      try {
        const body = await req.json();
        reference = body.reference;
      } catch (e) {
        // Body might be empty or not JSON
      }
    }

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Reference is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!paystackResponse.ok) {
      let errorMessage = 'Failed to verify transaction';
      try {
        const errorData = await paystackResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        try {
          const errorText = await paystackResponse.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          errorMessage = `HTTP ${paystackResponse.status}: ${paystackResponse.statusText}`;
        }
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: paystackResponse.status }
      );
    }

    let paystackData;
    try {
      const responseText = await paystackResponse.text();
      paystackData = JSON.parse(responseText);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid response from Paystack' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify(paystackData.data || paystackData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying Paystack transaction:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
