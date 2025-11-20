// Stripe Payment Integration
// This file handles Stripe payment processing for the algorithmic trading platform

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stripeProductId: string;
  stripePriceId: string;
}

class StripeService {
  private config: StripeConfig;
  private stripePromise: Promise<Stripe | null>;

  constructor(config: StripeConfig) {
    this.config = config;
    // Initialize Stripe with the publishable key
    this.stripePromise = loadStripe(config.publishableKey);
  }

  // Get Stripe instance
  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  // Create a payment intent
  async createPaymentIntent(
    amount: number,
    currency: string = 'USD',
    metadata: Record<string, string> = {}
  ): Promise<StripePaymentIntent> {
    try {
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(clientSecret: string, paymentMethodId: string) {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata: Record<string, string> = {}
  ): Promise<StripeSubscription> {
    try {
      const response = await fetch('/api/payments/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    try {
      const response = await fetch(`/api/payments/stripe/subscription/${subscriptionId}`);

      if (!response.ok) {
        throw new Error('Failed to get subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, immediately: boolean = false) {
    try {
      const response = await fetch(`/api/payments/stripe/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          immediately,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get payment intent status
  async getPaymentIntentStatus(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      const response = await fetch(`/api/payments/stripe/intent/${paymentIntentId}`);

      if (!response.ok) {
        throw new Error('Failed to get payment intent status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment intent status:', error);
      throw error;
    }
  }

  // Create or get customer
  async getOrCreateCustomer(email: string, name: string, metadata: Record<string, string> = {}) {
    try {
      const response = await fetch('/api/payments/stripe/customer', {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get or create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw error;
    }
  }

  // Set up customer portal
  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const response = await fetch('/api/payments/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create portal session');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Verify webhook signature
  async verifyWebhookSignature(payload: string | Buffer, signature: string): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/stripe/verify-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': signature,
        },
        body: typeof payload === 'string' ? payload : payload.toString(),
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService({
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
});

// Export types
export type { StripeConfig, StripePaymentIntent, StripeSubscription, StripeProduct };

