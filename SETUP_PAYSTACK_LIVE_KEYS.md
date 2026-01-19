# Setup Paystack Live Keys

## ✅ Your Keys

⚠️ **IMPORTANT:** Replace these placeholders with your actual keys from Paystack Dashboard

- **Live Secret Key:** `sk_live_YOUR_SECRET_KEY_HERE`
- **Live Public Key:** `pk_live_YOUR_PUBLIC_KEY_HERE`

## Step 1: Add to Supabase Secrets (Edge Functions)

### Via Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/vvgtmfmvisxhivmldrhd/settings/functions
2. Click "Add Secret" for each:

   **Secret 1:**
   - Name: `PAYSTACK_SECRET_KEY`
   - Value: `sk_live_YOUR_SECRET_KEY_HERE` (Get from Paystack Dashboard)

   **Secret 2:**
   - Name: `PAYSTACK_WEBHOOK_SECRET`
   - Value: (Get this from Paystack Dashboard → Settings → Webhooks)

   **Secret 3:**
   - Name: `SITE_URL`
   - Value: `https://yourdomain.com` (or `http://localhost:5173` for local dev)

### Via CLI (Alternative)

```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
supabase secrets set PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here
supabase secrets set SITE_URL=https://yourdomain.com
```

## Step 2: Add Public Key to Frontend (.env.local)

Create or update `.env.local` file in your project root:

```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_live_8c21a0d274802594a8e6693c47fd93522e1365c9

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=https://vvgtmfmvisxhivmldrhd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3RtZm12aXN4aGl2bWxkcmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODUwNzYsImV4cCI6MjA3MjE2MTA3Nn0.fw3TtYzM92-hV-BAN2PeA1NnGLa6TvhvEhgjqQ1QdCE
```

**⚠️ Important:** 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The public key is safe to expose in frontend code
- The secret key should ONLY be in Supabase secrets (never in frontend)

## Step 3: Set Up Paystack Webhook

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Navigate to **Webhooks**
3. Click **Add Webhook**
4. Webhook URL: `https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-webhook`
5. Select events:
   - ✅ `charge.success`
6. Copy the **Webhook Secret** and add it to Supabase secrets as `PAYSTACK_WEBHOOK_SECRET`

## Step 4: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Verify Setup

### Check Secrets Are Set

```bash
supabase secrets list
```

You should see:
- ✅ `PAYSTACK_SECRET_KEY`
- ✅ `PAYSTACK_WEBHOOK_SECRET`
- ✅ `SITE_URL`

### Test Payment Flow

1. Go to: http://localhost:5173/products
2. Click a product → "Subscribe & Pay with Paystack"
3. Fill checkout form
4. Complete payment (use real card or Paystack test mode)

## Security Checklist

- ✅ Secret key is in Supabase secrets (not in code)
- ✅ Public key is in `.env.local` (not committed to git)
- ✅ `.env.local` is in `.gitignore`
- ✅ Webhook secret is set
- ✅ Webhook URL is configured in Paystack

## Production Checklist

Before going live:

- [ ] Update `SITE_URL` to your production domain
- [ ] Test webhook is receiving events
- [ ] Verify licenses are being created after payment
- [ ] Test with real payment (small amount first)
- [ ] Monitor Supabase function logs
- [ ] Set up error alerts

## Troubleshooting

### Payment Not Initializing
- Check `PAYSTACK_SECRET_KEY` is set in Supabase secrets
- Check function logs: `supabase functions logs paystack-initialize`

### Webhook Not Working
- Verify webhook URL in Paystack dashboard
- Check `PAYSTACK_WEBHOOK_SECRET` matches Paystack
- Check webhook logs: `supabase functions logs paystack-webhook`

### License Not Created
- Check webhook is receiving `charge.success` events
- Verify webhook function logs
- Check `products` table has correct product codes

## Support

- Paystack Dashboard: https://dashboard.paystack.com
- Supabase Dashboard: https://supabase.com/dashboard/project/vvgtmfmvisxhivmldrhd
- Function Logs: `supabase functions logs <function-name> --tail`
