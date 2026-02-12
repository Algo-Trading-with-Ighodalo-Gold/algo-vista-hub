-- Polar-backed EA plan catalog and checkout mapping
-- Business model: EA x tier x term

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ea_plan_tier') THEN
    CREATE TYPE public.ea_plan_tier AS ENUM ('basic', 'pro', 'premium');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ea_plan_term') THEN
    CREATE TYPE public.ea_plan_term AS ENUM ('monthly', 'quarterly', 'yearly');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.ea_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ea_id UUID NOT NULL,
  tier public.ea_plan_tier NOT NULL,
  term public.ea_plan_term NOT NULL,
  max_accounts INTEGER NOT NULL CHECK (max_accounts >= 1),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  promo_code TEXT NULL,
  polar_discount_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ea_id, tier, term)
);

CREATE TABLE IF NOT EXISTS public.ea_plan_polar (
  ea_plan_id UUID PRIMARY KEY REFERENCES public.ea_plans(id) ON DELETE CASCADE,
  polar_product_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.polar_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB NULL
);

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS ea_plan_id UUID NULL REFERENCES public.ea_plans(id) ON DELETE SET NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS plan_tier public.ea_plan_tier NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS plan_term public.ea_plan_term NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS max_accounts INTEGER NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS polar_checkout_id TEXT NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT NULL;

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS polar_order_id TEXT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_licenses_polar_checkout_id
  ON public.licenses(polar_checkout_id)
  WHERE polar_checkout_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_licenses_polar_subscription_id
  ON public.licenses(polar_subscription_id)
  WHERE polar_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ea_plans_ea_id ON public.ea_plans(ea_id);
CREATE INDEX IF NOT EXISTS idx_ea_plans_active ON public.ea_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_licenses_ea_plan_id ON public.licenses(ea_plan_id);

ALTER TABLE public.ea_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ea_plan_polar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active EA plans" ON public.ea_plans;
CREATE POLICY "Public can view active EA plans"
  ON public.ea_plans
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage EA plans" ON public.ea_plans;
CREATE POLICY "Admins can manage EA plans"
  ON public.ea_plans
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage EA plan polar mapping" ON public.ea_plan_polar;
CREATE POLICY "Admins can manage EA plan polar mapping"
  ON public.ea_plan_polar
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Service role can manage polar webhook events" ON public.polar_webhook_events;
CREATE POLICY "Service role can manage polar webhook events"
  ON public.polar_webhook_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.update_ea_plans_updated_at_new()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_ea_plans_updated_at_new ON public.ea_plans;
CREATE TRIGGER trg_update_ea_plans_updated_at_new
BEFORE UPDATE ON public.ea_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_ea_plans_updated_at_new();
