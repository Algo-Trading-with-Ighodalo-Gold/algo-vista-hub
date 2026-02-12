// Polar Payment Integration
// Handles hosted checkout, payment verification, and subscriptions via Polar.

import { supabase } from "@/integrations/supabase/client";

export interface PolarCheckoutSession {
  id: string;
  checkoutUrl: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | string;
  amount: number;
  currency: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PolarSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  amount?: number;
  currency?: string;
}

class PolarService {
  // Create hosted checkout using backend edge function
  async createCheckout(
    payload: {
      eaPlanId: string;
      metadata?: Record<string, any>;
      allowDiscountCodes?: boolean;
      discountId?: string;
    }
  ): Promise<PolarCheckoutSession> {
    const { data, error } = await supabase.functions.invoke("polar-create-checkout", {
      body: {
        ea_plan_id: payload.eaPlanId,
        metadata: payload.metadata || {},
        allow_discount_codes: payload.allowDiscountCodes ?? true,
        discount_id: payload.discountId ?? null,
      },
    });

    if (error) {
      throw new Error(error.message || "Failed to create Polar checkout session");
    }
    if (!data?.checkoutUrl && !data?.url) {
      throw new Error("Polar checkout URL is missing");
    }
    return {
      id: data.id,
      checkoutUrl: data.checkoutUrl || data.url,
      status: data.status || "pending",
      amount: data.amount || 0,
      currency: data.currency || "USD",
      metadata: data.metadata,
      reference: data.reference,
    };
  }

  // Legacy helper retained to avoid breaking old code paths.
  async createAmountCheckout(
    amount: number,
    email: string,
    currency: string = "USD",
    metadata: Record<string, any> = {},
    reference?: string,
  ): Promise<PolarCheckoutSession> {
    const { data, error } = await supabase.functions.invoke("polar-create-checkout", {
      body: {
        amount,
        currency,
        metadata: { ...metadata, email, reference },
        allow_discount_codes: true,
      },
    });
    if (error) {
      throw new Error(error.message || "Failed to create Polar checkout session");
    }
    return {
      id: data.id,
      checkoutUrl: data.checkoutUrl || data.url,
      status: data.status || "pending",
      amount: data.amount || Math.round(amount * 100),
      currency: data.currency || currency,
      metadata: data.metadata,
      reference: data.reference,
    };
  }

  // Verify checkout/payment
  async verifyCheckout(referenceOrCheckoutId: string): Promise<PolarCheckoutSession> {
    const { data, error } = await supabase.functions.invoke("polar-verify", {
      body: { reference: referenceOrCheckoutId },
    });
    if (error) {
      throw new Error(error.message || "Failed to verify Polar checkout");
    }
    return {
      id: data?.id || referenceOrCheckoutId,
      checkoutUrl: data?.url || "",
      status: data?.status || "pending",
      amount: data?.amount || 0,
      currency: data?.currency || "USD",
      metadata: data?.metadata || {},
      reference: data?.id || referenceOrCheckoutId,
    };
  }

  async createSubscription(
    customerId: string,
    productId: string,
    interval: 'monthly' | 'yearly' = 'monthly',
    metadata: Record<string, any> = {}
  ): Promise<PolarSubscription> {
    const response = await fetch('/api/payments/polar/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        productId,
        interval,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create Polar subscription');
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false) {
    const response = await fetch(`/api/payments/polar/subscription/${encodeURIComponent(subscriptionId)}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ immediately }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to cancel Polar subscription');
    }

    return response.json();
  }

  async getSubscription(subscriptionId: string): Promise<PolarSubscription> {
    const response = await fetch(`/api/payments/polar/subscription/${encodeURIComponent(subscriptionId)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get Polar subscription');
    }

    return response.json();
  }

  async getOrCreateCustomer(
    email: string,
    name: string,
    metadata: Record<string, any> = {}
  ) {
    const response = await fetch('/api/payments/polar/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get or create Polar customer');
    }

    return response.json();
  }
}

export const polarService = new PolarService();
