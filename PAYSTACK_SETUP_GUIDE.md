# Paystack Setup Guide

## Quick Setup Steps

### 1. Get Your Paystack API Keys

1. **Sign up/Login to Paystack**
   - Go to [https://paystack.com](https://paystack.com)
   - Create an account or login

2. **Get Your API Keys**
   - Go to **Settings** → **API Keys & Webhooks**
   - Copy your **Public Key** (starts with `pk_`)
   - Copy your **Secret Key** (starts with `sk_`)
   - **Test Mode**: Use test keys during development
   - **Live Mode**: Use live keys for production

### 2. Configure Paystack Keys

#### For Supabase Edge Functions (Backend)

Set the secret key as a Supabase secret:

```bash
supabase secrets set PAYSTACK_SECRET_KEY="sk_live_your_secret_key_here"
```

**✅ Already Configured**: The live secret key has been set in Supabase secrets.

#### For Frontend (Optional)

If you need the public key in the frontend, add to `.env.local`:

```env
# Paystack Configuration (Optional - not required for current setup)
VITE_PAYSTACK_PUBLIC_KEY=pk_live_8c21a0d274802594a8e6693c47fd93522e1365c9
```

> **Note**: The current implementation processes payments through Supabase Edge Functions, so the public key is not required in the frontend.

### 3. Set Up Webhooks (Important!)

1. **In Paystack Dashboard**
   - Go to **Settings** → **Webhooks**
   - Click **Add Webhook** or edit existing
   - **Webhook URL**: `https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-webhook`
   - Select events:
     - ✅ `charge.success` (Required - for license creation)
     - `charge.failed` (Optional - for failed payment tracking)
     - `subscription.create` (If using subscriptions)
     - `subscription.disable` (If using subscriptions)
   - Save the webhook
   - Copy the **Webhook Secret** (if provided) and set it:
     ```bash
     supabase secrets set PAYSTACK_WEBHOOK_SECRET="your_webhook_secret_here"
     ```

### 4. Test Your Integration

1. **Use Test Cards** (Test Mode)
   - Card: `4084084084084081`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - PIN: Any 4 digits

2. **Verify Payment Flow**
   - Try purchasing a product
   - Complete payment on Paystack
   - Check webhook receives events
   - Verify license is created in dashboard

## What's Been Updated

✅ **Removed Stripe and Confirmo**
- All payment forms now use Paystack only
- Removed crypto payment options
- Removed naira field references

✅ **Fixed Payment Issues**
- Removed hardcoded $30 default price
- Added authentication check before payment
- Fixed redirect after payment

✅ **Added Renewal Feature**
- Renew button appears on expired licenses
- Redirects to subscription plans page

✅ **Updated UI**
- Payment method shows Paystack only
- Updated FAQ to reflect Paystack
- Cleaned up payment forms

## Backend API Endpoints Needed

Your backend needs these endpoints (or Supabase Edge Functions):

- `POST /api/payments/paystack/initialize` - Initialize transaction
- `GET /api/payments/paystack/verify/:reference` - Verify transaction
- `POST /api/payments/paystack/webhook` - Handle webhooks
- `POST /api/payments/paystack/customer` - Create customer
- `GET /api/payments/paystack/customer/:email` - Get customer
- `POST /api/payments/paystack/plan` - Create subscription plan
- `POST /api/payments/paystack/subscription` - Create subscription
- `GET /api/payments/paystack/subscription/:id` - Get subscription
- `POST /api/payments/paystack/subscription/:id/cancel` - Cancel subscription

## Currency Support

Paystack supports:
- **NGN** (Nigerian Naira) - Primary
- **USD** (US Dollar)
- **ZAR** (South African Rand)
- **GHS** (Ghanaian Cedi)
- **KES** (Kenyan Shilling)

Default currency is set to **NGN** in the config.

## Next Steps

1. Add your Paystack keys to `.env.local`
2. Set up webhook endpoint on your backend
3. Test payment flow with test cards
4. Switch to live keys when ready for production

## Support

- Paystack Docs: https://paystack.com/docs
- Paystack Support: support@paystack.com

