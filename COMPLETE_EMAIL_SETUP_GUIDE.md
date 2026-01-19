# Complete Email Setup Guide
## For: bcm202576@unimed.edu.ng

Follow these steps to enable email sending in your application.

---

## Step 1: Choose an Email Service (Recommended: Resend)

### Option A: Resend (Easiest - Recommended)
1. Go to https://resend.com
2. Sign up for a free account (100 emails/day free)
3. Verify your email address
4. Go to **Domains** → **Add Domain**
5. Enter: `unimed.edu.ng`
6. Resend will provide DNS records to add

### Option B: SendGrid
1. Go to https://sendgrid.com
2. Sign up (100 emails/day free)
3. Verify sender domain `unimed.edu.ng`
4. Add DNS records provided

### Option C: Mailgun
1. Go to https://mailgun.com
2. Sign up (5,000 emails/month free)
3. Verify domain `unimed.edu.ng`
4. Add DNS records

---

## Step 2: Add DNS Records to unimed.edu.ng

**Important**: You need access to manage DNS for `unimed.edu.ng` domain.

### For Resend:
Add these DNS records (Resend will show you exact values):

1. **SPF Record** (TXT):
   ```
   Name: @
   Value: v=spf1 include:resend.com ~all
   ```

2. **DKIM Record** (TXT):
   ```
   Name: resend._domainkey
   Value: [Provided by Resend]
   ```

3. **DMARC Record** (TXT):
   ```
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:bcm202576@unimed.edu.ng
   ```

### For SendGrid:
Add similar records provided by SendGrid dashboard.

**Note**: DNS changes can take 24-48 hours to propagate.

---

## Step 3: Run SQL Migration

Copy and paste this SQL in **Supabase SQL Editor**:

```sql
-- ============================================
-- EMAIL SENDING SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Create email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
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

-- Policy: Service can insert email logs
CREATE POLICY "Service can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

-- Update function to call Edge Function
CREATE OR REPLACE FUNCTION public.send_project_approval_email(
  inquiry_id UUID,
  recipient_email TEXT,
  recipient_name TEXT,
  project_name TEXT,
  admin_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_id UUID;
  edge_function_url TEXT;
  service_role_key TEXT;
  http_response JSON;
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

  -- Get Supabase project URL and service role key
  -- These should be set as database settings or use environment variables
  edge_function_url := current_setting('app.settings.edge_function_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings not available, use default pattern
  IF edge_function_url IS NULL THEN
    edge_function_url := 'https://' || current_setting('app.settings.project_ref', true) || '.supabase.co/functions/v1/send-email';
  END IF;

  -- Call Edge Function to send email
  BEGIN
    SELECT content INTO http_response
    FROM http((
      'POST',
      edge_function_url,
      ARRAY[
        http_header('Content-Type', 'application/json'),
        http_header('Authorization', 'Bearer ' || COALESCE(service_role_key, 'your-service-role-key'))
      ],
      'application/json',
      json_build_object(
        'to', recipient_email,
        'subject', 'Your EA Development Project Has Been Approved!',
        'template', 'project_approval',
        'data', json_build_object(
          'recipient_name', recipient_name,
          'project_name', project_name,
          'admin_notes', admin_notes
        )
      )::text
    )::http_request);

    -- Update email log as sent
    UPDATE public.email_logs
    SET status = 'sent',
        sent_at = now()
    WHERE id = email_id;

    RETURN json_build_object(
      'success', true,
      'email_id', email_id,
      'message', 'Email sent successfully'
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Update email log as failed
      UPDATE public.email_logs
      SET status = 'failed',
          error_message = SQLERRM
      WHERE id = email_id;
      
      RETURN json_build_object(
        'success', false,
        'error', SQLERRM,
        'email_id', email_id
      );
  END;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.send_project_approval_email(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_project_approval_email(UUID, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- Create trigger to auto-send email when project is approved
CREATE OR REPLACE FUNCTION public.handle_project_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    PERFORM public.send_project_approval_email(
      NEW.id,
      NEW.email,
      NEW.name,
      NEW.strategy,
      NULL -- admin_notes
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);
```

