# 📋 Supabase SQL Setup - All Required Migrations

Copy and paste these SQL blocks into your Supabase SQL Editor and run them in order.

---

## 1. Referral Commissions System (Purchase-Based)

**File:** `supabase/migrations/20250203000000_add_referral_commissions.sql`

```sql
-- Migration: Add Referral Commissions System
-- This migration adds commission tracking for affiliate referrals when users purchase products

-- Create referral_commissions table to track commissions from purchases
CREATE TABLE IF NOT EXISTS public.referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT, -- Paystack reference or transaction ID
  product_id UUID, -- Product that was purchased
  product_name TEXT,
  purchase_amount DECIMAL(12, 2) NOT NULL, -- Amount in cents (will be converted)
  commission_rate DECIMAL(5, 2) NOT NULL, -- Commission percentage (e.g., 20.00 for 20%)
  commission_amount DECIMAL(12, 2) NOT NULL, -- Calculated commission amount
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_referral_commissions_affiliate_id ON public.referral_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referrer_user_id ON public.referral_commissions(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referred_user_id ON public.referral_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_status ON public.referral_commissions(status);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_transaction_id ON public.referral_commissions(transaction_id);

-- Enable RLS
ALTER TABLE public.referral_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_commissions
DROP POLICY IF EXISTS "Users can view their own commissions" ON public.referral_commissions;
DROP POLICY IF EXISTS "Admins can view all commissions" ON public.referral_commissions;

CREATE POLICY "Users can view their own commissions"
ON public.referral_commissions
FOR SELECT
USING (auth.uid() = referrer_user_id);

CREATE POLICY "Admins can view all commissions"
ON public.referral_commissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'worker')
  )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_referral_commissions_updated_at ON public.referral_commissions;
CREATE TRIGGER update_referral_commissions_updated_at
BEFORE UPDATE ON public.referral_commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate commission rate - fixed at 10%
CREATE OR REPLACE FUNCTION public.calculate_commission_rate(affiliate_user_id UUID)
RETURNS DECIMAL(5, 2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  commission_rate DECIMAL(5, 2);
BEGIN
  -- Fixed commission rate of 10% for all affiliates
  commission_rate := 10.00;

  RETURN commission_rate;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.calculate_commission_rate(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_commission_rate(UUID) TO service_role;

-- Function to award commission when a referred user makes a purchase
CREATE OR REPLACE FUNCTION public.award_referral_commission(
  referred_user_id_param UUID,
  transaction_id_param TEXT,
  product_id_param UUID,
  product_name_param TEXT,
  purchase_amount_param DECIMAL(12, 2)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id UUID;
  affiliate_record RECORD;
  commission_rate DECIMAL(5, 2);
  commission_amount DECIMAL(12, 2);
  commission_id UUID;
BEGIN
  -- Find the referrer (affiliate) for this user
  SELECT referred_by INTO referrer_user_id
  FROM public.profiles
  WHERE user_id = referred_user_id_param;

  -- If user was referred, award commission
  IF referrer_user_id IS NOT NULL THEN
    -- Get affiliate record
    SELECT * INTO affiliate_record
    FROM public.affiliates
    WHERE user_id = referrer_user_id
    LIMIT 1;

    -- If affiliate exists, calculate and award commission
    IF affiliate_record IS NOT NULL THEN
      -- Calculate commission rate based on tier
      commission_rate := public.calculate_commission_rate(referrer_user_id);

      -- Calculate commission amount (convert purchase_amount from cents to dollars if needed)
      -- Assuming purchase_amount is already in the base currency (e.g., Naira)
      commission_amount := (purchase_amount_param * commission_rate / 100.0);

      -- Create commission record
      INSERT INTO public.referral_commissions (
        affiliate_id,
        referrer_user_id,
        referred_user_id,
        transaction_id,
        product_id,
        product_name,
        purchase_amount,
        commission_rate,
        commission_amount,
        status
      )
      VALUES (
        affiliate_record.id,
        referrer_user_id,
        referred_user_id_param,
        transaction_id_param,
        product_id_param,
        product_name_param,
        purchase_amount_param,
        commission_rate,
        commission_amount,
        'approved' -- Auto-approve commissions
      )
      RETURNING id INTO commission_id;

      -- Update affiliate's total commission earned
      UPDATE public.affiliates
      SET commission_earned = commission_earned + commission_amount,
          updated_at = now()
      WHERE id = affiliate_record.id;

      RETURN commission_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, UUID, TEXT, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, UUID, TEXT, DECIMAL) TO service_role;

-- Add a function to get affiliate stats including purchases
CREATE OR REPLACE FUNCTION public.get_affiliate_stats(affiliate_user_id UUID)
RETURNS TABLE (
  total_commissions DECIMAL(12, 2),
  pending_commissions DECIMAL(12, 2),
  paid_commissions DECIMAL(12, 2),
  total_sales INTEGER,
  recent_sales INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(commission_amount), 0)::DECIMAL(12, 2) as total_commissions,
    COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0)::DECIMAL(12, 2) as pending_commissions,
    COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0)::DECIMAL(12, 2) as paid_commissions,
    COUNT(*)::INTEGER as total_sales,
    COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '30 days')::INTEGER as recent_sales
  FROM public.referral_commissions
  WHERE referrer_user_id = affiliate_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_affiliate_stats(UUID) TO authenticated;
```

