-- Migration: Update EA products catalog with real data
-- Adds extended metadata columns and seeds real EA entries

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'short_description'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN short_description TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'key_features'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN key_features TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'trading_pairs'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN trading_pairs TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'timeframes'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN timeframes TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'strategy_type'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN strategy_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'min_deposit'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN min_deposit TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'avg_monthly_return'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN avg_monthly_return TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'max_drawdown'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN max_drawdown TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'performance'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN performance TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'image_key'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN image_key TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'risk_level'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN risk_level TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'price_label'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN price_label TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'rating'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN rating NUMERIC(3,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'reviews'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN reviews INTEGER DEFAULT 0;
  END IF;
END $$;

-- Remove existing dummy data
DELETE FROM public.ea_products;

-- Insert real EA products
INSERT INTO public.ea_products (
  product_code,
  name,
  description,
  short_description,
  key_features,
  trading_pairs,
  timeframes,
  strategy_type,
  min_deposit,
  avg_monthly_return,
  max_drawdown,
  performance,
  image_key,
  risk_level,
  price_label,
  price_cents,
  rating,
  reviews,
  max_concurrent_sessions,
  max_mt5_accounts,
  requires_hardware_binding,
  is_active
) VALUES
(
  'ighodalo-gold-milker-ea',
  'Ighodalo Gold Milker EA',
  'Precision-engineered XAUUSD algorithm that identifies high-probability swing zones, volatility expansions, and retracements with advanced confirmation filters.',
  'Precision-engineered swing/trend hybrid EA built exclusively for XAUUSD.',
  ARRAY[
    'Gold-optimized algorithm with smart volatility detection',
    'Trailing stop & break-even automation with daily risk controls',
    'Trend + momentum multi-layer confirmation',
    'Anti-overtrading safety engine',
    'Multiple risk modes for capital protection',
    'Works best during London & NY sessions'
  ],
  'XAUUSD',
  'M15, H1',
  'Swing / Trend Hybrid',
  '$300 - $1,000',
  '10 - 20%',
  '8 - 12%',
  '+268% performance / Medium risk profile',
  'gold-milker',
  'Medium',
  '$349 Lifetime License',
  34900,
  4.9,
  182,
  2,
  2,
  true,
  true
),
(
  'belema-sfp-ea',
  'Belema SFP EA',
  'Smart Fractal Pattern (SFP) engine that combines liquidity sweep detection with breaker block confirmation to deliver sniper reversal entries.',
  'Smart fractal + liquidity sweep sniper EA for precise reversals.',
  ARRAY[
    'Smart Fractal Pattern (SFP) detection',
    'Liquidity sweep identification',
    'Breaker block confirmation',
    'High R:R setups (1:3 - 1:8)',
    'News/spread protection with tight stop-loss structure',
    'Suitable for indices, forex & gold'
  ],
  'EURUSD, GBPUSD, XAUUSD, US30',
  'M5 - M30',
  'Reversal / Liquidity Grab',
  '$200+',
  '12 - 25%',
  '6 - 10%',
  '+312% performance / Medium-High reward profile',
  'belema-sfp',
  'Medium-High',
  '$299 Lifetime License',
  29900,
  4.8,
  154,
  1,
  1,
  true,
  true
),
(
  'bb-martingale-ea',
  'BB Martingale EA',
  'Controlled-risk Bollinger-based grid EA with volatility-driven spacing, safe martingale multiplier, and automated recovery logic for assets with consistent retracement behavior.',
  'Controlled-risk Bollinger grid/martingale engine with drawdown protection.',
  ARRAY[
    'Dynamic, volatility-based grid spacing',
    'Smart martingale multiplier with Bollinger Band logic',
    'Auto-recovery trades with trend-bias safety mode',
    'Drawdown protection and equity guard',
    'Optimized for EURUSD & USDJPY pairs'
  ],
  'EURUSD, USDJPY',
  'M5, M15',
  'Grid + Martingale',
  '$300 - $1,500',
  '15 - 30%',
  '12 - 20%',
  '+354% performance / Medium-High risk profile',
  'bb-martingale',
  'Medium-High',
  '$329 Lifetime License',
  32900,
  4.7,
  138,
  3,
  3,
  true,
  true
);




