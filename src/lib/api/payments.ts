// Payment API Service
// This service provides high-level payment operations for the platform

import { stripeService } from '@/lib/payments/stripe';
import { polarService } from '@/lib/payments/polar';

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
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
  paymentMethod: 'stripe' | 'polar';
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

  // Create Polar hosted checkout
  async createPolarCheckout(
    payload:
      | {
          eaPlanId: string;
          metadata?: Record<string, any>;
          allowDiscountCodes?: boolean;
          discountId?: string;
        }
      | number,
    email?: string,
    currency: string = 'USD',
    metadata: Record<string, any> = {},
    reference?: string
  ) {
    try {
      if (typeof payload === "number") {
        if (!email) throw new Error("Email is required for amount-based checkout");
        return await polarService.createAmountCheckout(payload, email, currency, metadata, reference);
      }
      return await polarService.createCheckout(payload);
    } catch (error) {
      console.error('Error creating Polar checkout:', error);
      throw error;
    }
  }

  // Verify Polar checkout or order
  async verifyPolarCheckout(referenceOrCheckoutId: string) {
    try {
      return await polarService.verifyCheckout(referenceOrCheckoutId);
    } catch (error) {
      console.error('Error verifying Polar checkout:', error);
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
    paymentMethod: 'stripe' | 'polar'
  ): Promise<ProcessedPayment> {
    try {
      // Validate payment
      let payment: any;
      if (paymentMethod === 'stripe') {
        payment = await stripeService.getPaymentIntentStatus(paymentIntentId);
      } else if (paymentMethod === 'polar') {
        payment = await polarService.verifyCheckout(paymentIntentId);
      }

      if (
        payment.status !== 'success' &&
        payment.status !== 'succeeded' &&
        payment.status !== 'completed'
      ) {
        throw new Error('Payment not completed');
      }

      // Generate license key
      const licenseKey = this.generateLicenseKey(userId, productId);

      // Create processed payment record
      const processedPayment: ProcessedPayment = {
        id: paymentIntentId,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: 'success',
        paymentMethod,
        transactionId: payment.reference || payment.id || paymentIntentId,
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
    paymentMethod: 'stripe' | 'polar' = 'polar',
    metadata: Record<string, any> = {}
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.createSubscription(customerId, priceId, metadata);
      } else if (paymentMethod === 'polar') {
        return await polarService.createSubscription(customerId, productId, billingCycle, metadata);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
    paymentMethod: 'stripe' | 'polar',
    immediately: boolean = false
  ) {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.cancelSubscription(subscriptionId, immediately);
      } else if (paymentMethod === 'polar') {
        return await polarService.cancelSubscription(subscriptionId, immediately);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string, paymentMethod: 'stripe' | 'polar') {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getSubscription(subscriptionId);
      } else if (paymentMethod === 'polar') {
        return await polarService.getSubscription(subscriptionId);
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
    paymentMethod: 'stripe' | 'polar' = 'polar',
    metadata: Record<string, any> = {},
    phone?: string
  ) {
    void phone;
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.getOrCreateCustomer(email, name, metadata);
      } else if (paymentMethod === 'polar') {
        return await polarService.getOrCreateCustomer(email, name, metadata);
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

