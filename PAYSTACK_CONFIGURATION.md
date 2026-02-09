# Paystack Configuration Guide

## Environment Variables Required

Add these to your Supabase project settings:

### 1. Go to Supabase Dashboard
- Navigate to: **Project Settings** → **Edge Functions** → **Secrets**

### 2. Add Required Secrets

```
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
SITE_URL=https://yourdomain.com
```

### 3. Get Your Paystack Keys

1. **Secret Key**:
   - Go to [Paystack Dashboard](https://dashboard.paystack.com)
   - Navigate to **Settings** → **API Keys & Webhooks**
   - Copy your **Secret Key** (starts with `sk_live_` for production or `sk_test_` for testing)

2. **Webhook Secret**:
   - In the same page, scroll to **Webhooks**
   - Click **Add Webhook** or edit existing
   - Set webhook URL: `https://your-project.supabase.co/functions/v1/paystack-webhook`
   - Copy the **Webhook Secret** (starts with `whsec_`)

### 4. Configure Webhook URL in Paystack

1. Go to Paystack Dashboard → **Settings** → **API Keys & Webhooks**
2. Add/Edit Webhook URL:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/functions/v1/paystack-webhook
   ```
3. Select events to listen for:
   - ✅ `charge.success`
   - ✅ `charge.failed` (optional)
   - ✅ `transfer.success` (optional)

### 5. Verify Configuration

After setting up, test a payment:
1. Make a test purchase
2. Check Supabase logs: **Edge Functions** → **paystack-webhook** → **Logs**
3. Verify commission is awarded in `referral_commissions` table

## Testing

### Test Mode
For testing, use:
- `PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx`
- Test cards: See [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)

### Production Mode
For production, use:
- `PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx`
- Real payment methods

## Troubleshooting

### "Paystack secret key not configured"
- Check that `PAYSTACK_SECRET_KEY` is set in Supabase secrets
- Ensure no extra spaces or quotes

### "Invalid signature"
- Verify `PAYSTACK_WEBHOOK_SECRET` matches Paystack dashboard
- Check webhook URL is correct

### Commissions not being awarded
- Check user has `referred_by` set in `profiles` table
- Verify affiliate record exists in `affiliates` table
- Check webhook logs for errors
- Verify `award_referral_commission` function exists

### Webhook not receiving events
- Verify webhook URL is accessible (no firewall blocking)
- Check Paystack webhook settings
- Test webhook manually using Paystack's test button
