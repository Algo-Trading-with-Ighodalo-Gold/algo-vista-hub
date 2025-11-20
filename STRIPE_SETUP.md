# Stripe & Confirmo Payment Setup Guide

This guide will help you set up Stripe and Confirmo payment processing for Algo Trading with Ighodalo.

## Prerequisites

- Node.js 18+ installed
- Stripe account
- Confirmo account (optional, for crypto payments)

## Quick Setup

### 1. Create Environment File

Copy the example environment file and configure it:

```bash
cp env.example .env.local
```

### 2. Configure Stripe

#### Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in to your account
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** and **Secret key** (test keys for development)
5. Add them to your `.env.local` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...
```

#### Set Up Stripe Webhooks

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL (for local development, use Stripe CLI or ngrok):
   - Local: `http://localhost:5173/api/webhooks/stripe`
   - Production: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`) and add it to `.env.local`:

```env
VITE_STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Test Stripe Integration

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

More test cards: https://stripe.com/docs/testing

### 3. Configure Confirmo (Crypto Payments)

#### Get Your Confirmo Keys

1. Go to [Confirmo](https://confirmo.net)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Copy your **API Key** and **Merchant ID**
5. Add them to your `.env.local` file:

```env
VITE_CONFIRMO_API_KEY=your_api_key_here
VITE_CONFIRMO_MERCHANT_ID=your_merchant_id_here
VITE_CONFIRMO_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Set Up Confirmo Webhooks

1. Go to **Settings** → **Webhooks** in Confirmo Dashboard
2. Add endpoint URL:
   - Local: `http://localhost:5173/api/webhooks/confirmo`
   - Production: `https://yourdomain.com/api/webhooks/confirmo`
3. Select events:
   - `payment.completed`
   - `subscription.created`
   - `subscription.canceled`

### 4. Install Dependencies

The required packages have already been installed. If needed, run:

```bash
npm install
```

### 5. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the payment page in your app
3. Test with Stripe test cards or Confirmo test environment

## Implementation Details

### Available Services

#### Stripe Service (`src/lib/payments/stripe.ts`)

- `createPaymentIntent(amount, currency, metadata)` - Create a payment intent
- `confirmPayment(clientSecret, paymentMethodId)` - Confirm a payment
- `createSubscription(customerId, priceId, metadata)` - Create a subscription
- `cancelSubscription(subscriptionId, immediately)` - Cancel a subscription
- `getSubscription(subscriptionId)` - Get subscription details
- `getOrCreateCustomer(email, name, metadata)` - Get or create a customer
- `createPortalSession(customerId, returnUrl)` - Create billing portal session

#### Confirmo Service (`src/lib/payments/confirmo.ts`)

- `createPayment(amount, currency, description, customerEmail, customerName)` - Create a payment
- `getPaymentStatus(paymentId)` - Get payment status
- `createSubscription(customerId, productId, amount, currency, billingCycle)` - Create a subscription
- `cancelSubscription(subscriptionId, immediately)` - Cancel a subscription
- `pauseSubscription(subscriptionId)` - Pause a subscription
- `resumeSubscription(subscriptionId)` - Resume a subscription
- `getCustomer(email)` - Get customer by email
- `createCustomer(email, name, metadata)` - Create a customer

#### Payment API (`src/lib/api/payments.ts`)

High-level API that handles both payment providers:

- `createStripePaymentIntent()` - Create Stripe payment intent
- `createConfirmoPayment()` - Create Confirmo payment
- `processPaymentSuccess()` - Process successful payment (generates license keys)
- `createSubscription()` - Create subscription on either provider
- `cancelSubscription()` - Cancel subscription
- `getSubscription()` - Get subscription details

### Using the Payment Services

#### Example: Creating a Payment

```typescript
import { paymentAPI } from '@/lib/api/payments';

// Create Stripe payment
const paymentIntent = await paymentAPI.createStripePaymentIntent(
  99.99, // amount
  'USD', // currency
  { productId: 'ea-001', productName: 'EA Quantum Edge' } // metadata
);

// Create Confirmo payment
const confirmoPayment = await paymentAPI.createConfirmoPayment(
  99.99,
  'USD',
  'EA Quantum Edge Purchase',
  'customer@example.com',
  'John Doe',
  { productId: 'ea-001' }
);
```

#### Example: Processing Payment Success

```typescript
const result = await paymentAPI.processPaymentSuccess(
  paymentIntent.id,
  userId,
  'ea-001',
  99.99,
  'USD',
  'stripe' // or 'confirmo'
);

console.log('License Key:', result.licenseKey);
```

#### Example: Creating a Subscription

```typescript
// Create subscription
const subscription = await paymentAPI.createSubscription(
  customerId,
  'ea-001',
  'price_1234567890',
  'monthly',
  'stripe'
);
```

## Production Deployment

### Before Going Live

1. **Switch to Live Keys**
   - Get your live Stripe keys from the dashboard
   - Update `.env.local` with production keys (remove `_test_` suffix)
   - Get your live Confirmo keys

2. **Update Webhook URLs**
   - Update webhook URLs to point to your production domain
   - Verify webhooks are working in production

3. **Security Checks**
   - Ensure `.env.local` is in `.gitignore`
   - Use environment variables in your hosting platform
   - Enable HTTPS for all payment pages
   - Implement proper error handling

4. **Testing**
   - Test with real payment methods in test mode first
   - Verify license key generation
   - Test webhook delivery
   - Test subscription flows

## Troubleshooting

### Stripe Errors

**"No such payment_intent"**
- Check that you're using the correct environment keys (test vs live)
- Verify the payment intent ID

**Webhook verification failed**
- Ensure `VITE_STRIPE_WEBHOOK_SECRET` is correctly set
- Check that you're using the signing secret from the correct webhook endpoint

### Confirmo Errors

**"Invalid API key"**
- Verify your Confirmo API key is correct
- Ensure you're not using expired keys
- Check your account status

**Payment not completing**
- Check network connectivity
- Verify webhook endpoint is accessible
- Check Confirmo dashboard for transaction logs

## Support

For issues or questions:
- Stripe: https://stripe.com/docs/support
- Confirmo: https://confirmo.net/support
- Project Docs: See `BACKEND_SETUP.md`

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Confirmo Documentation](https://confirmo.net/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Backend Setup Guide](./BACKEND_SETUP.md)
