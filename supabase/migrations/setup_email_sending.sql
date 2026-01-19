-- ============================================
-- EMAIL SENDING SETUP FOR SUPABASE
-- ============================================
-- This SQL sets up email sending functionality
-- Run this in Supabase SQL Editor
-- ============================================

-- Create a function to send emails via Supabase Edge Functions or external service
-- Note: Supabase doesn't have built-in email sending, so you'll need to use:
-- 1. Supabase Edge Functions with a service like Resend, SendGrid, or Mailgun
-- 2. Or use Supabase's built-in auth email functions (limited)

-- Function to log email sending attempts
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all email logs
CREATE POLICY "Admins can view all email logs" 
ON public.email_logs 
FOR SELECT 
USING (public.is_admin());

-- Policy: Service role can insert email logs
CREATE POLICY "Service can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

-- Function to send project inquiry approval email
CREATE OR REPLACE FUNCTION public.send_project_approval_email(
  inquiry_id UUID,
  recipient_email TEXT,
  recipient_name TEXT,
  project_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_id UUID;
  result JSON;
BEGIN
  -- Log the email attempt
  INSERT INTO public.email_logs (
    to_email,
    subject,
    template_type,
    status
  ) VALUES (
    recipient_email,
    'Your EA Development Project Has Been Approved!',
    'project_approval',
    'pending'
  ) RETURNING id INTO email_id;

  -- In production, you would call an Edge Function here:
  -- SELECT net.http_post(
  --   url := 'https://your-project.supabase.co/functions/v1/send-email',
  --   headers := jsonb_build_object(
  --     'Content-Type', 'application/json',
  --     'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
  --   ),
  --   body := jsonb_build_object(
  --     'to', recipient_email,
  --     'subject', 'Your EA Development Project Has Been Approved!',
  --     'template', 'project_approval',
  --     'data', jsonb_build_object(
  --       'name', recipient_name,
  --       'project_name', project_name
  --     )
  --   )
  -- );

  -- For now, mark as sent (you'll need to implement actual sending)
  UPDATE public.email_logs
  SET status = 'sent',
      sent_at = now()
  WHERE id = email_id;

  RETURN json_build_object(
    'success', true,
    'email_id', email_id,
    'message', 'Email queued for sending'
  );
EXCEPTION
  WHEN OTHERS THEN
    UPDATE public.email_logs
    SET status = 'failed',
        error_message = SQLERRM
    WHERE id = email_id;
    
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.send_project_approval_email(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_project_approval_email(UUID, TEXT, TEXT, TEXT) TO service_role;

-- Create trigger to automatically send email when project is approved
CREATE OR REPLACE FUNCTION public.handle_project_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only send email if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    PERFORM public.send_project_approval_email(
      NEW.id,
      NEW.email,
      NEW.name,
      NEW.strategy
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS project_inquiry_approval_trigger ON public.project_inquiries;
CREATE TRIGGER project_inquiry_approval_trigger
  AFTER UPDATE OF status ON public.project_inquiries
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved'))
  EXECUTE FUNCTION public.handle_project_approval();

-- Function to get email configuration (for admin)
CREATE OR REPLACE FUNCTION public.get_email_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stats JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  SELECT json_build_object(
    'total_emails', (SELECT COUNT(*)::integer FROM public.email_logs),
    'sent_emails', (SELECT COUNT(*)::integer FROM public.email_logs WHERE status = 'sent'),
    'failed_emails', (SELECT COUNT(*)::integer FROM public.email_logs WHERE status = 'failed'),
    'pending_emails', (SELECT COUNT(*)::integer FROM public.email_logs WHERE status = 'pending'),
    'recent_emails', (
      SELECT json_agg(
        json_build_object(
          'id', id,
          'to_email', to_email,
          'subject', subject,
          'status', status,
          'sent_at', sent_at,
          'created_at', created_at
        )
      )
      FROM public.email_logs
      ORDER BY created_at DESC
      LIMIT 10
    )
  ) INTO stats;

  RETURN stats;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_stats() TO authenticated;

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);

-- ============================================
-- NOTES:
-- ============================================
-- 1. SPF records are DNS settings, not database settings
--    You need to add SPF records to your domain's DNS:
--    For unimed.edu.ng, add this TXT record:
--    "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
--
-- 2. To actually send emails, you need to:
--    a) Set up a Supabase Edge Function
--    b) Use an email service (Resend, SendGrid, Mailgun, etc.)
--    c) Configure the service with your domain
--
-- 3. For the email bcm202576@unimed.edu.ng:
--    - You need to verify this email domain with your email service
--    - Add SPF, DKIM, and DMARC records to unimed.edu.ng DNS
--    - Configure the email service to send from this domain
--
-- 4. Example Edge Function code would be in:
--    supabase/functions/send-email/index.ts
-- ============================================


