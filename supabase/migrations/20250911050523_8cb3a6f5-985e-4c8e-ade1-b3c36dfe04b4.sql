-- Create affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  commission_earned DOUBLE PRECISION NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and policies for affiliates
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'affiliates' AND policyname = 'Users can view their own affiliate data'
  ) THEN
    CREATE POLICY "Users can view their own affiliate data"
    ON public.affiliates
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'affiliates' AND policyname = 'Users can insert their own affiliate record'
  ) THEN
    CREATE POLICY "Users can insert their own affiliate record"
    ON public.affiliates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'affiliates' AND policyname = 'Users can update their own affiliate record'
  ) THEN
    CREATE POLICY "Users can update their own affiliate record"
    ON public.affiliates
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger for affiliates.updated_at
DROP TRIGGER IF EXISTS update_affiliates_updated_at ON public.affiliates;
CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- Create ea_development table
CREATE TABLE IF NOT EXISTS public.ea_development (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  strategy_name TEXT NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and policies for ea_development
ALTER TABLE public.ea_development ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ea_development' AND policyname = 'Users can view their own EA development requests'
  ) THEN
    CREATE POLICY "Users can view their own EA development requests"
    ON public.ea_development
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ea_development' AND policyname = 'Users can insert their own EA development requests'
  ) THEN
    CREATE POLICY "Users can insert their own EA development requests"
    ON public.ea_development
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ea_development' AND policyname = 'Users can update their own EA development requests'
  ) THEN
    CREATE POLICY "Users can update their own EA development requests"
    ON public.ea_development
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger for ea_development.updated_at
DROP TRIGGER IF EXISTS update_ea_development_updated_at ON public.ea_development;
CREATE TRIGGER update_ea_development_updated_at
BEFORE UPDATE ON public.ea_development
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();