---

## 2. Product Image Support (EA Image Uploads)

**File:** `supabase/migrations/20250203000001_add_product_image_support.sql`

```sql
-- Migration: Add Product Image Support
-- Adds image_key column to products table for storing product images

-- Add image_key column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image_key'
  ) THEN
    ALTER TABLE public.products ADD COLUMN image_key TEXT;
  END IF;
END $$;

-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product images
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

---

## 📝 How to Apply These Migrations

### ⚠️ IMPORTANT: Use the Clean SQL File!

**Don't copy from this markdown file!** Instead, use the clean SQL file:

**File:** `supabase/migrations/APPLY_ALL_NEW_MIGRATIONS.sql`

This file contains ONLY the SQL code without any markdown formatting.

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/APPLY_ALL_NEW_MIGRATIONS.sql`
4. Copy the **ENTIRE** contents of that file
5. Paste into SQL Editor
6. Click **Run**
7. Done! Both migrations will run in order

### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

---

## ✅ What These Migrations Do

### Migration 1: Referral Commissions
- Creates `referral_commissions` table to track purchase-based commissions
- Sets up 10% flat commission rate for all affiliates
- Creates functions to award commissions automatically when purchases are made
- Adds RLS policies for security
- Creates indexes for better performance

### Migration 2: Product Image Support
- Adds `image_key` column to `products` table
- Creates `product-images` storage bucket in Supabase Storage
- Sets up storage policies for public read and authenticated upload/update/delete

---

## 🔍 Verify Installation

After running the migrations, verify they worked:

```sql
-- Check if referral_commissions table exists
SELECT * FROM public.referral_commissions LIMIT 1;

-- Check if image_key column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'image_key';

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-images';
```

---

## ⚠️ Important Notes

1. **Run migrations in order** - Migration 1 must run before Migration 2
2. **Backup your database** - Always backup before running migrations
3. **Test in development first** - Test these migrations in a development environment before production
4. **Storage bucket** - The `product-images` bucket will be created automatically if it doesn't exist

---

## 🚀 After Running Migrations

Once these are applied:
- ✅ Affiliate commissions will be tracked automatically when users purchase products
- ✅ EA products can have images uploaded via the admin panel
- ✅ Images will be stored in Supabase Storage and displayed on the products page
- ✅ All commission calculations use a flat 10% rate

---

## 🔧 Edge Functions Deployment

You also need to deploy/update these Edge Functions in Supabase:

### Required Edge Functions:
1. **paystack-initialize** - Initializes Paystack payments
2. **paystack-verify** - Verifies Paystack transactions
3. **paystack-webhook** - Handles Paystack webhook events (awards commissions)
4. **create-license** - Creates licenses after successful payment
5. **sync-license-to-cloudflare** - Syncs licenses to Cloudflare Worker (optional)

### Deploy Edge Functions:

**Option 1: Using Supabase CLI (Recommended)**
```bash
# Deploy all functions
supabase functions deploy paystack-initialize
supabase functions deploy paystack-verify
supabase functions deploy paystack-webhook
supabase functions deploy create-license
supabase functions deploy sync-license-to-cloudflare
```

**Option 2: Using Supabase Dashboard**
1. Go to **Edge Functions** in your Supabase Dashboard
2. For each function, click **Deploy** or **Update**
3. Upload the function code from `supabase/functions/[function-name]/index.ts`

### Environment Variables Required:

Make sure these are set in your Supabase project settings:

- `PAYSTACK_SECRET_KEY` - Your Paystack secret key
- `PAYSTACK_PUBLIC_KEY` - Your Paystack public key (if needed)
- `PAYSTACK_WEBHOOK_SECRET` - Your Paystack webhook secret (optional but recommended)
- `SUPABASE_URL` - Your Supabase project URL (auto-set)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (auto-set)
- `CLOUDFLARE_WORKER_URL` - Your Cloudflare Worker URL (only if using sync-license-to-cloudflare)

### Set Environment Variables:
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add each secret key listed above
3. Click **Save**

---

## 📋 Complete Setup Checklist

- [ ] Run Migration 1: Referral Commissions System
- [ ] Run Migration 2: Product Image Support
- [ ] Deploy Edge Function: paystack-initialize
- [ ] Deploy Edge Function: paystack-verify
- [ ] Deploy Edge Function: paystack-webhook
- [ ] Deploy Edge Function: create-license
- [ ] Set environment variables in Supabase
- [ ] Test payment flow
- [ ] Test image upload in admin panel
- [ ] Verify commissions are being tracked
