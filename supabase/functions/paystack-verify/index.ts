import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) {
      return new Response(JSON.stringify({ error: "PAYSTACK_SECRET_KEY is not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const url = new URL(req.url);
    let reference = url.searchParams.get("reference");
    if (!reference) {
      try {
        const body = await req.json();
        reference = body?.reference ? String(body.reference) : null;
      } catch {
        // no-op for empty body
      }
    }

    if (!reference) {
      return new Response(JSON.stringify({ error: "Reference is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const json = await response.json();
    if (!response.ok || !json?.status) {
      return new Response(JSON.stringify({ error: json?.message || "Failed to verify transaction" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.status || 500,
      });
    }

    const txn = json.data || {};
    const paystackStatus = String(txn.status || "").toLowerCase();
    const mappedStatus =
      paystackStatus === "success"
        ? "succeeded"
        : paystackStatus === "abandoned"
          ? "failed"
          : paystackStatus || "pending";

    return new Response(
      JSON.stringify({
        id: txn.id ? String(txn.id) : reference,
        reference: txn.reference || reference,
        status: mappedStatus,
        provider: "paystack",
        amount: Number(txn.amount || 0), // in kobo
        currency: String(txn.currency || "NGN").toUpperCase(),
        metadata: txn.metadata || {},
        displayAmountUsdCents: Number(txn?.metadata?.display_amount_usd_cents || 0),
        exchangeRate: Number(txn?.metadata?.exchange_rate_usd_ngn || 0),
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
