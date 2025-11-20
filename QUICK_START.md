# Quick Start Guide - Stripe & Confirmo Setup

## Step-by-Step Setup Instructions

### 1. Get Your Stripe API Keys (Required for card payments)

**Visit:** https://dashboard.stripe.com/apikeys

1. Sign up or log in to your Stripe account
2. Make sure you're in **Test mode** (toggle in the top right)
3. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

**Add to `.env.local`:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

### 2. Set Up Stripe Webhooks (Recommended)

**Visit:** https://dashboard.stripe.com/webhooks

1. Click **Add endpoint**
2. For local testing, use Stripe CLI:
   ```bash
   npm install -g stripe-cli
   stripe listen --forward-to localhost:5173/api/webhooks/stripe
   ```
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env.local`:
   ```env
   VITE_STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

**Or for production:**
- Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen: `payment_intent.succeeded`, `customer.subscription.created`

### 3. Get Confirmo API Keys (Optional - for crypto payments)

**Visit:** https://confirmo.net

1. Sign up for an account
2. Go to Settings → API Keys
3. Copy these values:
   - **API Key**
   - **Merchant ID**
   - **Webhook Secret**

**Add to `.env.local`:**
```env
VITE_CONFIRMO_API_KEY=your_api_key_here
VITE_CONFIRMO_MERCHANT_ID=your_merchant_id_here
VITE_CONFIRMO_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Configure Supabase (Required)

**Visit:** https://supabase.com

1. Create a project or use existing one
2. Go to Project Settings → API
3. Copy:
   - **Project URL**
   - **anon/public key**

**Add to `.env.local`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the payment page in your app

3. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits

4. Complete the payment to test the flow

### 6. Check Your License Keys

After a successful payment, the system will generate a license key format:
- Format: `ALG-XXXXXXXX-productId-timestamp-RANDOM`

The license key will be returned in the payment success callback.

## Current Configuration Status

Your payment integration is ready with:
- ✅ Stripe payment service implemented
- ✅ Confirmo payment service implemented  
- ✅ Unified payment API created
- ✅ Payment form component ready
- ⚠️  **Needs:** API keys in `.env.local` file

## Support

- **Stripe Documentation:** https://stripe.com/docs
- **Confirmo Documentation:** https://confirmo.net/docs
- **Detailed Setup Guide:** See `STRIPE_SETUP.md`

## Next Steps After Setup

1. Test with Stripe test cards
2. Test with Confirmo (if configured)
3. Set up production webhooks
4. Switch to live keys when ready for production
5. Configure your product pricing
6. Set up email notifications

## Troubleshooting

**"Stripe not initialized"**
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
- Make sure you're using test keys (start with `pk_test_`)

**"Failed to create payment intent"**
- Verify your Stripe secret key is correct
- Check that you're using the same test/live mode for both keys

**Webhooks not working**
- Use Stripe CLI for local testing
- For production, ensure your webhook URL is publicly accessible
- Verify the webhook secret matches





