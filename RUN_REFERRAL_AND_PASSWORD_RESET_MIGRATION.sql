-- ============================================
-- REFERRAL TRACKING & PASSWORD RESET MIGRATION
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This adds referral tracking and password reset tracking features
-- ============================================

-- Add referred_by column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- Add password_reset_tracking table to track password reset events
CREATE TABLE IF NOT EXISTS public.password_reset_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reset_requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reset_completed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on password_reset_tracking
ALTER TABLE public.password_reset_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own password reset history" ON public.password_reset_tracking;
DROP POLICY IF EXISTS "Admins can view all password reset tracking" ON public.password_reset_tracking;

-- Create policies for password_reset_tracking
CREATE POLICY "Users can view their own password reset history" 
ON public.password_reset_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all password reset tracking
CREATE POLICY "Admins can view all password reset tracking" 
ON public.password_reset_tracking 
FOR SELECT 
USING (public.is_admin());

-- Create function to track referral clicks
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
      NULL, -- IP address tracking would need to be passed from client
      NULL, -- User agent tracking would need to be passed from client
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

-- Create function to link referral on signup
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
    -- Note: This uses a subquery to get the most recent click
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

-- ============================================
-- VERIFICATION (optional)
-- ============================================
-- Test referral click tracking:
-- SELECT public.track_referral_click('YOUR_REFERRAL_CODE');

-- Test referral linking (after user signup):
-- SELECT public.link_referral_on_signup('USER_ID', 'REFERRAL_CODE');

