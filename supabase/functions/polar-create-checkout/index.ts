import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
    const polarOat = Deno.env.get("POLAR_OAT");
    const appUrl = Deno.env.get("APP_URL") ?? Deno.env.get("VITE_APP_URL") ?? "http://localhost:5173";

    if (!polarOat) {
      return new Response(JSON.stringify({ error: "POLAR_OAT is not configured" }), {
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
    const legacyAmount = Number(body?.amount ?? 0);
    const legacyCurrency = String(body?.currency ?? "USD").toUpperCase();
    const legacyProductId = body?.polar_product_id ? String(body.polar_product_id) : (Deno.env.get("POLAR_DEFAULT_PRODUCT_ID") ?? "");
    const allowDiscountCodes = body?.allow_discount_codes !== false;
    const discountId = body?.discount_id ? String(body.discount_id) : null;
    const metadataInput = typeof body?.metadata === "object" && body?.metadata ? body.metadata : {};

    const service = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    let selectedProductId = "";
    let selectedCurrency = legacyCurrency;
    let finalDiscountId: string | null = discountId;
    let checkoutMetadata: Record<string, unknown> = { ...metadataInput, user_id: userData.user.id };

    if (eaPlanId) {
      const { data: plan, error: planError } = await service
        .from("ea_plans")
        .select("id,ea_id,tier,term,max_accounts,currency,is_active,polar_discount_id")
        .eq("id", eaPlanId)
        .single();

      if (planError || !plan || !plan.is_active) {
        return new Response(JSON.stringify({ error: "Plan not found or inactive" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      const { data: mapping, error: mappingError } = await service
        .from("ea_plan_polar")
        .select("polar_product_id")
        .eq("ea_plan_id", plan.id)
        .single();

      if (mappingError || !mapping?.polar_product_id) {
        return new Response(JSON.stringify({ error: "Polar mapping missing for selected plan" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      selectedProductId = mapping.polar_product_id;
      selectedCurrency = String(plan.currency || "USD").toUpperCase();
      finalDiscountId = finalDiscountId || plan.polar_discount_id || null;
      checkoutMetadata = {
        ...checkoutMetadata,
        ea_id: plan.ea_id,
        ea_plan_id: plan.id,
        tier: plan.tier,
        max_accounts: plan.max_accounts,
        term: plan.term,
      };
    } else if (legacyProductId) {
      selectedProductId = legacyProductId;
      checkoutMetadata = {
        ...checkoutMetadata,
        legacy_amount_checkout: true,
      };
    } else {
      return new Response(JSON.stringify({ error: "ea_plan_id is required for subscriptions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const checkoutPayload: Record<string, unknown> = {
      products: [selectedProductId],
      customer_email: userData.user.email,
      success_url: `${appUrl.replace(/\/$/, "")}/payment/success?checkout_id={CHECKOUT_ID}&psp=polar`,
      return_url: `${appUrl.replace(/\/$/, "")}/payment/failure`,
      allow_discount_codes: allowDiscountCodes,
      metadata: checkoutMetadata,
      currency: selectedCurrency.toLowerCase(),
    };
    if (!eaPlanId && Number.isFinite(legacyAmount) && legacyAmount > 0) {
      checkoutPayload.amount = Math.round(legacyAmount * 100);
    }

    if (finalDiscountId) {
      checkoutPayload.discount_id = finalDiscountId;
    }

    const polarResponse = await fetch("https://api.polar.sh/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${polarOat}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!polarResponse.ok) {
      const errorText = await polarResponse.text();
      return new Response(JSON.stringify({ error: `Failed to create Polar checkout: ${errorText}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: polarResponse.status,
      });
    }

    const checkout = await polarResponse.json();
    return new Response(
      JSON.stringify({
        id: checkout.id,
        status: checkout.status,
        checkoutUrl: checkout.url,
        url: checkout.url,
        metadata: checkout.metadata,
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
