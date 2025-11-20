-- Create table for trading accounts linked to licenses
CREATE TABLE IF NOT EXISTS public.trading_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
  
  -- Account information
  account_name TEXT NOT NULL,
  mt5_account_number TEXT NOT NULL,
  broker TEXT NOT NULL,
  
  -- Account status
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('active', 'offline', 'suspended')),
  
  -- Balance information (optional, can be synced from MT5)
  balance DECIMAL(12, 2) DEFAULT 0,
  equity DECIMAL(12, 2) DEFAULT 0,
  
  -- Last sync information
  last_sync_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trading_accounts_user_id ON public.trading_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_accounts_license_id ON public.trading_accounts(license_id);

-- Enable RLS
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own accounts
CREATE POLICY "Users can view own trading accounts" ON public.trading_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own accounts
CREATE POLICY "Users can insert own trading accounts" ON public.trading_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own accounts
CREATE POLICY "Users can update own trading accounts" ON public.trading_accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own accounts
CREATE POLICY "Users can delete own trading accounts" ON public.trading_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.trading_accounts IS 'Trading accounts linked to EA licenses';





















