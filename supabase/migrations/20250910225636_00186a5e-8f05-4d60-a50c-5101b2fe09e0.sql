-- Create ea_development table for EA customization requests
CREATE TABLE public.ea_development (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  strategy_name TEXT NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ea_development
ALTER TABLE public.ea_development ENABLE ROW LEVEL SECURITY;

-- Create policies for ea_development
CREATE POLICY "Users can view their own EA development requests" 
ON public.ea_development 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own EA development requests" 
ON public.ea_development 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own EA development requests" 
ON public.ea_development 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create affiliate_applications table
CREATE TABLE public.affiliate_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  social_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on affiliate_applications
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliate_applications
CREATE POLICY "Users can view their own affiliate applications" 
ON public.affiliate_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate applications" 
ON public.affiliate_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create referral_clicks table for tracking
CREATE TABLE public.referral_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on referral_clicks
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_clicks
CREATE POLICY "Users can view their own referral clicks" 
ON public.referral_clicks 
FOR SELECT 
USING (auth.uid() = referrer_user_id);

-- Add click tracking columns to affiliates table if needed
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS total_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_conversions INTEGER DEFAULT 0;