# Paystack Live Configuration

## ✅ Configuration Complete

### Secrets Set in Supabase

The following Paystack secrets have been configured in your Supabase project:

- **PAYSTACK_SECRET_KEY**: `sk_live_...` ✅ (Set in Supabase secrets)

### Public Key (Frontend)

**Public Key**: `pk_live_8c21a0d274802594a8e6693c47fd93522e1365c9`

> **Note**: The frontend doesn't directly use the public key since payments are processed through Supabase Edge Functions. However, if you need it for any client-side integrations, you can add it to your `.env.local` file as `VITE_PAYSTACK_PUBLIC_KEY`.

### Webhook Configuration

**Webhook URL**: `https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-webhook`

#### ⚠️ Important: Configure in Paystack Dashboard

You need to add this webhook URL in your Paystack dashboard:

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook** or edit existing webhook
4. Enter the webhook URL: `https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-webhook`
5. Select the following events:
   - ✅ `charge.success` (Required for license creation)
   - ✅ `charge.failed` (Optional - for failed payment tracking)
   - ✅ `subscription.create` (If using subscriptions)
   - ✅ `subscription.disable` (If using subscriptions)
6. Save the webhook
7. Copy the **Webhook Secret** (if provided) and set it as `PAYSTACK_WEBHOOK_SECRET` in Supabase secrets

### Verify Secrets

To verify your secrets are set correctly:

```bash
supabase secrets list
```

You should see:
- `PAYSTACK_SECRET_KEY` ✅
- `PAYSTACK_WEBHOOK_SECRET` (if you set it)

### Testing

1. **Test Payment Flow**:
   - Go to `/products` page
   - Select a product
   - Click "Buy Now"
   - Complete checkout form
   - You'll be redirected to Paystack payment page

2. **Test Webhook**:
   - After successful payment, check Supabase logs
   - Verify license is created in `licenses` table
   - Check that transaction status is updated

### Edge Functions Using Paystack

The following Supabase Edge Functions use the Paystack secret key:

1. **`paystack-initialize`** - Initializes payment transactions
   - Uses: `PAYSTACK_SECRET_KEY`
   - Endpoint: `/functions/v1/paystack-initialize`

2. **`paystack-verify`** - Verifies transaction status
   - Uses: `PAYSTACK_SECRET_KEY`
   - Endpoint: `/functions/v1/paystack-verify`

3. **`paystack-webhook`** - Handles Paystack webhook events
   - Uses: `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET` (optional)
   - Endpoint: `/functions/v1/paystack-webhook`

### Security Notes

- ✅ Secret key is stored securely in Supabase secrets (not in code)
- ✅ Webhook signature verification is implemented (if webhook secret is set)
- ✅ All payment processing happens server-side via Edge Functions
- ✅ No sensitive keys are exposed to the frontend

### Next Steps

1. ✅ Secret key configured
2. ⚠️ **Add webhook URL in Paystack dashboard** (Required!)
3. ⚠️ **Set PAYSTACK_WEBHOOK_SECRET** (Optional but recommended)
4. Test a payment with a real card (small amount)
5. Verify license creation after payment

---

**Last Updated**: Configuration completed with live keys
**Status**: ✅ Ready for production (after webhook setup)
