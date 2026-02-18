import { supabase } from "@/integrations/supabase/client";

export interface PaystackCheckoutSession {
  id: string;
  checkoutUrl: string;
  status: "pending" | "success" | "failed" | "abandoned" | string;
  amount: number;
  currency: string;
  reference: string;
  metadata?: Record<string, any>;
  displayAmountUsdCents?: number;
  exchangeRate?: number;
}

class PaystackService {
  async createCheckout(
    payload:
      | {
          eaPlanId: string;
          metadata?: Record<string, any>;
        }
      | {
          amount: number;
          email: string;
          currency?: string;
          metadata?: Record<string, any>;
          reference?: string;
        },
  ): Promise<PaystackCheckoutSession> {
    const body =
      "eaPlanId" in payload
        ? {
            ea_plan_id: payload.eaPlanId,
            metadata: payload.metadata || {},
          }
        : {
            amount: payload.amount,
            email: payload.email,
            currency: payload.currency || "USD",
            metadata: payload.metadata || {},
            reference: payload.reference || null,
          };

    const { data, error } = await supabase.functions.invoke("paystack-initialize", {
      body,
    });

    if (error) throw new Error(error.message || "Failed to initialize Paystack checkout");
    if (!data?.checkoutUrl && !data?.authorization_url) {
      throw new Error("Paystack checkout URL is missing");
    }

    return {
      id: data.id || data.reference,
      checkoutUrl: data.checkoutUrl || data.authorization_url,
      status: data.status || "pending",
      amount: data.amount || 0,
      currency: data.currency || "NGN",
      reference: data.reference || "",
      metadata: data.metadata || {},
      displayAmountUsdCents: data.displayAmountUsdCents,
      exchangeRate: data.exchangeRate,
    };
  }

  async verifyCheckout(reference: string): Promise<PaystackCheckoutSession> {
    const { data, error } = await supabase.functions.invoke("paystack-verify", {
      body: { reference },
    });
    if (error) throw new Error(error.message || "Failed to verify Paystack transaction");

    return {
      id: data?.id || data?.reference || reference,
      checkoutUrl: "",
      status: data?.status || "pending",
      amount: data?.amount || 0,
      currency: data?.currency || "NGN",
      reference: data?.reference || reference,
      metadata: data?.metadata || {},
      displayAmountUsdCents: data?.displayAmountUsdCents,
      exchangeRate: data?.exchangeRate,
    };
  }
}

export const paystackService = new PaystackService();
