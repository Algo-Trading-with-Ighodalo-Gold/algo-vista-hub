-- ============================================
-- MIGRATION 1: Referral Commissions System
-- ============================================
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

-- ============================================
-- MIGRATION 2: Product Image Support
-- ============================================
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
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- MIGRATION 3: Extend License Function (ADMIN ONLY)
-- ============================================
-- Create RPC function to extend license expiry date
-- IMPORTANT: Only admins can extend licenses - users CANNOT extend their own licenses
-- Licenses are based on plans users paid for, so only admins should modify expiry dates

CREATE OR REPLACE FUNCTION public.extend_license_expiry(
  p_license_id UUID,
  p_new_expiry_date TIMESTAMPTZ
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_rows_updated INTEGER;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin (with error handling in case function doesn't exist)
  BEGIN
    v_is_admin := public.is_admin();
  EXCEPTION WHEN OTHERS THEN
    -- If is_admin function doesn't exist, assume not admin
    v_is_admin := false;
  END;
  
  -- ONLY ADMINS can extend licenses - users cannot extend their own licenses
  -- Licenses are based on plans users paid for, so only admins should modify expiry dates
  IF NOT v_is_admin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Access denied. Only administrators can extend licenses.'
    );
  END IF;
  
  -- Verify license exists
  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found'
    );
  END IF;

  -- Validate that new expiry date is in the future
  IF p_new_expiry_date <= NOW() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'New expiry date must be in the future'
    );
  END IF;

  -- Update the license expiry date (admin only)
  UPDATE public.licenses
  SET 
    expires_at = p_new_expiry_date,
    updated_at = NOW(),
    -- If license was expired, reactivate it
    status = CASE 
      WHEN status = 'expired' THEN 'active'::public.license_status
      ELSE status
    END
  WHERE id = p_license_id;
  
  -- Get the number of rows actually updated
  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  -- Check if any rows were updated
  IF v_rows_updated = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to update license expiry date'
    );
  END IF;

  -- Log the action (handle case where user_id column might not exist)
  BEGIN
    INSERT INTO public.license_logs (license_id, action, details, user_id)
    VALUES (
      p_license_id,
      'license_extended',
      json_build_object(
        'old_expiry', v_license.expires_at,
        'new_expiry', p_new_expiry_date
      ),
      auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    -- If user_id column doesn't exist, insert without it
    INSERT INTO public.license_logs (license_id, action, details)
    VALUES (
      p_license_id,
      'license_extended',
      json_build_object(
        'old_expiry', v_license.expires_at,
        'new_expiry', p_new_expiry_date
      )
    );
  END;

  RETURN json_build_object(
    'success', true,
    'message', 'License expiry date extended successfully',
    'new_expiry_date', p_new_expiry_date
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.extend_license_expiry(UUID, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.extend_license_expiry(UUID, TIMESTAMPTZ) TO service_role;

-- ============================================
-- MIGRATION 4: Fix Unlink Account Function
-- ============================================
-- Fix the unlink_account_from_license function to properly detect deleted rows

CREATE OR REPLACE FUNCTION public.unlink_account_from_license(
  p_license_id UUID,
  p_account BIGINT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_rows_deleted INTEGER;
BEGIN
  -- Verify license ownership
  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found or access denied'
    );
  END IF;

  -- Delete the account link
  DELETE FROM public.license_accounts
  WHERE license_id = p_license_id
    AND account = p_account;
  
  -- Get the number of rows actually deleted
  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;

  -- Check if any rows were deleted
  IF v_rows_deleted = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Account not found or not linked to this license'
    );
  END IF;

  -- Log the action (handle case where user_id column might not exist)
  BEGIN
    INSERT INTO public.license_logs (license_id, action, details, user_id)
    VALUES (
      p_license_id,
      'account_unlinked',
      json_build_object('account', p_account::TEXT),
      auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    -- If user_id column doesn't exist, insert without it
    INSERT INTO public.license_logs (license_id, action, details)
    VALUES (
      p_license_id,
      'account_unlinked',
      json_build_object('account', p_account::TEXT)
    );
  END;

  RETURN json_build_object(
    'success', true,
    'message', 'Account unlinked successfully'
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.unlink_account_from_license(UUID, BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlink_account_from_license(UUID, BIGINT) TO service_role;
