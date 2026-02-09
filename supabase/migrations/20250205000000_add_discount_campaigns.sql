-- Discount campaigns: promo codes, launch offers, festive sales, affiliate reward campaigns
-- Run this in Supabase SQL Editor if you haven't run it via migrations.

-- Table: discount_campaigns
CREATE TABLE IF NOT EXISTS public.discount_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(12, 2) NOT NULL,
  promo_code TEXT,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
  product_ids JSONB,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_redemptions INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discount_campaigns_dates ON public.discount_campaigns(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_discount_campaigns_promo_code ON public.discount_campaigns(promo_code) WHERE promo_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_discount_campaigns_affiliate ON public.discount_campaigns(affiliate_id) WHERE affiliate_id IS NOT NULL;

ALTER TABLE public.discount_campaigns ENABLE ROW LEVEL SECURITY;

-- Anyone can read active campaigns (for checkout promo validation)
CREATE POLICY "Anyone can read active discount campaigns"
ON public.discount_campaigns FOR SELECT
USING (
  is_active = true
  AND now() >= starts_at
  AND now() <= ends_at
  AND (max_redemptions IS NULL OR redemption_count < max_redemptions)
);

-- Admins and workers can manage all campaigns
CREATE POLICY "Admins can manage discount campaigns"
ON public.discount_campaigns FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin', 'worker')
  )
);

-- Trigger to keep updated_at in sync (requires update_updated_at_column to exist from an earlier migration)
DROP TRIGGER IF EXISTS update_discount_campaigns_updated_at ON public.discount_campaigns;
CREATE TRIGGER update_discount_campaigns_updated_at
BEFORE UPDATE ON public.discount_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Optional: award commission with explicit referrer (e.g. from promo code at checkout)
CREATE OR REPLACE FUNCTION public.award_referral_commission(
  referred_user_id_param UUID,
  transaction_id_param TEXT,
  product_id_param UUID,
  product_name_param TEXT,
  purchase_amount_param DECIMAL(12, 2),
  referrer_user_id_override UUID DEFAULT NULL
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
  IF referrer_user_id_override IS NOT NULL THEN
    referrer_user_id := referrer_user_id_override;
  ELSE
    SELECT referred_by INTO referrer_user_id
    FROM public.profiles
    WHERE user_id = referred_user_id_param;
  END IF;

  IF referrer_user_id IS NOT NULL AND referrer_user_id != referred_user_id_param THEN
    SELECT * INTO affiliate_record
    FROM public.affiliates
    WHERE user_id = referrer_user_id
    LIMIT 1;

    IF affiliate_record IS NOT NULL THEN
      commission_rate := public.calculate_commission_rate(referrer_user_id);
      commission_amount := (purchase_amount_param * commission_rate / 100.0);

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
        'approved'
      )
      RETURNING id INTO commission_id;

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

GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, UUID, TEXT, DECIMAL, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_commission(UUID, TEXT, UUID, TEXT, DECIMAL, UUID) TO service_role;

COMMENT ON TABLE public.discount_campaigns IS 'Promo codes and discount campaigns for checkout';
