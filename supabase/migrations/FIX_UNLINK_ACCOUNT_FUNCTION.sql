-- Fix the unlink_account_from_license function to properly detect deleted rows
-- The issue: PostgreSQL's "NOT FOUND" only works for SELECT INTO, not DELETE
-- Solution: Use GET DIAGNOSTICS to check how many rows were actually deleted

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.unlink_account_from_license(UUID, BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlink_account_from_license(UUID, BIGINT) TO service_role;
