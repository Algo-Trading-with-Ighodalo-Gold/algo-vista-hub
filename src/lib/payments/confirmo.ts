// Confirmo Payment Integration
// This file handles Confirmo payment processing for the algorithmic trading platform

export interface ConfirmoConfig {
  apiKey: string;
  merchantId: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface ConfirmoPayment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentUrl: string;
  reference: string;
  createdAt: string;
  expiresAt: string;
}

export interface ConfirmoProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  confirmoProductId: string;
}

export interface ConfirmoSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
}

class ConfirmoService {
  private config: ConfirmoConfig;

  constructor(config: ConfirmoConfig) {
    this.config = config;
  }

  // Create a payment request
  async createPayment(
    amount: number,
    currency: string = 'USD',
    description: string,
    customerEmail: string,
    customerName: string,
    metadata: Record<string, string> = {}
  ): Promise<ConfirmoPayment> {
    try {
      const response = await fetch('/api/payments/confirmo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          customerEmail,
          customerName,
          metadata,
          merchantId: this.config.merchantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Confirmo payment:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<ConfirmoPayment> {
    try {
      const response = await fetch(`/api/payments/confirmo/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(
    customerId: string,
    productId: string,
    amount: number,
    currency: string = 'USD',
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    metadata: Record<string, string> = {}
  ): Promise<ConfirmoSubscription> {
    try {
      const response = await fetch('/api/payments/confirmo/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          customerId,
          productId,
          amount,
          currency,
          billingCycle,
          metadata,
          merchantId: this.config.merchantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Confirmo subscription:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<ConfirmoSubscription> {
    try {
      const response = await fetch(`/api/payments/confirmo/subscription/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

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
      const response = await fetch(`/api/payments/confirmo/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
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

  // Pause subscription
  async pauseSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`/api/payments/confirmo/subscription/${subscriptionId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to pause subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error pausing subscription:', error);
      throw error;
    }
  }

  // Resume subscription
  async resumeSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`/api/payments/confirmo/subscription/${subscriptionId}/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resume subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  // Get customer by email
  async getCustomer(email: string) {
    try {
      const response = await fetch(`/api/payments/confirmo/customer?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Customer not found
        }
        throw new Error('Failed to get customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  }

  // Create customer
  async createCustomer(email: string, name: string, metadata: Record<string, string> = {}) {
    try {
      const response = await fetch('/api/payments/confirmo/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          email,
          name,
          metadata,
          merchantId: this.config.merchantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // This would typically use HMAC verification
    // For now, we'll implement a basic check
    const expectedSignature = this.generateWebhookSignature(payload);
    return signature === expectedSignature;
  }

  private generateWebhookSignature(payload: string): string {
    // In a real implementation, this would use HMAC-SHA256
    // For now, we'll use a simple hash
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');
  }
}

// Export singleton instance
export const confirmoService = new ConfirmoService({
  apiKey: import.meta.env.VITE_CONFIRMO_API_KEY || '',
  merchantId: import.meta.env.VITE_CONFIRMO_MERCHANT_ID || '',
  baseUrl: import.meta.env.VITE_CONFIRMO_BASE_URL || 'https://api.confirmo.net',
  webhookSecret: import.meta.env.VITE_CONFIRMO_WEBHOOK_SECRET || '',
});

// Export types
export type { ConfirmoConfig, ConfirmoPayment, ConfirmoProduct, ConfirmoSubscription };
