-- Fix extend_license_expiry function - ADMIN ONLY
-- Users CANNOT extend licenses - only admins can
-- Licenses are based on plans users paid for, so only admins should modify expiry dates
-- Run this in Supabase SQL Editor to fix the "license not found" error for admins

CREATE OR REPLACE FUNCTION public.extend_license_expiry(
  p_license_id UUID,
  p_new_expiry_date TIMESTAMPTZ
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_rows_updated INTEGER;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin (ensure is_admin function exists)
  BEGIN
    v_is_admin := public.is_admin();
  EXCEPTION WHEN OTHERS THEN
    -- If is_admin function doesn't exist, assume not admin
    v_is_admin := false;
  END;
  
  -- ONLY ADMINS can extend licenses - users cannot extend their own licenses
  -- Licenses are based on plans users paid for, so only admins should modify expiry dates
  IF NOT v_is_admin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Access denied. Only administrators can extend licenses.'
    );
  END IF;
  
  -- Verify license exists
  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found'
    );
  END IF;

  -- Validate that new expiry date is in the future
  IF p_new_expiry_date <= NOW() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'New expiry date must be in the future'
    );
  END IF;

  -- Update the license expiry date (admin only)
  UPDATE public.licenses
  SET 
    expires_at = p_new_expiry_date,
    updated_at = NOW(),
    -- If license was expired, reactivate it
    status = CASE 
      WHEN status = 'expired' THEN 'active'::public.license_status
      ELSE status
    END
  WHERE id = p_license_id;
  
  -- Get the number of rows actually updated
  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  -- Check if any rows were updated
  IF v_rows_updated = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to update license expiry date'
    );
  END IF;

  -- Log the action (handle case where user_id column might not exist)
  BEGIN
    INSERT INTO public.license_logs (license_id, action, details, user_id)
    VALUES (
      p_license_id,
      'license_extended',
      json_build_object(
        'old_expiry', v_license.expires_at,
        'new_expiry', p_new_expiry_date,
        'extended_by_admin', v_is_admin
      ),
      auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    -- If user_id column doesn't exist, insert without it
    INSERT INTO public.license_logs (license_id, action, details)
    VALUES (
      p_license_id,
      'license_extended',
      json_build_object(
        'old_expiry', v_license.expires_at,
        'new_expiry', p_new_expiry_date,
        'extended_by_admin', v_is_admin
      )
    );
  END;

  RETURN json_build_object(
    'success', true,
    'message', 'License expiry date extended successfully',
    'new_expiry_date', p_new_expiry_date
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.extend_license_expiry(UUID, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.extend_license_expiry(UUID, TIMESTAMPTZ) TO service_role;
