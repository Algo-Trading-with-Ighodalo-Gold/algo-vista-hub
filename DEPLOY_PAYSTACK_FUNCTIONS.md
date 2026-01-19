# Deploy Paystack Edge Functions - Quick Guide

## The 404 Error Means Functions Aren't Deployed Yet

You're getting a 404 because the Edge Functions need to be deployed to Supabase first.

## Quick Deploy Steps

### 1. Make sure you're logged in to Supabase CLI

```bash
supabase login
```

### 2. Link your project (if not already linked)

```bash
supabase link --project-ref vvgtmfmvisxhivmldrhd
```

### 3. Deploy all Paystack functions

```bash
# Deploy initialize function
supabase functions deploy paystack-initialize

# Deploy verify function  
supabase functions deploy paystack-verify

# Deploy webhook function
supabase functions deploy paystack-webhook
```

### 4. Set Environment Variables (Secrets)

After deploying, set these secrets in Supabase Dashboard:

**Option A: Via Dashboard**
1. Go to: https://supabase.com/dashboard/project/vvgtmfmvisxhivmldrhd/settings/functions
2. Click "Add Secret"
3. Add these:
   - `PAYSTACK_SECRET_KEY` = `sk_test_your_key_here`
   - `PAYSTACK_WEBHOOK_SECRET` = `your_webhook_secret`
   - `SITE_URL` = `http://localhost:5173` (or your production URL)

**Option B: Via CLI**
```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key_here
supabase secrets set PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
supabase secrets set SITE_URL=http://localhost:5173
```

### 5. Verify Functions Are Deployed

Check in Supabase Dashboard:
- Go to: https://supabase.com/dashboard/project/vvgtmfmvisxhivmldrhd/functions
- You should see:
  - ✅ paystack-initialize
  - ✅ paystack-verify
  - ✅ paystack-webhook

### 6. Test the Function

After deployment, test with:

```bash
curl -X POST https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-initialize \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "email": "test@example.com"}'
```

## Troubleshooting

### Still getting 404?

1. **Check function names match exactly:**
   - Function folder: `supabase/functions/paystack-initialize/`
   - Deploy command: `supabase functions deploy paystack-initialize`
   - Must match exactly!

2. **Check you're using the right project:**
   ```bash
   supabase projects list
   ```

3. **Check deployment logs:**
   ```bash
   supabase functions logs paystack-initialize
   ```

### Function deployed but still errors?

1. **Check secrets are set:**
   ```bash
   supabase secrets list
   ```

2. **Check function logs:**
   ```bash
   supabase functions logs paystack-initialize --tail
   ```

3. **Test locally first:**
   ```bash
   supabase functions serve paystack-initialize
   ```

## After Deployment

Once deployed, the payment flow should work:
1. User clicks "Pay with Paystack"
2. Frontend calls `supabase.functions.invoke('paystack-initialize')`
3. Function initializes Paystack payment
4. User redirected to Paystack
5. After payment, webhook creates license

## Need Help?

- Check Supabase Dashboard → Functions → Logs
- Check browser console for detailed errors
- Verify PAYSTACK_SECRET_KEY is set correctly
