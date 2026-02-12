import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Tier = "basic" | "pro" | "premium";
type Term = "monthly" | "quarterly" | "yearly";

const MAX_ACCOUNTS_BY_TIER: Record<Tier, number> = {
  basic: 1,
  pro: 2,
  premium: 3,
};

const RECURRING_BY_TERM: Record<Term, { recurring_interval: "month" | "year"; recurring_interval_count: number }> = {
  monthly: { recurring_interval: "month", recurring_interval_count: 1 },
  quarterly: { recurring_interval: "month", recurring_interval_count: 3 },
  yearly: { recurring_interval: "year", recurring_interval_count: 1 },
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

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

    const service = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: profile } = await service
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "worker")) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const body = await req.json();
    const eaId = String(body?.ea_id ?? "");
    const tier = String(body?.tier ?? "").toLowerCase() as Tier;
    const term = String(body?.term ?? "").toLowerCase() as Term;
    const priceCents = Number(body?.price_cents);
    const currency = String(body?.currency ?? "USD").toUpperCase();

    if (!eaId || !["basic", "pro", "premium"].includes(tier) || !["monthly", "quarterly", "yearly"].includes(term)) {
      return new Response(JSON.stringify({ error: "ea_id, tier and term are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!Number.isInteger(priceCents) || priceCents < 0) {
      return new Response(JSON.stringify({ error: "price_cents must be a non-negative integer" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const maxAccounts = MAX_ACCOUNTS_BY_TIER[tier];
    const recurring = RECURRING_BY_TERM[term];

    const { data: eaProduct, error: eaError } = await service
      .from("products")
      .select("id,name,product_code")
      .or(`id.eq.${eaId},product_code.eq.${eaId}`)
      .single();

    if (eaError || !eaProduct) {
      return new Response(JSON.stringify({ error: "EA product not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const productName = `${eaProduct.name} - ${titleCase(tier)} (${maxAccounts} Accounts) - ${titleCase(term)}`;
    const productDescription = `Subscription plan for ${eaProduct.name}: ${titleCase(tier)} (${maxAccounts} accounts), billed ${term}.`;

    const polarProductPayload = {
      name: productName,
      description: productDescription,
      recurring_interval: recurring.recurring_interval,
      recurring_interval_count: recurring.recurring_interval_count,
      prices: [
        {
          amount_type: "fixed",
          price_amount: priceCents,
          price_currency: currency.toLowerCase(),
          type: "recurring",
          recurring_interval: recurring.recurring_interval,
        },
      ],
    };

    const polarResponse = await fetch("https://api.polar.sh/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${polarOat}`,
      },
      body: JSON.stringify(polarProductPayload),
    });

    if (!polarResponse.ok) {
      const errorText = await polarResponse.text();
      return new Response(JSON.stringify({ error: `Failed to create Polar product: ${errorText}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: polarResponse.status,
      });
    }

    const polarProduct = await polarResponse.json();
    const polarProductId = String(polarProduct?.id ?? "");
    if (!polarProductId) {
      return new Response(JSON.stringify({ error: "Polar product ID missing in response" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 502,
      });
    }

    const { data: createdPlan, error: planError } = await service
      .from("ea_plans")
      .insert({
        ea_id: eaProduct.id,
        tier,
        term,
        max_accounts: maxAccounts,
        price_cents: priceCents,
        currency,
        is_active: true,
      })
      .select("*")
      .single();

    if (planError || !createdPlan) {
      return new Response(JSON.stringify({ error: planError?.message ?? "Failed to create EA plan" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const { error: mapError } = await service.from("ea_plan_polar").insert({
      ea_plan_id: createdPlan.id,
      polar_product_id: polarProductId,
    });

    if (mapError) {
      return new Response(JSON.stringify({ error: mapError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: createdPlan,
        polar_product_id: polarProductId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
