-- Fix security issues with functions by setting proper search_path
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Generate format: XXXX-XXXX-XXXX-XXXX
  FOR i IN 1..4 LOOP
    FOR j IN 1..4 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    IF i < 4 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$;

-- Fix cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Mark expired sessions as inactive
  UPDATE public.license_sessions 
  SET is_active = false 
  WHERE is_active = true 
    AND (expires_at < now() OR last_heartbeat < now() - INTERVAL '5 minutes');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Update concurrent session counts
  UPDATE public.licenses 
  SET current_active_sessions = (
    SELECT COUNT(*) 
    FROM public.license_sessions 
    WHERE license_id = licenses.id AND is_active = true
  );
  
  RETURN cleaned_count;
END;
$$;

-- Fix validation counter reset function
CREATE OR REPLACE FUNCTION public.reset_hourly_validation_counters()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  UPDATE public.licenses 
  SET 
    last_hour_validations = 0,
    last_hour_reset = now()
  WHERE last_hour_reset < now() - INTERVAL '1 hour';
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$;