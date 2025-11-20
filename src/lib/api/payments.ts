// Payment API Service
// This service provides high-level payment operations for the platform

import { stripeService } from '@/lib/payments/stripe';
import { confirmoService } from '@/lib/payments/confirmo';

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  paymentUrl?: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, string>;
}

export interface ProcessedPayment {
  id: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod: 'stripe' | 'confirmo';
  transactionId: string;
  licenseKey?: string;
  timestamp: string;
}

export class PaymentAPI {
  // Create Stripe payment intent
  async createStripePaymentIntent(
    amount: number,
    currency: string = 'USD',
    metadata: Record<string, string> = {}
  ) {
    try {
      return await stripeService.createPaymentIntent(amount, currency, metadata);
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw error;
    }
  }

  // Create Confirmo payment
  async createConfirmoPayment(
    amount: number,
    currency: string = 'USD',
    description: string,
    customerEmail: string,
    customerName: string,
    metadata: Record<string, string> = {}
  ) {
    try {
      return await confirmoService.createPayment(
        amount,
        currency,
        description,
        customerEmail,
        customerName,
        metadata
      );
    } catch (error) {
      console.error('Error creating Confirmo payment:', error);
      throw error;
    }
  }

  // Process payment success (after payment is confirmed)
  async processPaymentSuccess(
    paymentIntentId: string,
    userId: string,
    productId: string,
    amount: number,
    currency: string,
    paymentMethod: 'stripe' | 'confirmo'
  ): Promise<ProcessedPayment> {
    try {
      // Validate payment
      const payment = paymentMethod === 'stripe'
        ? await stripeService.getPaymentIntentStatus(paymentIntentId)
        : await confirmoService.getPaymentStatus(paymentIntentId);

      if (payment.status !== 'succeeded' && payment.status !== 'completed') {
        throw new Error('Payment not completed');
      }

      // Generate license key
      const licenseKey = this.generateLicenseKey(userId, productId);

      // Create processed payment record
      const processedPayment: ProcessedPayment = {
        id: paymentIntentId,
        amount: payment.amount / 100, // Convert from cents
        currency: payment.currency,
        status: 'success',
        paymentMethod,
        transactionId: paymentIntentId,
        licenseKey,
        timestamp: new Date().toISOString(),
      };

      // Here you would typically save this to your database
      // For now, we'll just return the processed payment

      return processedPayment;
    } catch (error) {
      console.error('Error processing payment success:', error);
      throw error;
    }
  }

  // Create subscription
  async createSubscription(
    customerId: string,
    productId: string,
    priceId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    paymentMethod: 'stripe' | 'confirmo' = 'stripe',
    metadata: Record<string, string> = {}
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.createSubscription(customerId, priceId, metadata);
      } else {
        // For Confirmo, we need to calculate the amount
        const amount = this.getSubscriptionAmount(productId, billingCycle);
        return await confirmoService.createSubscription(
          customerId,
          productId,
          amount,
          'USD',
          billingCycle,
          metadata
        );
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
    paymentMethod: 'stripe' | 'confirmo',
    immediately: boolean = false
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.cancelSubscription(subscriptionId, immediately);
      } else {
        return await confirmoService.cancelSubscription(subscriptionId, immediately);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string, paymentMethod: 'stripe' | 'confirmo') {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getSubscription(subscriptionId);
      } else {
        return await confirmoService.getSubscription(subscriptionId);
      }
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  // Get or create customer
  async getOrCreateCustomer(
    email: string,
    name: string,
    paymentMethod: 'stripe' | 'confirmo' = 'stripe',
    metadata: Record<string, string> = {}
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getOrCreateCustomer(email, name, metadata);
      } else {
        // First try to get existing customer
        let customer = await confirmoService.getCustomer(email);
        
        // If not found, create a new one
        if (!customer) {
          customer = await confirmoService.createCustomer(email, name, metadata);
        }
        
        return customer;
      }
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw error;
    }
  }

  // Generate license key
  private generateLicenseKey(userId: string, productId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ALG-${userId.substring(0, 8)}-${productId}-${timestamp}-${random}`;
  }

  // Get subscription amount based on product and billing cycle
  private getSubscriptionAmount(productId: string, billingCycle: 'monthly' | 'yearly'): number {
    // This would typically come from your database
    // For now, we'll use default pricing
    const basePrices: Record<string, Record<'monthly' | 'yearly', number>> = {
      'pro': { monthly: 49.99, yearly: 499.99 },
      'premium': { monthly: 99.99, yearly: 999.99 },
      'enterprise': { monthly: 199.99, yearly: 1999.99 },
    };

    const productType = productId.toLowerCase();
    return basePrices[productType]?.[billingCycle] || 49.99;
  }
}

// Export singleton instance
export const paymentAPI = new PaymentAPI();

// Export types
export type { PaymentIntent, ProcessedPayment };

