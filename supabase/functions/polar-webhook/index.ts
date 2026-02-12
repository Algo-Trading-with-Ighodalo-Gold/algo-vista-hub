import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, webhook-id, webhook-signature, webhook-timestamp",
};

const encoder = new TextEncoder();

type Term = "monthly" | "quarterly" | "yearly";

const addTermToDate = (baseDate: Date, term: Term) => {
  const next = new Date(baseDate);
  if (term === "monthly") next.setMonth(next.getMonth() + 1);
  if (term === "quarterly") next.setMonth(next.getMonth() + 3);
  if (term === "yearly") next.setFullYear(next.getFullYear() + 1);
  return next;
};

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};

const hmacSha256Base64 = async (secret: string, data: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

const hmacSha256Hex = async (secret: string, data: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const verifyPolarWebhookSignature = async (req: Request, payload: string, secret: string) => {
  const id = req.headers.get("webhook-id");
  const ts = req.headers.get("webhook-timestamp");
  const sig = req.headers.get("webhook-signature");

  if (id && ts && sig) {
    const content = `${id}.${ts}.${payload}`;
    const computed = await hmacSha256Base64(secret, content);
    const candidates = sig
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("v1=")) return part.slice(3);
        if (part.startsWith("v1,")) return part.slice(3);
        return part;
      });
    return candidates.some((candidate) => timingSafeEqual(candidate, computed));
  }

  const fallbackSig = req.headers.get("x-polar-signature") || req.headers.get("x-signature");
  if (!fallbackSig) return false;
  const computedHex = await hmacSha256Hex(secret, payload);
  return timingSafeEqual(fallbackSig, computedHex);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const webhookSecret = Deno.env.get("POLAR_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "POLAR_WEBHOOK_SECRET is not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const payload = await req.text();
    const signatureValid = await verifyPolarWebhookSignature(req, payload, webhookSecret);
    if (!signatureValid) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const event = JSON.parse(payload);
    const eventId = String(event?.id ?? event?.event_id ?? "");
    const eventType = String(event?.type ?? event?.event ?? "");
    const objectData = event?.data ?? {};

    if (!eventId || !eventType) {
      return new Response(JSON.stringify({ error: "Invalid webhook event shape" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const service = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { error: eventInsertError } = await service.from("polar_webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload: event,
    });

    if (eventInsertError && String(eventInsertError.message).toLowerCase().includes("duplicate")) {
      return new Response(JSON.stringify({ success: true, idempotent: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    if (eventInsertError) {
      return new Response(JSON.stringify({ error: eventInsertError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const shouldHandle =
      eventType === "checkout.succeeded" ||
      eventType === "subscription.created" ||
      eventType === "subscription.updated";

    if (!shouldHandle) {
      return new Response(JSON.stringify({ success: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const metadata = objectData?.metadata ?? {};
    const eaPlanId = String(metadata?.ea_plan_id ?? objectData?.ea_plan_id ?? "");
    const userId = String(metadata?.user_id ?? objectData?.user_id ?? "");
    const checkoutId = String(objectData?.id ?? objectData?.checkout_id ?? "");
    const subscriptionId = String(objectData?.subscription_id ?? objectData?.subscription?.id ?? "");
    const orderId = String(objectData?.order_id ?? objectData?.order?.id ?? "");

    if (!eaPlanId || !userId) {
      return new Response(JSON.stringify({ success: true, skipped: "Missing ea_plan_id or user_id metadata" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const { data: plan, error: planError } = await service
      .from("ea_plans")
      .select("id,ea_id,tier,term,max_accounts")
      .eq("id", eaPlanId)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: "Plan not found for webhook event" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    if (checkoutId) {
      const { data: existingCheckoutLicense } = await service
        .from("licenses")
        .select("id")
        .eq("polar_checkout_id", checkoutId)
        .limit(1);
      if (existingCheckoutLicense && existingCheckoutLicense.length > 0) {
        return new Response(JSON.stringify({ success: true, idempotent: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    const { data: generatedKey, error: keyError } = await service.rpc("generate_license_key");
    if (keyError || !generatedKey) {
      return new Response(JSON.stringify({ error: "Failed to generate license key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const expiresAt = addTermToDate(new Date(), plan.term as Term).toISOString();
    const licenseInsert: Record<string, unknown> = {
      user_id: userId,
      license_key: generatedKey,
      license_type: "individual_ea",
      status: "active",
      issued_at: new Date().toISOString(),
      expires_at: expiresAt,
      ea_product_id: plan.ea_id,
      max_concurrent_sessions: plan.max_accounts,
      ea_plan_id: plan.id,
      plan_tier: plan.tier,
      plan_term: plan.term,
      max_accounts: plan.max_accounts,
    };
    if (checkoutId) licenseInsert.polar_checkout_id = checkoutId;
    if (subscriptionId) licenseInsert.polar_subscription_id = subscriptionId;
    if (orderId) licenseInsert.polar_order_id = orderId;

    const { error: licenseError } = await service.from("licenses").insert(licenseInsert);
    if (licenseError) {
      return new Response(JSON.stringify({ error: licenseError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
