# Testing Paystack Edge Functions on Windows

## ✅ Good News: Function IS Deployed!

You got a **401 error** (not 404), which means the function is deployed and working! You just need proper authentication.

## Windows PowerShell Test Commands

### Option 1: Single Line PowerShell (Recommended)

```powershell
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3RtZm12aXN4aGl2bWxkcmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODUwNzYsImV4cCI6MjA3MjE2MTA3Nn0.fw3TtYzM92-hV-BAN2PeA1NnGLa6TvhvEhgjqQ1QdCE"
    "Content-Type" = "application/json"
}
$body = @{
    amount = 1000
    email = "test@example.com"
    currency = "NGN"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-initialize" -Method Post -Headers $headers -Body $body
```

### Option 2: Single Line curl (Windows 10+)

```cmd
curl -X POST https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-initialize -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3RtZm12aXN4aGl2bWxkcmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODUwNzYsImV4cCI6MjA3MjE2MTA3Nn0.fw3TtYzM92-hV-BAN2PeA1NnGLa6TvhvEhgjqQ1QdCE" -H "Content-Type: application/json" -d "{\"amount\": 1000, \"email\": \"test@example.com\", \"currency\": \"NGN\"}"
```

### Option 3: Test from Browser Console

Open your browser console (F12) on your app and run:

```javascript
const { supabase } = await import('/src/integrations/supabase/client.ts');
const { data, error } = await supabase.functions.invoke('paystack-initialize', {
  body: {
    amount: 1000,
    email: 'test@example.com',
    currency: 'NGN'
  }
});
console.log('Response:', data, error);
```

## Important Notes

### ⚠️ The Function Requires Authentication

The function needs:
1. **Authorization header** with a valid JWT token (user session)
2. **OR** use `supabase.functions.invoke()` from your app (handles auth automatically)

### Testing from Your App (Easiest)

The best way to test is through your actual app:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Go to:** http://localhost:5173/products

3. **Click on a product** → Click "Subscribe & Pay with Paystack"

4. **Fill checkout form** → Click "Pay with Paystack"

5. **Check browser console** for any errors

### Check Function Logs

```bash
supabase functions logs paystack-initialize --tail
```

This will show real-time logs from your function.

## Common Issues

### 401 Unauthorized
- ✅ Function is deployed (good!)
- ❌ Missing or invalid auth token
- **Fix:** Use `supabase.functions.invoke()` from authenticated user session

### 500 Internal Server Error
- Check function logs: `supabase functions logs paystack-initialize`
- Verify `PAYSTACK_SECRET_KEY` is set in Supabase secrets

### Function Not Found (404)
- Function not deployed
- **Fix:** Run `supabase functions deploy paystack-initialize`

## Next Steps

1. ✅ Function is deployed (you got 401, not 404)
2. ⏳ Set `PAYSTACK_SECRET_KEY` in Supabase secrets
3. ⏳ Test from your app (not curl - requires auth)
4. ⏳ Complete a test payment

The payment flow should work from your app now!
