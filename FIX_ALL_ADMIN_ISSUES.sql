-- COMPREHENSIVE FIX: Fix Admin Dashboard and Accounts Page
-- Run this entire file in Supabase SQL Editor

-- Step 1: Ensure is_admin() function exists and works
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid 
    AND role IN ('admin', 'worker')
  );
END;
$$;

-- Step 2: Fix admin RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage EA products" ON public.ea_products;
CREATE POLICY "Admins can manage EA products" ON public.ea_products
  FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all licenses" ON public.licenses;
CREATE POLICY "Admins can view all licenses" ON public.licenses
  FOR SELECT
  USING (public.is_admin());

-- Step 3: CRITICAL - Fix license_accounts admin policy
DROP POLICY IF EXISTS "Admins can view all license accounts" ON public.license_accounts;
CREATE POLICY "Admins can view all license accounts" ON public.license_accounts
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all affiliates" ON public.affiliates;
CREATE POLICY "Admins can view all affiliates" ON public.affiliates
  FOR SELECT
  USING (public.is_admin());

-- Step 4: Fix get_admin_stats() function - Improved version with better error handling
DROP FUNCTION IF EXISTS public.get_admin_stats();

CREATE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats JSON;
  v_recent_users JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  -- Get recent users separately to avoid GROUP BY issues
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'email', u.email,
        'created_at', u.created_at::text,
        'profile', json_build_object(
          'first_name', p.first_name,
          'last_name', p.last_name
        )
      )
    ),
    '[]'::json
  )
  INTO v_recent_users
  FROM (
    SELECT id, email, created_at
    FROM auth.users
    ORDER BY created_at DESC
    LIMIT 10
  ) u
  LEFT JOIN public.profiles p ON p.user_id = u.id;

  -- Build stats object
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*)::integer FROM auth.users),
    'total_licenses', (SELECT COUNT(*)::integer FROM public.licenses),
    'active_licenses', (SELECT COUNT(*)::integer FROM public.licenses WHERE status = 'active' AND (expires_at IS NULL OR expires_at > NOW())),
    'total_ea_products', (SELECT COUNT(*)::integer FROM public.ea_products),
    'active_ea_products', (SELECT COUNT(*)::integer FROM public.ea_products WHERE is_active = true),
    'total_accounts', (SELECT COUNT(*)::integer FROM public.license_accounts),
    'active_accounts', (SELECT COUNT(*)::integer FROM public.license_accounts WHERE status = 'active'),
    'total_affiliates', (SELECT COUNT(*)::integer FROM public.affiliates),
    'total_commission', (SELECT COALESCE(SUM(commission_earned), 0)::numeric FROM public.affiliates),
    'recent_users', v_recent_users
  ) INTO v_stats;

  RETURN v_stats;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error in JSON format
    RETURN json_build_object(
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

-- Grant execute permission (important!)
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO anon;

-- Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'ea_products', 'licenses', 'license_accounts', 'affiliates')
  AND policyname LIKE '%Admin%'
ORDER BY tablename, policyname;

