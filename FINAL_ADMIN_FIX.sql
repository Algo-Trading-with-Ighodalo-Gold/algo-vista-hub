-- FINAL COMPREHENSIVE FIX FOR ADMIN DASHBOARD AND ACCOUNTS PAGE
-- Run this entire file in Supabase SQL Editor
-- This fixes all admin-related issues

-- ============================================
-- STEP 1: Ensure is_admin() function exists
-- ============================================
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

-- ============================================
-- STEP 2: Fix all admin RLS policies
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- EA Products policies
DROP POLICY IF EXISTS "Admins can manage EA products" ON public.ea_products;
CREATE POLICY "Admins can manage EA products" ON public.ea_products
  FOR ALL
  USING (public.is_admin());

-- Licenses policies
DROP POLICY IF EXISTS "Admins can view all licenses" ON public.licenses;
CREATE POLICY "Admins can view all licenses" ON public.licenses
  FOR SELECT
  USING (public.is_admin());

-- License Accounts policies (CRITICAL for accounts page)
DROP POLICY IF EXISTS "Admins can view all license accounts" ON public.license_accounts;
CREATE POLICY "Admins can view all license accounts" ON public.license_accounts
  FOR SELECT
  USING (public.is_admin());

-- Affiliates policies
DROP POLICY IF EXISTS "Admins can view all affiliates" ON public.affiliates;
CREATE POLICY "Admins can view all affiliates" ON public.affiliates
  FOR SELECT
  USING (public.is_admin());

-- ============================================
-- STEP 3: Fix get_admin_stats() function
-- ============================================
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

-- ============================================
-- STEP 4: Grant permissions (CRITICAL!)
-- ============================================
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- ============================================
-- STEP 5: Verify everything was created
-- ============================================
SELECT 
  'Functions' as type,
  routine_name as name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('is_admin', 'get_admin_stats')
UNION ALL
SELECT 
  'Policies' as type,
  policyname as name
FROM pg_policies
WHERE tablename IN ('profiles', 'ea_products', 'licenses', 'license_accounts', 'affiliates')
  AND policyname LIKE '%Admin%'
ORDER BY type, name;

