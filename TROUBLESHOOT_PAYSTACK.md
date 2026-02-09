# Troubleshooting Paystack Payment Issues

## Error: "Edge Function returned a non-2xx status code"

This error means the Supabase Edge Function `paystack-initialize` is returning an error status (4xx or 5xx).

### Common Causes & Solutions

#### 1. **Paystack Secret Key Not Set**
The Edge Function requires `PAYSTACK_SECRET_KEY` to be set in Supabase secrets.

**Fix:** In Supabase Dashboard go to **Project Settings → Edge Functions → Secrets** (or Vault) and add `PAYSTACK_SECRET_KEY` with your key from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer). Do not commit real keys to git.

**Verify:**
```bash
supabase secrets list | findstr PAYSTACK
```

#### 2. **Edge Function Not Deployed**
The function might not be deployed to your Supabase project.

**Fix:**
```bash
# Make sure you're in the project directory
cd C:\Users\PC\Documents\algo-vista-hub

# Deploy the function
supabase functions deploy paystack-initialize
```

#### 3. **Authentication Issues**
The Edge Function requires a valid user session.

**Check:**
- User must be logged in
- Session token must be valid
- Check browser console for auth errors

#### 4. **Missing Required Parameters**
The function requires `amount` and `email`.

**Check:**
- Amount is a valid number
- Email is provided and valid
- All required fields are filled in checkout form

#### 5. **Paystack API Error**
Paystack API might be rejecting the request.

**Check Edge Function Logs:**
```bash
supabase functions logs paystack-initialize
```

### Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for detailed error messages
   - Check Network tab for failed requests

2. **Check Supabase Logs**
   ```bash
   supabase functions logs paystack-initialize --tail
   ```

3. **Test Edge Function Directly**
   ```bash
   # Get your anon key from Supabase dashboard
   curl -X POST https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/paystack-initialize \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d "{\"amount\": 1000, \"email\": \"test@example.com\"}"
   ```

4. **Verify Secrets**
   ```bash
   supabase secrets list
   ```
   Should show `PAYSTACK_SECRET_KEY`

### Quick Fix Checklist

- [ ] Paystack secret key is set in Supabase secrets
- [ ] Edge Function is deployed (`supabase functions deploy paystack-initialize`)
- [ ] User is logged in
- [ ] All form fields are filled correctly
- [ ] Check browser console for specific error messages
- [ ] Check Supabase function logs for server-side errors

### If Still Not Working

1. **Redeploy the function:**
   ```bash
   supabase functions deploy paystack-initialize --no-verify-jwt
   ```

2. **Check function status:**
   ```bash
   supabase functions list
   ```

3. **View real-time logs:**
   ```bash
   supabase functions logs paystack-initialize --tail
   ```

4. **Test with a simple request:**
   - Try with a minimal amount (e.g., 100 NGN = 1.00)
   - Use a valid email address
   - Ensure user is authenticated

### Common Error Messages

- **"Authentication required"** → User not logged in
- **"Paystack secret key not configured"** → Secret not set in Supabase
- **"Amount and email are required"** → Missing form data
- **"Failed to initialize payment"** → Paystack API error (check logs)
- **"Invalid response from Paystack"** → Paystack API returned invalid JSON
