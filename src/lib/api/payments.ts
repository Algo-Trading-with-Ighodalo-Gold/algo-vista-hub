// Payment API Service
// This service provides high-level payment operations for the platform

import { stripeService } from '@/lib/payments/stripe';
import { confirmoService } from '@/lib/payments/confirmo';
import { paystackService } from '@/lib/payments/paystack';

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  paymentUrl?: string;
  authorization_url?: string;
  access_code?: string;
  reference?: string;
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
  paymentMethod: 'stripe' | 'confirmo' | 'paystack';
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

  // Create Paystack payment
  async createPaystackPayment(
    amount: number,
    email: string,
    currency: string = 'NGN',
    metadata: Record<string, any> = {},
    reference?: string
  ) {
    try {
      return await paystackService.initializeTransaction(amount, email, currency, metadata, reference);
    } catch (error) {
      console.error('Error creating Paystack payment:', error);
      throw error;
    }
  }

  // Verify Paystack transaction
  async verifyPaystackTransaction(reference: string) {
    try {
      return await paystackService.verifyTransaction(reference);
    } catch (error) {
      console.error('Error verifying Paystack transaction:', error);
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
    paymentMethod: 'stripe' | 'confirmo' | 'paystack'
  ): Promise<ProcessedPayment> {
    try {
      // Validate payment
      let payment: any;
      if (paymentMethod === 'stripe') {
        payment = await stripeService.getPaymentIntentStatus(paymentIntentId);
      } else if (paymentMethod === 'paystack') {
        payment = await paystackService.verifyTransaction(paymentIntentId);
      } else {
        payment = await confirmoService.getPaymentStatus(paymentIntentId);
      }

      if (paymentMethod === 'paystack') {
        if (payment.status !== 'success') {
          throw new Error('Payment not completed');
        }
      } else if (payment.status !== 'succeeded' && payment.status !== 'completed') {
        throw new Error('Payment not completed');
      }

      // Generate license key
      const licenseKey = this.generateLicenseKey(userId, productId);

      // Create processed payment record
      const processedPayment: ProcessedPayment = {
        id: paymentIntentId,
        amount: paymentMethod === 'paystack' 
          ? payment.amount / 100  // Convert from kobo
          : payment.amount / 100, // Convert from cents
        currency: payment.currency,
        status: 'success',
        paymentMethod,
        transactionId: paymentMethod === 'paystack' ? payment.reference : paymentIntentId,
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
    paymentMethod: 'stripe' | 'confirmo' | 'paystack' = 'paystack',
    metadata: Record<string, any> = {}
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.createSubscription(customerId, priceId, metadata);
      } else if (paymentMethod === 'paystack') {
        // For Paystack, we need to create a plan first if it doesn't exist
        const amount = this.getSubscriptionAmount(productId, billingCycle);
        const interval = billingCycle === 'monthly' ? 'monthly' : 'annually';
        
        // Create or get plan
        const planName = `${productId}-${billingCycle}`;
        // Note: In production, you'd want to check if plan exists first
        const plan = await paystackService.createPlan(planName, amount, interval, 'NGN');
        
        return await paystackService.createSubscription(customerId, plan.id, undefined, metadata);
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
    paymentMethod: 'stripe' | 'confirmo' | 'paystack',
    immediately: boolean = false
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.cancelSubscription(subscriptionId, immediately);
      } else if (paymentMethod === 'paystack') {
        return await paystackService.cancelSubscription(subscriptionId);
      } else {
        return await confirmoService.cancelSubscription(subscriptionId, immediately);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string, paymentMethod: 'stripe' | 'confirmo' | 'paystack') {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getSubscription(subscriptionId);
      } else if (paymentMethod === 'paystack') {
        return await paystackService.getSubscription(subscriptionId);
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
    paymentMethod: 'stripe' | 'confirmo' | 'paystack' = 'paystack',
    metadata: Record<string, any> = {},
    phone?: string
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getOrCreateCustomer(email, name, metadata);
      } else if (paymentMethod === 'paystack') {
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        return await paystackService.getOrCreateCustomer(email, firstName, lastName, phone, metadata);
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

