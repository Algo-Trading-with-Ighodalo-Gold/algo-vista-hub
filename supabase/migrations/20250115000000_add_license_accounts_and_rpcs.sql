-- Migration: Add license_accounts table, RPC functions, and enhance licenses table
-- This migration adds support for linking MT5 accounts to licenses with proper limit enforcement

-- Step 1: Add missing columns to licenses table if they don't exist
DO $$ 
BEGIN
  -- Add plan_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'licenses' 
    AND column_name = 'plan_id'
  ) THEN
    ALTER TABLE public.licenses ADD COLUMN plan_id UUID REFERENCES public.subscription_tiers(id);
  END IF;

  -- Add is_active if it doesn't exist (as boolean, separate from status enum)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'licenses' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.licenses ADD COLUMN is_active BOOLEAN DEFAULT true;
    -- Set is_active based on status
    UPDATE public.licenses SET is_active = (status = 'active'::license_status);
  END IF;

  -- Add licensed_to if it doesn't exist (for Cloudflare Worker compatibility)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'licenses' 
    AND column_name = 'licensed_to'
  ) THEN
    ALTER TABLE public.licenses ADD COLUMN licensed_to TEXT;
    -- Set licensed_to to user email or user_id
    UPDATE public.licenses l
    SET licensed_to = COALESCE(
      (SELECT email FROM auth.users WHERE id = l.user_id),
      l.user_id::TEXT
    );
  END IF;
END $$;

