import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { amount, email, currency = 'NGN', metadata, reference } = requestBody;

    if (!amount || !email) {
      return new Response(
        JSON.stringify({ error: 'Amount and email are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Paystack secret key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Generate reference if not provided
    const paymentReference = reference || `PAYSTACK_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Initialize Paystack transaction
    // Amount from client is in major units (e.g. Naira); Paystack expects minor units (kobo for NGN)
    const amountInMinorUnits = Math.round(amount * 100);
    if (amountInMinorUnits < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum payment amount is ₦1.00 (100 kobo).' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInMinorUnits,
        email,
        currency,
        reference: paymentReference,
        metadata: {
          ...metadata,
          user_id: userData.user.id,
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userData.user.id
            }
          ]
        },
        callback_url: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/payment/success?reference=${paymentReference}`,
      }),
    });

    if (!paystackResponse.ok) {
      let errorMessage = 'Failed to initialize payment';
      try {
        const errorData = await paystackResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        const errorText = await paystackResponse.text();
        errorMessage = errorText || errorMessage;
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

    // Store pending transaction in database (if transactions table exists)
    try {
      const serviceSupabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      await serviceSupabase.from('transactions').insert({
        user_id: userData.user.id,
        amount: amount,
        currency: currency,
        status: 'pending',
        payment_method: 'paystack',
        payment_reference: paymentReference,
        metadata: {
          ...metadata,
          paystack_reference: paystackData.data.reference,
          authorization_url: paystackData.data.authorization_url,
        },
      });
    } catch (error) {
      // Transactions table might not exist, continue anyway
      console.log('Could not save transaction to database:', error);
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error initializing Paystack payment:', error);
    const errorMessage = error?.message || error?.toString() || 'Internal server error';
    console.error('Full error details:', JSON.stringify(error, null, 2));
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error?.stack || 'No additional details available'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
