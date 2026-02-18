import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_USD_NGN_RATE = 1600;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const appUrl = Deno.env.get("APP_URL") ?? Deno.env.get("VITE_APP_URL") ?? "http://localhost:5173";
    const usdNgnRate = Number(Deno.env.get("PAYSTACK_USD_NGN_RATE") ?? DEFAULT_USD_NGN_RATE);

    if (!paystackSecret) {
      return new Response(JSON.stringify({ error: "PAYSTACK_SECRET_KEY is not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const supabaseAuth = createClient(supabaseUrl, anonKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const body = await req.json();
    const eaPlanId = body?.ea_plan_id ? String(body.ea_plan_id) : null;
    const metadataInput = typeof body?.metadata === "object" && body?.metadata ? body.metadata : {};
    const explicitEmail = body?.email ? String(body.email) : null;
    const email = userData.user.email || explicitEmail;
    if (!email) {
      return new Response(JSON.stringify({ error: "Customer email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const service = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    let usdCents = 0;
    let ngnKobo = 0;
    let checkoutMetadata: Record<string, unknown> = { ...metadataInput, user_id: userData.user.id };

    if (eaPlanId) {
      const { data: plan, error: planError } = await service
        .from("ea_plans")
        .select("id,ea_id,tier,term,max_accounts,price_cents,currency,is_active")
        .eq("id", eaPlanId)
        .single();

      if (planError || !plan || !plan.is_active) {
        return new Response(JSON.stringify({ error: "Plan not found or inactive" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      const planCurrency = String(plan.currency || "USD").toUpperCase();
      const planAmountMinor = Number(plan.price_cents || 0);
      if (!Number.isFinite(planAmountMinor) || planAmountMinor <= 0) {
        return new Response(JSON.stringify({ error: "Invalid plan amount" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      if (planCurrency === "USD") {
        usdCents = planAmountMinor;
        ngnKobo = Math.max(100, Math.round((usdCents / 100) * usdNgnRate * 100));
      } else if (planCurrency === "NGN") {
        ngnKobo = planAmountMinor;
        usdCents = Math.round((ngnKobo / 100 / usdNgnRate) * 100);
      } else {
        return new Response(JSON.stringify({ error: `Unsupported plan currency for Paystack: ${planCurrency}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      checkoutMetadata = {
        ...checkoutMetadata,
        ea_id: plan.ea_id,
        ea_plan_id: plan.id,
        tier: plan.tier,
        term: plan.term,
        max_accounts: plan.max_accounts,
        source_currency: planCurrency,
        source_amount_minor: planAmountMinor,
      };
    } else {
      const amount = Number(body?.amount ?? 0);
      const currency = String(body?.currency || "USD").toUpperCase();
      if (!Number.isFinite(amount) || amount <= 0) {
        return new Response(JSON.stringify({ error: "amount must be a positive number" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      if (currency === "USD") {
        usdCents = Math.round(amount * 100);
        ngnKobo = Math.max(100, Math.round((usdCents / 100) * usdNgnRate * 100));
      } else if (currency === "NGN") {
        ngnKobo = Math.max(100, Math.round(amount * 100));
        usdCents = Math.round((ngnKobo / 100 / usdNgnRate) * 100);
      } else {
        return new Response(JSON.stringify({ error: `Unsupported currency for Paystack: ${currency}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      checkoutMetadata = {
        ...checkoutMetadata,
        legacy_amount_checkout: true,
        source_currency: currency,
        source_amount_minor: currency === "USD" ? usdCents : ngnKobo,
      };
    }

    if (!Number.isFinite(usdNgnRate) || usdNgnRate <= 0) {
      return new Response(JSON.stringify({ error: "PAYSTACK_USD_NGN_RATE must be a positive number" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!Number.isFinite(ngnKobo) || ngnKobo <= 0) {
      return new Response(JSON.stringify({ error: "Failed to derive NGN charge amount" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    const reference = String(body?.reference || `pay_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`);
    const callbackUrl = `${appUrl.replace(/\/$/, "")}/payment/success?reference=${encodeURIComponent(reference)}&psp=paystack`;

    const paystackPayload = {
      email,
      amount: ngnKobo,
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata: {
        ...checkoutMetadata,
        display_amount_usd_cents: usdCents,
        exchange_rate_usd_ngn: usdNgnRate,
      },
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackPayload),
    });

    const paystackJson = await response.json();
    if (!response.ok || !paystackJson?.status || !paystackJson?.data?.authorization_url) {
      return new Response(JSON.stringify({ error: paystackJson?.message || "Failed to initialize Paystack transaction" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.status || 500,
      });
    }

    return new Response(
      JSON.stringify({
        id: paystackJson.data.reference,
        checkoutUrl: paystackJson.data.authorization_url,
        authorization_url: paystackJson.data.authorization_url,
        access_code: paystackJson.data.access_code,
        reference: paystackJson.data.reference,
        status: "pending",
        amount: ngnKobo,
        currency: "NGN",
        displayAmountUsdCents: usdCents,
        exchangeRate: usdNgnRate,
        metadata: paystackPayload.metadata,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