-- Step 2: Create license_accounts table
CREATE TABLE IF NOT EXISTS public.license_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  account BIGINT NOT NULL, -- MT5 account number
  account_name TEXT, -- Optional display name
  broker TEXT, -- Optional broker name
  balance DECIMAL(12, 2) DEFAULT 0, -- Optional balance tracking
  status TEXT DEFAULT 'offline' CHECK (status IN ('active', 'offline', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one account can only be linked to one license
  UNIQUE(account)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_license_accounts_license_id ON public.license_accounts(license_id);
CREATE INDEX IF NOT EXISTS idx_license_accounts_account ON public.license_accounts(account);

-- Enable RLS
ALTER TABLE public.license_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for license_accounts
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view accounts for their licenses" ON public.license_accounts;
DROP POLICY IF EXISTS "Users can insert accounts for their licenses" ON public.license_accounts;
DROP POLICY IF EXISTS "Users can delete accounts from their licenses" ON public.license_accounts;

-- Users can only see accounts linked to their licenses
CREATE POLICY "Users can view accounts for their licenses" ON public.license_accounts
  FOR SELECT
  USING (
    license_id IN (
      SELECT id FROM public.licenses WHERE user_id = auth.uid()
    )
  );

-- Users can insert accounts for their licenses (enforced in RPC)
CREATE POLICY "Users can insert accounts for their licenses" ON public.license_accounts
  FOR INSERT
  WITH CHECK (
    license_id IN (
      SELECT id FROM public.licenses WHERE user_id = auth.uid()
    )
  );

-- Users can delete accounts from their licenses
CREATE POLICY "Users can delete accounts from their licenses" ON public.license_accounts
  FOR DELETE
  USING (
    license_id IN (
      SELECT id FROM public.licenses WHERE user_id = auth.uid()
    )
  );

-- Step 3: Create RPC function to link account to license
-- Drop existing function if it exists (in case return type changed)
DROP FUNCTION IF EXISTS public.link_account_to_license(UUID, BIGINT);

CREATE OR REPLACE FUNCTION public.link_account_to_license(
  p_license_id UUID,
  p_account BIGINT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_tier RECORD;
  v_subscription RECORD;
  v_connected_count INTEGER;
  v_max_allowed INTEGER;
  v_result JSON;
  v_plan_id UUID;
  v_is_active BOOLEAN;
  v_has_plan_id BOOLEAN;
  v_has_is_active BOOLEAN;
BEGIN
  -- Check if plan_id and is_active columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'licenses' 
    AND column_name = 'plan_id'
  ) INTO v_has_plan_id;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'licenses' 
    AND column_name = 'is_active'
  ) INTO v_has_is_active;
  
  -- Get license details - select all columns
  -- Cast ea_product_id to UUID for join (handle case where it might be TEXT)
  -- Use safe cast that handles NULL and invalid UUIDs
  SELECT l.*, p.name as product_name
  INTO v_license
  FROM public.licenses l
  LEFT JOIN public.ea_products p ON 
    (l.ea_product_id IS NOT NULL AND l.ea_product_id::UUID = p.id)
  WHERE l.id = p_license_id
    AND l.user_id = auth.uid(); -- Ensure user owns the license

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found or access denied'
    );
  END IF;

  -- Get plan_id safely if column exists (use dynamic SQL to avoid parse-time errors)
  BEGIN
    IF v_has_plan_id THEN
      EXECUTE 'SELECT plan_id FROM public.licenses WHERE id = $1' 
      USING p_license_id INTO v_plan_id;
    ELSE
      v_plan_id := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_plan_id := NULL;
  END;

  -- Get is_active safely if column exists, otherwise derive from status
  BEGIN
    IF v_has_is_active THEN
      EXECUTE 'SELECT is_active FROM public.licenses WHERE id = $1' 
      USING p_license_id INTO v_is_active;
    ELSE
      v_is_active := (v_license.status = 'active'::license_status);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_is_active := (v_license.status = 'active'::license_status);
  END;

  -- Check if license is active
  IF NOT (v_is_active AND (v_license.expires_at IS NULL OR v_license.expires_at > NOW())) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License is not active or has expired'
    );
  END IF;

  -- Count currently connected accounts
  SELECT COUNT(*) INTO v_connected_count
  FROM public.license_accounts
  WHERE license_id = p_license_id;

  -- Determine max allowed accounts
  v_max_allowed := 0; -- 0 means unlimited

  -- Check license-level max_concurrent_sessions first
  IF v_license.max_concurrent_sessions IS NOT NULL AND v_license.max_concurrent_sessions > 0 THEN
    v_max_allowed := v_license.max_concurrent_sessions;
  ELSE
    -- Check plan_id tier limits if plan_id exists
    IF v_plan_id IS NOT NULL THEN
      SELECT max_mt5_accounts INTO v_tier.max_mt5_accounts
      FROM public.subscription_tiers
      WHERE id = v_plan_id;

      IF v_tier.max_mt5_accounts IS NOT NULL AND v_tier.max_mt5_accounts > 0 THEN
        v_max_allowed := v_tier.max_mt5_accounts;
      END IF;
    END IF;

    -- Check Stripe subscription if no tier limit
    IF v_max_allowed = 0 AND v_license.stripe_subscription_id IS NOT NULL THEN
      -- Try to get subscription tier limits via stripe_subscription_id
      -- Use dynamic query to handle case where subscriptions table might not have user_id
      BEGIN
        SELECT st.max_mt5_accounts INTO v_tier.max_mt5_accounts
        FROM public.subscription_tiers st
        WHERE st.stripe_price_id IN (
          SELECT price_id FROM public.stripe_subscriptions 
          WHERE subscription_id = v_license.stripe_subscription_id 
          LIMIT 1
        )
        LIMIT 1;

        IF v_tier.max_mt5_accounts IS NOT NULL AND v_tier.max_mt5_accounts > 0 THEN
          v_max_allowed := v_tier.max_mt5_accounts;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        -- If query fails, just continue without subscription tier limit
        NULL;
      END;
    END IF;
  END IF;

  -- Check if limit is reached (0 means unlimited, so skip check)
  IF v_max_allowed > 0 AND v_connected_count >= v_max_allowed THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Account limit reached. Maximum %s accounts allowed.', v_max_allowed),
      'connected', v_connected_count,
      'max_allowed', v_max_allowed
    );
  END IF;

  -- Check if account is already linked to another license
  IF EXISTS (
    SELECT 1 FROM public.license_accounts 
    WHERE account = p_account AND license_id != p_license_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'This account is already linked to another license'
    );
  END IF;

  -- Insert the account link (or update if exists for same license)
  INSERT INTO public.license_accounts (license_id, account, status)
  VALUES (p_license_id, p_account, 'offline')
  ON CONFLICT (account) 
  DO UPDATE SET 
    license_id = p_license_id,
    updated_at = NOW()
  WHERE license_accounts.license_id = p_license_id;

  -- Log the action (handle case where user_id column might not exist)
  BEGIN
    INSERT INTO public.license_logs (license_id, action, details, user_id)
    VALUES (
      p_license_id,
      'account_linked',
telegra      json_build_object('account', p_account::TEXT),
      auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    -- If user_id column doesn't exist, insert without it
    INSERT INTO public.license_logs (license_id, action, details)
    VALUES (
      p_license_id,
      'account_linked',
      json_build_object('account', p_account::TEXT)
    );
  END;

  RETURN json_build_object(
    'success', true,
    'message', 'Account linked successfully',
    'connected', v_connected_count + 1,
    'max_allowed', v_max_allowed
  );
END;
$$;

-- Step 4: Create RPC function to unlink account from license
-- Drop existing function if it exists (in case return type changed)
DROP FUNCTION IF EXISTS public.unlink_account_from_license(UUID, BIGINT);

CREATE OR REPLACE FUNCTION public.unlink_account_from_license(
  p_license_id UUID,
  p_account BIGINT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_rows_deleted INTEGER;
BEGIN
  -- Verify license ownership
  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found or access denied'
    );
  END IF;

  -- Delete the account link
  DELETE FROM public.license_accounts
  WHERE license_id = p_license_id
    AND account = p_account;
  
  -- Get the number of rows actually deleted
  GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;

  -- Check if any rows were deleted
  IF v_rows_deleted = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Account not found or not linked to this license'
    );
  END IF;

  -- Log the action (handle case where user_id column might not exist)
  BEGIN
    INSERT INTO public.license_logs (license_id, action, details, user_id)
    VALUES (
      p_license_id,
      'account_unlinked',
      json_build_object('account', p_account::TEXT),
      auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    -- If user_id column doesn't exist, insert without it
    INSERT INTO public.license_logs (license_id, action, details)
    VALUES (
      p_license_id,
      'account_unlinked',
      json_build_object('account', p_account::TEXT)
    );
  END;

  RETURN json_build_object(
    'success', true,
    'message', 'Account unlinked successfully'
  );
END;
$$;

-- Step 5: Create license_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.license_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'license_logs' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.license_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_license_logs_license_id ON public.license_logs(license_id);
-- Create user_id index only if column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'license_logs' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_license_logs_user_id ON public.license_logs(user_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_license_logs_created_at ON public.license_logs(created_at DESC);

-- Enable RLS for license_logs
ALTER TABLE public.license_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view logs for their licenses
DROP POLICY IF EXISTS "Users can view logs for their licenses" ON public.license_logs;
CREATE POLICY "Users can view logs for their licenses" ON public.license_logs
  FOR SELECT
  USING (
    license_id IN (
      SELECT id FROM public.licenses WHERE user_id = auth.uid()
    )
  );

-- Step 6: Add trigger to update updated_at for license_accounts
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_license_accounts_updated_at ON public.license_accounts;
CREATE TRIGGER update_license_accounts_updated_at
BEFORE UPDATE ON public.license_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.license_accounts IS 'MT5 accounts linked to EA licenses';
COMMENT ON FUNCTION public.link_account_to_license IS 'Links an MT5 account to a license with limit enforcement';
COMMENT ON FUNCTION public.unlink_account_from_license IS 'Unlinks an MT5 account from a license';



