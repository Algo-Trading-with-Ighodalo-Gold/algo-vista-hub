# Affiliate Commission Fix Instructions

## Problem
When a user signs up with an affiliate code and purchases an EA, the commission is not showing on the affiliate dashboard.

## Root Causes
1. Function signature mismatch in `award_referral_commission`
2. User's `referred_by` field may not be set correctly
3. Commission function may not be called correctly from webhook

## Solution Steps

### Step 1: Run SQL Migration
Run this SQL file in Supabase SQL Editor:
```
supabase/migrations/FIX_AFFILIATE_AND_PAYMENT_STRUCTURE.sql
```

This will:
- Fix the `award_referral_commission` function signature
- Ensure commissions are properly awarded
- Add per-EA plans structure

### Step 2: Verify User's Referral Link
Check if the user who purchased has `referred_by` set:

```sql
-- Check user's referral status
SELECT 
  u.id,
  u.email,
  p.referred_by,
  a.referral_code as referrer_code
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.affiliates a ON a.user_id = p.referred_by
WHERE u.email = 'user@example.com';
```

### Step 3: Manually Link Referral (if needed)
If `referred_by` is NULL but should be set:

```sql
-- Find the affiliate's user_id
SELECT user_id, referral_code 
FROM public.affiliates 
WHERE referral_code = 'AFFILIATE_CODE_HERE';

-- Update the user's profile
UPDATE public.profiles
SET referred_by = 'AFFILIATE_USER_ID_HERE'
WHERE user_id = 'PURCHASER_USER_ID_HERE';
```

### Step 4: Manually Award Commission (for existing purchases)
If a purchase was made but commission wasn't awarded:

```sql
-- Award commission manually
SELECT public.award_referral_commission(
  'PURCHASER_USER_ID'::UUID,  -- The buyer's user_id
  'TXN_REF_123',              -- Transaction reference
  'PRODUCT_ID',               -- Product ID or code
  'Product Name',             -- Product name
  10000.00                    -- Purchase amount in base currency (e.g., Naira)
);
```

### Step 5: Verify Commission Was Created
Check if commission was created:

```sql
-- View commissions for an affiliate
SELECT 
  rc.*,
  u.email as referred_user_email,
  p.first_name || ' ' || p.last_name as referred_user_name
FROM public.referral_commissions rc
JOIN auth.users u ON u.id = rc.referred_user_id
JOIN public.profiles p ON p.user_id = u.id
WHERE rc.referrer_user_id = 'AFFILIATE_USER_ID_HERE'
ORDER BY rc.created_at DESC;
```

### Step 6: Check Affiliate Dashboard
The affiliate dashboard should now show:
- Total earnings updated
- Commission records visible
- Referral statistics updated

## Testing New Purchases

1. **Create test user with affiliate code**:
   - Sign up with `?ref=AFFILIATE_CODE` in URL
   - Or manually set `referred_by` in profiles table

2. **Make a purchase**:
   - Go through checkout
   - Complete Polar checkout
   - Webhook should automatically award commission

3. **Verify commission**:
   - Check `referral_commissions` table
   - Check affiliate's `commission_earned` updated
   - Check affiliate dashboard shows the commission

## Common Issues

### Issue: Commission not awarded after purchase
**Solution**: 
- Check webhook logs in Supabase Edge Functions
- Verify `award_referral_commission` function exists
- Check user has `referred_by` set

### Issue: Wrong commission amount
**Solution**:
- Verify `purchase_amount_param` is in base currency (not cents)
- Check commission rate calculation (should be 10%)
- Verify purchase amount matches transaction amount

### Issue: Commission shows but affiliate dashboard doesn't update
**Solution**:
- Refresh the dashboard
- Check if `commission_earned` in `affiliates` table is updated
- Verify RLS policies allow viewing commissions

## Next Steps

After fixing affiliate tracking:
1. Configure Polar (see `POLAR_SETUP_GUIDE.md`)
2. Set up per-EA plans (see migration file)
3. Test end-to-end purchase flow
4. Monitor webhook logs for any errors