---

## Step 4: Create Supabase Edge Function

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **The Edge Function is already created** at:
   `supabase/functions/send-email/index.ts`

5. **Deploy the function**:
   ```bash
   supabase functions deploy send-email
   ```

---

## Step 5: Configure Environment Variables

In **Supabase Dashboard** → **Edge Functions** → **Settings**:

Add these secrets:

1. **RESEND_API_KEY**: Your Resend API key (from Resend dashboard)
2. **FROM_EMAIL**: `bcm202576@unimed.edu.ng`
3. **FROM_NAME**: `Algo Trading with Ighodalo`
4. **APP_URL**: Your app URL (e.g., `https://your-domain.com`)

**To set secrets via CLI**:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set FROM_EMAIL=bcm202576@unimed.edu.ng
supabase secrets set FROM_NAME="Algo Trading with Ighodalo"
supabase secrets set APP_URL=https://your-domain.com
```

---

## Step 6: Update SQL Function to Use Edge Function

Since Supabase doesn't have `http` extension by default, update the function to use `pg_net` or call from frontend:

**Option A: Call from Frontend (Easier)**

The frontend code already calls the RPC function. Update it to also call the Edge Function:

Update `src/pages/admin/ea-development-projects.tsx` to call Edge Function directly:

```typescript
// After updating status, call Edge Function
const { data: edgeFunctionResponse } = await supabase.functions.invoke('send-email', {
  body: {
    to: approvingInquiry.email,
    subject: 'Your EA Development Project Has Been Approved!',
    template: 'project_approval',
    data: {
      recipient_name: approvingInquiry.name,
      project_name: approvingInquiry.strategy.substring(0, 50),
      admin_notes: adminNotes
    }
  }
})
```

---

## Step 7: Test Email Sending

1. **Test from Admin Dashboard**:
   - Go to EA Development Projects page
   - Approve a project
   - Check email_logs table in Supabase

2. **Test Edge Function directly**:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/send-email \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "to": "bcm202576@unimed.edu.ng",
       "subject": "Test Email",
       "template": "project_approval",
       "data": {
         "recipient_name": "Test User",
         "project_name": "Test Project"
       }
     }'
   ```

---

## Step 8: Verify DNS Records

After adding DNS records, verify they're working:

1. **Check SPF**: https://mxtoolbox.com/spf.aspx
2. **Check DKIM**: https://mxtoolbox.com/dkim.aspx
3. **Check DMARC**: https://mxtoolbox.com/dmarc.aspx

Enter: `unimed.edu.ng`

---

## Quick Checklist

- [ ] Sign up for Resend/SendGrid/Mailgun
- [ ] Verify domain `unimed.edu.ng` with email service
- [ ] Add SPF, DKIM, DMARC DNS records
- [ ] Run SQL migration in Supabase
- [ ] Deploy Edge Function: `supabase functions deploy send-email`
- [ ] Set environment variables (RESEND_API_KEY, etc.)
- [ ] Test email sending
- [ ] Verify DNS records are active

---

## Troubleshooting

### Emails not sending?
1. Check Edge Function logs: `supabase functions logs send-email`
2. Check email_logs table in Supabase
3. Verify RESEND_API_KEY is set correctly
4. Check DNS records are propagated (can take 24-48 hours)

### DNS issues?
- Use https://dnschecker.org to check DNS propagation
- Make sure you have access to manage DNS for unimed.edu.ng
- Contact your domain administrator if needed

### Edge Function errors?
- Check Supabase Dashboard → Edge Functions → Logs
- Verify all environment variables are set
- Check Resend API key is valid

---

## Alternative: Use Supabase Auth Emails (Limited)

If you can't set up a third-party service, Supabase Auth has limited email sending:

```sql
-- This uses Supabase's built-in email (limited functionality)
-- Only works for auth-related emails
```

**Note**: This is very limited and not recommended for transactional emails.

---

## Need Help?

1. Check Resend docs: https://resend.com/docs
2. Check Supabase Edge Functions: https://supabase.com/docs/guides/functions
3. Check email_logs table for error messages
