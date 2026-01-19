-- Link products table to licensing system
-- This migration adds necessary columns to the products table for EA licensing
-- The products table is already linked to Cloudflare

-- Add licensing-related columns to products table
DO $$ 
BEGIN
  -- Product code (using id as product_code if not exists)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_code') THEN
    ALTER TABLE public.products ADD COLUMN product_code TEXT;
    -- Use id as product_code for existing records
    UPDATE public.products SET product_code = id WHERE product_code IS NULL;
    -- Make it unique and not null
    ALTER TABLE public.products ALTER COLUMN product_code SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_code ON public.products(product_code);
  END IF;

  -- Description
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description') THEN
    ALTER TABLE public.products ADD COLUMN description TEXT;
  END IF;

  -- Price in cents
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price_cents') THEN
    ALTER TABLE public.products ADD COLUMN price_cents INTEGER DEFAULT 0;
  END IF;

  -- Version
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'version') THEN
    ALTER TABLE public.products ADD COLUMN version TEXT DEFAULT '1.0.0';
  END IF;

  -- License restrictions
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_concurrent_sessions') THEN
    ALTER TABLE public.products ADD COLUMN max_concurrent_sessions INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_mt5_accounts') THEN
    ALTER TABLE public.products ADD COLUMN max_mt5_accounts INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'requires_hardware_binding') THEN
    ALTER TABLE public.products ADD COLUMN requires_hardware_binding BOOLEAN DEFAULT true;
  END IF;

  -- Product status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_active') THEN
    ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Additional product details (optional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'key_features') THEN
    ALTER TABLE public.products ADD COLUMN key_features TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
    ALTER TABLE public.products ADD COLUMN short_description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_key') THEN
    ALTER TABLE public.products ADD COLUMN image_key TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
    ALTER TABLE public.products ADD COLUMN rating NUMERIC(3,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reviews') THEN
    ALTER TABLE public.products ADD COLUMN reviews INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'trading_pairs') THEN
    ALTER TABLE public.products ADD COLUMN trading_pairs TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'timeframes') THEN
    ALTER TABLE public.products ADD COLUMN timeframes TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'strategy_type') THEN
    ALTER TABLE public.products ADD COLUMN strategy_type TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'min_deposit') THEN
    ALTER TABLE public.products ADD COLUMN min_deposit TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'avg_monthly_return') THEN
    ALTER TABLE public.products ADD COLUMN avg_monthly_return TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_drawdown') THEN
    ALTER TABLE public.products ADD COLUMN max_drawdown TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'performance') THEN
    ALTER TABLE public.products ADD COLUMN performance TEXT;
  END IF;

  -- Timestamps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'created_at') THEN
    ALTER TABLE public.products ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_at') THEN
    ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;

  -- Stripe integration
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stripe_price_id') THEN
    ALTER TABLE public.products ADD COLUMN stripe_price_id TEXT;
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_products_updated_at();

-- Update licenses table to reference products table
-- Add a column to link licenses to products by product_code (id)
-- Note: We'll use product_code (which equals id) to link licenses

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;

-- Add RLS policies if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Products are viewable by everyone'
  ) THEN
    CREATE POLICY "Products are viewable by everyone" ON public.products
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can insert products'
  ) THEN
    CREATE POLICY "Admins can insert products" ON public.products
      FOR INSERT WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can update products'
  ) THEN
    CREATE POLICY "Admins can update products" ON public.products
      FOR UPDATE USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admins can delete products'
  ) THEN
    CREATE POLICY "Admins can delete products" ON public.products
      FOR DELETE USING (public.is_admin());
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON public.products(product_code);
