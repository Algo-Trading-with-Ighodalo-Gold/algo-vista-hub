-- Create enums for licensing system (with IF NOT EXISTS)
DO $$ BEGIN
    CREATE TYPE public.license_type AS ENUM ('individual_ea', 'basic_tier', 'premium_tier', 'enterprise_tier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.license_status AS ENUM ('active', 'expired', 'suspended', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.validation_result AS ENUM ('valid', 'expired', 'hardware_mismatch', 'concurrent_violation', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enhanced licenses table with strong protection
CREATE TABLE IF NOT EXISTS public.licenses_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_key TEXT NOT NULL UNIQUE,
  license_type public.license_type NOT NULL,
  status public.license_status NOT NULL DEFAULT 'active',
  
  -- EA-specific licensing
  ea_product_id TEXT, -- NULL for tier-based licenses
  ea_product_name TEXT,
  
  -- Hardware fingerprinting for strong protection
  hardware_fingerprint TEXT,
  max_concurrent_sessions INTEGER DEFAULT 1,
  current_active_sessions INTEGER DEFAULT 0,
  
  -- Subscription linking
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- License validity
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  last_validated_at TIMESTAMPTZ,
  
  -- Security features
  validation_count INTEGER DEFAULT 0,
  max_validations_per_hour INTEGER DEFAULT 60,
  last_hour_validations INTEGER DEFAULT 0,
  last_hour_reset TIMESTAMPTZ DEFAULT now(),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- License validation sessions for concurrent session tracking
CREATE TABLE IF NOT EXISTS public.license_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses_new(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  hardware_fingerprint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  mt5_account_number TEXT,
  ea_instance_id TEXT,
  
  -- Session lifecycle
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- License validation logs for security monitoring
CREATE TABLE IF NOT EXISTS public.license_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses_new(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.license_sessions(id) ON DELETE SET NULL,
  
  -- Validation details
  validation_result public.validation_result NOT NULL,
  hardware_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  mt5_account_number TEXT,
  ea_instance_id TEXT,
  
  -- Security data
  suspicious_activity BOOLEAN DEFAULT false,
  failure_reason TEXT,
  
  validated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EA products catalog
CREATE TABLE IF NOT EXISTS public.ea_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  price_cents INTEGER,
  stripe_price_id TEXT,
  
  -- License restrictions
  max_concurrent_sessions INTEGER DEFAULT 1,
  max_mt5_accounts INTEGER DEFAULT 1,
  requires_hardware_binding BOOLEAN DEFAULT true,
  
  -- Product status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscription tier definitions
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT,
  
  -- Tier benefits
  included_eas TEXT[] DEFAULT '{}', -- Array of EA product codes
  max_concurrent_sessions INTEGER DEFAULT 1,
  max_mt5_accounts INTEGER DEFAULT 1,
  
  -- Tier status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Replace old licenses table
DROP TABLE IF EXISTS public.licenses CASCADE;
ALTER TABLE public.licenses_new RENAME TO licenses;

-- Enable RLS on all tables
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ea_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for licenses
CREATE POLICY "Users can view their own licenses" ON public.licenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage all licenses" ON public.licenses
  FOR ALL USING (true);

-- RLS Policies for license_sessions  
CREATE POLICY "Service can manage all sessions" ON public.license_sessions
  FOR ALL USING (true);

-- RLS Policies for license_validations
CREATE POLICY "Service can manage all validations" ON public.license_validations
  FOR ALL USING (true);

-- RLS Policies for public tables
CREATE POLICY "Anyone can view active EA products" ON public.ea_products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active subscription tiers" ON public.subscription_tiers
  FOR SELECT USING (is_active = true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON public.licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires_at ON public.licenses(expires_at);
CREATE INDEX IF NOT EXISTS idx_licenses_stripe_subscription_id ON public.licenses(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_license_sessions_license_id ON public.license_sessions(license_id);
CREATE INDEX IF NOT EXISTS idx_license_sessions_session_token ON public.license_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_license_sessions_is_active ON public.license_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_license_validations_license_id ON public.license_validations(license_id);

-- Functions for license management
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Generate format: XXXX-XXXX-XXXX-XXXX
  FOR i IN 1..4 LOOP
    FOR j IN 1..4 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    IF i < 4 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Mark expired sessions as inactive
  UPDATE public.license_sessions 
  SET is_active = false 
  WHERE is_active = true 
    AND (expires_at < now() OR last_heartbeat < now() - INTERVAL '5 minutes');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Update concurrent session counts
  UPDATE public.licenses 
  SET current_active_sessions = (
    SELECT COUNT(*) 
    FROM public.license_sessions 
    WHERE license_id = licenses.id AND is_active = true
  );
  
  RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updates
CREATE TRIGGER update_licenses_updated_at
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ea_products_updated_at
  BEFORE UPDATE ON public.ea_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.ea_products (product_code, name, description, price_cents, max_concurrent_sessions) VALUES
('CRYPTO_PULSE', 'Crypto Pulse EA', 'Advanced cryptocurrency trading EA with AI-powered signals', 29900, 1),
('GOLD_RUSH', 'Gold Rush EA', 'Professional gold trading algorithm with risk management', 39900, 1),
('GRID_TRADER', 'Grid Trader EA', 'Sophisticated grid trading system for multiple pairs', 49900, 2),
('NIGHT_OWL', 'Night Owl EA', 'Night session scalping EA for Asian markets', 34900, 1),
('SCALPER_PRO', 'Scalper Pro EA', 'High-frequency scalping with advanced filters', 44900, 1),
('SWING_MASTER', 'Swing Master EA', 'Long-term swing trading with trend analysis', 35900, 1),
('TREND_RIDER', 'Trend Rider EA', 'Trend-following EA with dynamic position sizing', 41900, 1)
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO public.subscription_tiers (tier_code, name, description, price_cents, included_eas, max_concurrent_sessions, max_mt5_accounts) VALUES
('BASIC', 'Basic Plan', 'Access to 3 EAs with basic features', 7900, '{CRYPTO_PULSE,GOLD_RUSH,NIGHT_OWL}', 1, 1),
('PREMIUM', 'Premium Plan', 'Access to 5 EAs with advanced features', 14900, '{CRYPTO_PULSE,GOLD_RUSH,GRID_TRADER,NIGHT_OWL,SCALPER_PRO}', 2, 2),
('ENTERPRISE', 'Enterprise Plan', 'Access to all EAs with maximum features', 24900, '{CRYPTO_PULSE,GOLD_RUSH,GRID_TRADER,NIGHT_OWL,SCALPER_PRO,SWING_MASTER,TREND_RIDER}', 5, 5)
ON CONFLICT (tier_code) DO NOTHING;