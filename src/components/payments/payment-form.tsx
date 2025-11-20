// Payment Form Component
// This component handles payment processing for both Stripe and Confirmo

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { stripeService } from '@/lib/payments/stripe';
import { paymentAPI } from '@/lib/api/payments';
import { config } from '@/lib/config';

interface PaymentFormProps {
  productId: string;
  productName: string;
  amount: number;
  currency?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  productId,
  productName,
  amount,
  currency = 'USD',
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!customerInfo.name) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      setErrors({});

      // Create payment intent
      const paymentIntent = await paymentAPI.createStripePaymentIntent(
        amount,
        currency,
        {
          productId,
          productName,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
        }
      );

      // In a real implementation, you would use Stripe Elements here
      // For now, we'll simulate a successful payment
      const result = await paymentAPI.processPaymentSuccess(
        paymentIntent.id,
        'user-id', // This should come from auth context
        productId,
        amount,
        currency,
        'stripe'
      );

      onSuccess?.(result);
    } catch (error: any) {
      onError?.(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmoPayment = async () => {
    try {
      setIsProcessing(true);
      setErrors({});

      // Create Confirmo payment
      const payment = await confirmoService.createPayment(
        amount,
        currency,
        `Purchase: ${productName}`,
        customerInfo.email,
        customerInfo.name,
        {
          productId,
          productName,
        }
      );

      // Redirect to Confirmo payment page
      window.open(payment.paymentUrl, '_blank');
      
      // In a real implementation, you would handle the webhook response
      // For now, we'll simulate success
      setTimeout(() => {
        onSuccess?.({ paymentId: payment.id, status: 'completed' });
      }, 2000);
    } catch (error: any) {
      onError?.(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else {
      await handleConfirmoPayment();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Secure payment for {productName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Information */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={customerInfo.country}
              onValueChange={(value) => setCustomerInfo(prev => ({ ...prev, country: value }))}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="SE">Sweden</SelectItem>
                <SelectItem value="NO">Norway</SelectItem>
                <SelectItem value="DK">Denmark</SelectItem>
                <SelectItem value="FI">Finland</SelectItem>
                <SelectItem value="CH">Switzerland</SelectItem>
                <SelectItem value="AT">Austria</SelectItem>
                <SelectItem value="BE">Belgium</SelectItem>
                <SelectItem value="IE">Ireland</SelectItem>
                <SelectItem value="PT">Portugal</SelectItem>
                <SelectItem value="LU">Luxembourg</SelectItem>
                <SelectItem value="MT">Malta</SelectItem>
                <SelectItem value="CY">Cyprus</SelectItem>
                <SelectItem value="EE">Estonia</SelectItem>
                <SelectItem value="LV">Latvia</SelectItem>
                <SelectItem value="LT">Lithuania</SelectItem>
                <SelectItem value="PL">Poland</SelectItem>
                <SelectItem value="CZ">Czech Republic</SelectItem>
                <SelectItem value="SK">Slovakia</SelectItem>
                <SelectItem value="SI">Slovenia</SelectItem>
                <SelectItem value="HU">Hungary</SelectItem>
                <SelectItem value="RO">Romania</SelectItem>
                <SelectItem value="BG">Bulgaria</SelectItem>
                <SelectItem value="HR">Croatia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: 'stripe') => setPaymentMethod(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Stripe (Credit/Debit Card)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Product:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">{currency} {amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium capitalize">{paymentMethod}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Pay {currency} {amount.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
