# Polar Setup Guide

This guide shows how to set up Polar for this project and how to model your subscription plans correctly.

## 1) Complete minimum Polar setup first

If your Polar account is not fully set up yet, finish these first:

1. Sign in at `https://polar.sh`.
2. Create or select your organization.
3. Complete required onboarding items (business profile, payout/bank details, identity checks if requested).
4. Create an API token and webhook secret.

Without these, checkout creation may fail or test mode may work while live mode fails.

## 2) How to create products and prices (your exact case)

For your pricing model, use **Fixed recurring prices**, not metered.

- **Fixed price:** Best for subscriptions with known plan amounts.
- **Metered price:** Only for usage-based billing (pay-per-use), not needed for Basic/Pro/Premium.

Create plans like this:

- `Basic` -> max `1` account
- `Pro` -> max `3` accounts
- `Premium` -> max `5` accounts

For each plan, add recurring prices:

- Monthly (1 month)
- Quarterly (3 months)
- Yearly (12 months)

## 3) Website price vs Polar price

When website and Polar prices differ, **Polar should be source of truth at charge time**.

Recommended approach:

1. Store Polar price IDs for each plan interval.
2. Send selected plan + interval metadata with checkout.
3. Verify checkout/webhook against the expected plan metadata before granting access.

If you keep hardcoded website display prices, update them anytime prices change in Polar.

## 4) Environment variables

Set these in frontend `.env` and backend secrets:

```env
VITE_POLAR_WEBHOOK_SECRET=whsec_xxx
VITE_POLAR_ORGANIZATION_ID=org_xxx
VITE_POLAR_DEFAULT_PRODUCT_ID=prod_xxx
VITE_APP_URL=https://your-domain.com

# Server-side only (Supabase Edge Function secret, NOT frontend env):
POLAR_OAT=polar_oat_xxx
```

## 5) Configure webhooks

In Polar dashboard:

1. Go to **Webhooks**.
2. Add endpoint:
   - Local: `https://<your-ngrok-domain>/api/payments/polar/webhook`
   - Production: `https://your-domain.com/api/payments/polar/webhook`
3. Subscribe to:
   - `checkout.completed`
   - `checkout.failed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`

## 6) Configure redirect URLs

- Success: `https://your-domain.com/payment/success`
- Cancel/failure: `https://your-domain.com/payment/failure`

## 7) Verify flow

1. Run:
   ```bash
   npm run dev
   ```
2. Open a product, choose Basic/Pro/Premium and monthly/quarterly/yearly.
3. Continue to payment and complete test checkout in Polar.
4. Confirm success redirect and webhook processing.
5. Confirm account/license entitlements match selected plan.

## 8) Troubleshooting

- **Payment initialization failed**
  - Check API token, organization setup, and backend logs.
- **Webhook not received**
  - Confirm webhook URL, selected events, and signature secret.
- **Wrong plan activated**
  - Validate selected `planId` and `billingPeriod` metadata before provisioning.
