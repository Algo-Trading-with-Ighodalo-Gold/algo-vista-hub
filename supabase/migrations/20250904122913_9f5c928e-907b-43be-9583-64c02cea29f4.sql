-- Add required columns to profiles table for the authentication requirements
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS affiliate_code text UNIQUE,
ADD COLUMN IF NOT EXISTS eas_data jsonb DEFAULT '{}';

-- Create index on affiliate_code for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON public.profiles(affiliate_code);

-- Update existing profiles to have default subscription status
UPDATE public.profiles 
SET subscription_status = 'free' 
WHERE subscription_status IS NULL;