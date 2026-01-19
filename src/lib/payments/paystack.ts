// Paystack Payment Integration
// This file handles Paystack payment processing for the algorithmic trading platform

export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface PaystackTransaction {
  id: string;
  reference: string;
  authorization_url?: string;
  access_code?: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'abandoned';
  metadata?: Record<string, any>;
  customer?: {
    email: string;
    name?: string;
  };
}

export interface PaystackSubscription {
  id: string;
  customer: string;
  plan: string;
  status: 'active' | 'non-renewing' | 'cancelled';
  current_period_start: string;
  current_period_end: string;
  amount: number;
  currency: string;
}

export interface PaystackPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'annually';
}

class PaystackService {
  private config: PaystackConfig;
  private baseUrl = 'https://api.paystack.co';

  constructor(config: PaystackConfig) {
    this.config = config;
  }

  // Initialize Paystack payment
  async initializeTransaction(
    amount: number,
    email: string,
    currency: string = 'NGN',
    metadata: Record<string, any> = {},
    reference?: string
  ): Promise<PaystackTransaction> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: {
          amount,
          email,
          currency,
          metadata,
          reference: reference || `PAYSTACK_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to initialize transaction');
      }

      if (!data) {
        throw new Error('Empty response from server');
      }

      return data as PaystackTransaction;
    } catch (error: any) {
      console.error('Error initializing Paystack transaction:', error);
      throw error;
    }
  }

  // Verify transaction
  async verifyTransaction(reference: string): Promise<PaystackTransaction> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { reference },
      });

      if (error) {
        throw new Error(error.message || 'Failed to verify transaction');
      }

      if (!data) {
        throw new Error('Empty response from server');
      }

      return data as PaystackTransaction;
    } catch (error: any) {
      console.error('Error verifying Paystack transaction:', error);
      throw error;
    }
  }

  // Create customer
  async createCustomer(
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    metadata: Record<string, any> = {}
  ) {
    try {
      const response = await fetch('/api/payments/paystack/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Paystack customer:', error);
      throw error;
    }
  }

  // Get customer
  async getCustomer(emailOrCode: string) {
    try {
      const response = await fetch(`/api/payments/paystack/customer/${emailOrCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Paystack customer:', error);
      throw error;
    }
  }

  // Create plan
  async createPlan(
    name: string,
    amount: number,
    interval: 'daily' | 'weekly' | 'monthly' | 'annually',
    currency: string = 'NGN',
    description?: string
  ): Promise<PaystackPlan> {
    try {
      const response = await fetch('/api/payments/paystack/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: Math.round(amount * 100), // Convert to kobo
          interval,
          currency,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create plan');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Paystack plan:', error);
      throw error;
    }
  }

  // Create subscription
  async createSubscription(
    customer: string,
    plan: string,
    authorization?: string,
    metadata: Record<string, any> = {}
  ): Promise<PaystackSubscription> {
    try {
      const response = await fetch('/api/payments/paystack/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          plan,
          authorization,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Paystack subscription:', error);
      throw error;
    }
  }

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<PaystackSubscription> {
    try {
      const response = await fetch(`/api/payments/paystack/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Paystack subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, token?: string): Promise<PaystackSubscription> {
    try {
      const response = await fetch(`/api/payments/paystack/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling Paystack subscription:', error);
      throw error;
    }
  }

  // Verify webhook signature
  async verifyWebhookSignature(payload: string | Buffer, signature: string): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/paystack/verify-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-paystack-signature': signature,
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

  // Get or create customer
  async getOrCreateCustomer(
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    metadata: Record<string, any> = {}
  ) {
    try {
      // First try to get existing customer
      let customer = await this.getCustomer(email);
      
      // If not found, create a new one
      if (!customer) {
        customer = await this.createCustomer(email, firstName, lastName, phone, metadata);
      }
      
      return customer;
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paystackService = new PaystackService({
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || '',
  webhookSecret: import.meta.env.VITE_PAYSTACK_WEBHOOK_SECRET || '',
});

// Export types
export type { PaystackConfig, PaystackTransaction, PaystackSubscription, PaystackPlan };

