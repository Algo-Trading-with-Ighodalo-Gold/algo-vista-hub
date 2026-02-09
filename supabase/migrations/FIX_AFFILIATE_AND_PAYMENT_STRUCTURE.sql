-- Migration: Fix Affiliate Commission Tracking and Add Per-EA Plans Structure
-- This fixes affiliate commission tracking and adds support for different plans per EA

-- ============================================
-- 1. FIX AFFILIATE COMMISSION FUNCTION
-- ============================================

-- Drop and recreate the award_referral_commission function with correct signature
DROP FUNCTION IF EXISTS public.award_referral_commission(UUID, TEXT, UUID, TEXT, DECIMAL);
DROP FUNCTION IF EXISTS public.award_referral_commission(UUID, TEXT, TEXT, TEXT, DECIMAL);

CREATE OR REPLACE FUNCTION public.award_referral_commission(
  referred_user_id_param UUID,
  transaction_id_param TEXT,
  product_id_param TEXT,
  product_name_param TEXT,
  purchase_amount_param DECIMAL
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
      -- Calculate commission rate (use flat 10% for now, or use calculate_commission_rate function if it exists)
      BEGIN
        commission_rate := public.calculate_commission_rate(referrer_user_id);
      EXCEPTION WHEN OTHERS THEN
        -- If function doesn't exist, use flat 10%
        commission_rate := 10.00;
      END;

      -- Calculate commission amount (purchase_amount is in base currency, e.g., Naira)
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
      SET commission_earned = COALESCE(commission_earned, 0) + commission_amount,
          updated_at = now()
      WHERE id = affiliate_record.id;

      RETURN commission_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, TEXT, TEXT, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, TEXT, TEXT, DECIMAL) TO service_role;

-- ============================================
-- 2. CREATE PER-EA PLANS STRUCTURE
-- ============================================

-- Create ea_plans table for different plans per EA
CREATE TABLE IF NOT EXISTS public.ea_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL, -- References products.product_code or products.id
  plan_code TEXT NOT NULL, -- e.g., 'BASIC', 'PRO', 'PREMIUM'
  plan_name TEXT NOT NULL, -- e.g., 'Basic Plan', 'Pro Plan'
  description TEXT,
  price_cents INTEGER NOT NULL, -- Price in cents
  currency TEXT DEFAULT 'NGN',
  duration_days INTEGER, -- License duration in days (NULL = lifetime)
  max_concurrent_sessions INTEGER DEFAULT 1,
  max_mt5_accounts INTEGER DEFAULT 1,
  features TEXT[], -- Array of feature descriptions
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, plan_code)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ea_plans_product_id ON public.ea_plans(product_id);
CREATE INDEX IF NOT EXISTS idx_ea_plans_is_active ON public.ea_plans(is_active);

-- Enable RLS
ALTER TABLE public.ea_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ea_plans
DROP POLICY IF EXISTS "EA plans are viewable by everyone" ON public.ea_plans;
CREATE POLICY "EA plans are viewable by everyone" ON public.ea_plans
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage EA plans" ON public.ea_plans;
CREATE POLICY "Admins can manage EA plans" ON public.ea_plans
  FOR ALL USING (public.is_admin());

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_ea_plans_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_ea_plans_updated_at ON public.ea_plans;
CREATE TRIGGER update_ea_plans_updated_at
  BEFORE UPDATE ON public.ea_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ea_plans_updated_at();

-- ============================================
-- 3. UPDATE PAYSTACK WEBHOOK TO USE CORRECT FUNCTION SIGNATURE
-- ============================================
-- Note: The webhook code needs to be updated to match the new function signature
-- This SQL just ensures the function exists with the correct signature

-- ============================================
-- 4. ADD HELPER FUNCTION TO GET EA PLANS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_ea_plans(p_product_id TEXT)
RETURNS TABLE (
  id UUID,
  product_id TEXT,
  plan_code TEXT,
  plan_name TEXT,
  description TEXT,
  price_cents INTEGER,
  currency TEXT,
  duration_days INTEGER,
  max_concurrent_sessions INTEGER,
  max_mt5_accounts INTEGER,
  features TEXT[],
  is_active BOOLEAN,
  display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ep.id,
    ep.product_id,
    ep.plan_code,
    ep.plan_name,
    ep.description,
    ep.price_cents,
    ep.currency,
    ep.duration_days,
    ep.max_concurrent_sessions,
    ep.max_mt5_accounts,
    ep.features,
    ep.is_active,
    ep.display_order
  FROM public.ea_plans ep
  WHERE ep.product_id = p_product_id
    AND ep.is_active = true
  ORDER BY ep.display_order ASC, ep.price_cents ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_ea_plans(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ea_plans(TEXT) TO anon;

-- ============================================
-- 5. VERIFY REFERRAL COMMISSION FUNCTION WORKS
-- ============================================
-- Test query (uncomment to test):
-- SELECT public.award_referral_commission(
--   'USER_ID_HERE'::UUID,
--   'TXN_REF_123',
--   'PRODUCT_ID',
--   'Product Name',
--   10000.00 -- Amount in base currency
-- );

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE public.ea_plans IS 'Stores different pricing plans for each EA product';
COMMENT ON FUNCTION public.award_referral_commission IS 'Awards referral commission when a referred user makes a purchase';
COMMENT ON FUNCTION public.get_ea_plans IS 'Returns all active plans for a specific EA product';
