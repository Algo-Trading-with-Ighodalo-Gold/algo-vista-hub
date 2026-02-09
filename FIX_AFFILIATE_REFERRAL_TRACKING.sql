-- Fix Affiliate Referral Tracking
-- This script ensures all referral tracking tables and functions are properly set up

-- 1. Ensure referral_clicks table exists
CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on referral_clicks
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own referral clicks" ON public.referral_clicks;
DROP POLICY IF EXISTS "Users can insert their own referral clicks" ON public.referral_clicks;
DROP POLICY IF EXISTS "Admins can view all referral clicks" ON public.referral_clicks;

-- Create policies for referral_clicks
CREATE POLICY "Users can view their own referral clicks"
ON public.referral_clicks
FOR SELECT
USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can insert their own referral clicks"
ON public.referral_clicks
FOR INSERT
WITH CHECK (true); -- Allow anonymous users to track clicks

CREATE POLICY "Admins can view all referral clicks"
ON public.referral_clicks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'worker')
  )
);

-- 2. Ensure referred_by column exists in profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- 3. Ensure affiliates table exists (should already exist, but just in case)
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  commission_earned DOUBLE PRECISION NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Recreate the track_referral_click function
CREATE OR REPLACE FUNCTION public.track_referral_click(referral_code_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id UUID;
  click_id UUID;
BEGIN
  -- Find the user_id associated with the referral code
  SELECT user_id INTO referrer_user_id
  FROM public.affiliates
  WHERE referral_code = referral_code_param
  LIMIT 1;

  -- If referral code found, track the click
  IF referrer_user_id IS NOT NULL THEN
    INSERT INTO public.referral_clicks (
      referrer_user_id,
      ip_address,
      user_agent,
      clicked_at
    )
    VALUES (
      referrer_user_id,
      NULL, -- IP address would need to be passed from client
      NULL, -- User agent would need to be passed from client
      now()
    )
    RETURNING id INTO click_id;

    RETURN click_id;
  END IF;

  RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.track_referral_click(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_referral_click(TEXT) TO anon;

-- 5. Recreate the link_referral_on_signup function
CREATE OR REPLACE FUNCTION public.link_referral_on_signup(
  new_user_id UUID,
  referral_code_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  -- Find the user_id associated with the referral code
  SELECT user_id INTO referrer_user_id
  FROM public.affiliates
  WHERE referral_code = referral_code_param
  LIMIT 1;

  -- If referral code found and not self-referral, link it
  IF referrer_user_id IS NOT NULL AND referrer_user_id != new_user_id THEN
    -- Update the new user's profile with referred_by
    UPDATE public.profiles
    SET referred_by = referrer_user_id
    WHERE user_id = new_user_id;

    -- Mark the most recent referral click as converted
    UPDATE public.referral_clicks rc
    SET converted = true,
        conversion_date = now()
    WHERE rc.id = (
      SELECT id
      FROM public.referral_clicks
      WHERE referrer_user_id = link_referral_on_signup.referrer_user_id
        AND converted = false
        AND clicked_at > now() - INTERVAL '30 days'
      ORDER BY clicked_at DESC
      LIMIT 1
    );

    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.link_referral_on_signup(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_referral_on_signup(UUID, TEXT) TO anon;

-- 6. Add RLS policy for profiles to allow viewing referred users
DROP POLICY IF EXISTS "Users can view profiles they referred" ON public.profiles;
CREATE POLICY "Users can view profiles they referred"
ON public.profiles
FOR SELECT
USING (
  referred_by = auth.uid() OR
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
    AND p.role IN ('admin', 'worker')
  )
);

-- Verification queries (uncomment to test):
-- SELECT COUNT(*) FROM public.referral_clicks;
-- SELECT COUNT(*) FROM public.profiles WHERE referred_by IS NOT NULL;
-- SELECT COUNT(*) FROM public.affiliates;
