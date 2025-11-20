image.png-- Fix the link_account_to_license function to handle TEXT to UUID conversion
-- This fixes the "operator does not exist: text = uuid" error

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
  -- FIX: Handle ea_product_id as TEXT - don't join if it's not a valid UUID
  SELECT l.*, 
    CASE 
      WHEN l.ea_product_id IS NOT NULL AND l.ea_product_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
      THEN (SELECT name FROM public.ea_products WHERE id::TEXT = l.ea_product_id LIMIT 1)
      ELSE l.ea_product_name
    END as product_name
  INTO v_license
  FROM public.licenses l
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
      json_build_object('account', p_account::TEXT),
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



