-- Quick Fix: Fix get_admin_stats() function SQL error
-- Run this in Supabase SQL Editor to fix the GROUP BY error

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

