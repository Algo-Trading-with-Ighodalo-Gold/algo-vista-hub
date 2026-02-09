-- Create RPC function to extend license expiry date
-- This function allows updating the expires_at date of a license

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

  -- Validate that new expiry date is in the future
  IF p_new_expiry_date <= NOW() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'New expiry date must be in the future'
    );
  END IF;

  -- Update the license expiry date
  UPDATE public.licenses
  SET 
    expires_at = p_new_expiry_date,
    updated_at = NOW(),
    -- If license was expired, reactivate it
    status = CASE 
      WHEN status = 'expired' THEN 'active'::public.license_status
      ELSE status
    END
  WHERE id = p_license_id
    AND user_id = auth.uid();
  
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
        'new_expiry', p_new_expiry_date
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
        'new_expiry', p_new_expiry_date
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

-- Add comment
COMMENT ON FUNCTION public.extend_license_expiry IS 'Extends the expiry date of a license. Automatically reactivates expired licenses.';
