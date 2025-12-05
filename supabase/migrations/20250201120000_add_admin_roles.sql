-- Migration: Add admin roles and permissions
-- This migration adds admin role support to profiles table

-- Add role column to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'worker'));
  END IF;
END $$;

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Note: Users can update their own profile (existing policy remains)
-- But the trigger below prevents role changes for non-admins

-- Function to check if user is admin (must be defined before policies)
-- This function uses SECURITY DEFINER to bypass RLS when checking admin status
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

-- Update RLS policies to allow admins to view all profiles
-- Use is_admin() function to avoid infinite recursion
-- Note: This policy works alongside existing "Users can view their own profile" policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- Allow admins to update profiles
-- Note: This policy works alongside existing "Users can update their own profile" policy
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- Prevent users from changing their own role (security enhancement)
-- Users can only update their own profile, but NOT the role field
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is trying to change their own role and they're not admin
  IF OLD.user_id = auth.uid() 
     AND NEW.role != OLD.role 
     AND NOT public.is_admin() THEN
    -- Revert role change
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to enforce role change prevention
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON public.profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();

-- Allow admins to manage EA products
DROP POLICY IF EXISTS "Admins can manage EA products" ON public.ea_products;
CREATE POLICY "Admins can manage EA products" ON public.ea_products
  FOR ALL
  USING (public.is_admin());

-- Allow admins to view all licenses
DROP POLICY IF EXISTS "Admins can view all licenses" ON public.licenses;
CREATE POLICY "Admins can view all licenses" ON public.licenses
  FOR SELECT
  USING (public.is_admin());

-- Allow admins to view all license accounts
DROP POLICY IF EXISTS "Admins can view all license accounts" ON public.license_accounts;
CREATE POLICY "Admins can view all license accounts" ON public.license_accounts
  FOR SELECT
  USING (public.is_admin());

-- Allow admins to view all affiliates
DROP POLICY IF EXISTS "Admins can view all affiliates" ON public.affiliates;
CREATE POLICY "Admins can view all affiliates" ON public.affiliates
  FOR SELECT
  USING (public.is_admin());

-- Function to get admin stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_licenses', (SELECT COUNT(*) FROM public.licenses),
    'active_licenses', (SELECT COUNT(*) FROM public.licenses WHERE status = 'active' AND (expires_at IS NULL OR expires_at > NOW())),
    'total_ea_products', (SELECT COUNT(*) FROM public.ea_products),
    'active_ea_products', (SELECT COUNT(*) FROM public.ea_products WHERE is_active = true),
    'total_accounts', (SELECT COUNT(*) FROM public.license_accounts),
    'active_accounts', (SELECT COUNT(*) FROM public.license_accounts WHERE status = 'active'),
    'total_affiliates', (SELECT COUNT(*) FROM public.affiliates),
    'total_commission', (SELECT COALESCE(SUM(commission_earned), 0) FROM public.affiliates),
    'recent_users', (
      SELECT COALESCE(json_agg(user_obj), '[]'::json)
      FROM (
        SELECT 
          json_build_object(
            'id', u.id,
            'email', u.email,
            'created_at', u.created_at,
            'profile', json_build_object(
              'first_name', p.first_name,
              'last_name', p.last_name
            )
          ) as user_obj
        FROM auth.users u
        LEFT JOIN public.profiles p ON p.user_id = u.id
        ORDER BY u.created_at DESC
        LIMIT 10
      ) subq
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$;

