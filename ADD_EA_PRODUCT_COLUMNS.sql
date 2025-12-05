-- Add missing columns to ea_products table
-- Run this in Supabase SQL Editor to fix the schema cache error

DO $$
BEGIN
  -- Add key_features column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'key_features'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN key_features TEXT[] DEFAULT '{}';
  END IF;

  -- Add trading_pairs column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'trading_pairs'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN trading_pairs TEXT;
  END IF;

  -- Add timeframes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'timeframes'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN timeframes TEXT;
  END IF;

  -- Add strategy_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'strategy_type'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN strategy_type TEXT;
  END IF;

  -- Add min_deposit column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'min_deposit'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN min_deposit TEXT;
  END IF;

  -- Add avg_monthly_return column (THIS IS THE ONE CAUSING THE ERROR)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'avg_monthly_return'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN avg_monthly_return TEXT;
  END IF;

  -- Add max_drawdown column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'max_drawdown'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN max_drawdown TEXT;
  END IF;

  -- Add performance column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'performance'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN performance TEXT;
  END IF;

  -- Add short_description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'short_description'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN short_description TEXT;
  END IF;

  -- Add image_key column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'image_key'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN image_key TEXT;
  END IF;

  -- Add risk_level column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'risk_level'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN risk_level TEXT;
  END IF;

  -- Add price_label column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'price_label'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN price_label TEXT;
  END IF;

  -- Add rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'rating'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN rating NUMERIC(3,2) DEFAULT 5.00;
  END IF;

  -- Add reviews column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ea_products'
      AND column_name = 'reviews'
  ) THEN
    ALTER TABLE public.ea_products ADD COLUMN reviews INTEGER DEFAULT 0;
  END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ea_products'
  AND column_name IN (
    'key_features', 'trading_pairs', 'timeframes', 'strategy_type',
    'min_deposit', 'avg_monthly_return', 'max_drawdown', 'performance',
    'short_description', 'image_key', 'risk_level', 'price_label', 'rating', 'reviews'
  )
ORDER BY column_name;

