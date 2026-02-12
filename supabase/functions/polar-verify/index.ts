import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POLAR_OAT = Deno.env.get("POLAR_OAT");
    if (!POLAR_OAT) {
      return new Response(
        JSON.stringify({ error: "POLAR_OAT is not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const url = new URL(req.url);
    let reference = url.searchParams.get("reference");

    if (!reference) {
      try {
        const body = await req.json();
        reference = body.reference || body.checkoutId || body.id;
      } catch (_err) {
        // Body may be empty; ignore.
      }
    }

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Reference is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const polarResponse = await fetch(`https://api.polar.sh/v1/checkouts/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${POLAR_OAT}`,
      },
    });

    if (!polarResponse.ok) {
      const errorPayload = await polarResponse.text();
      return new Response(
        JSON.stringify({
          error: errorPayload || `Failed to verify checkout (${polarResponse.status})`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: polarResponse.status,
        }
      );
    }

    const data = await polarResponse.json();
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
