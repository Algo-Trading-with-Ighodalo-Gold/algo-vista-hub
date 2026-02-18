# Email Setup for Project Approval Notifications

When you approve an EA Development project inquiry, the system sends an email to the applicant. To enable this:

## 1. Get a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** and create a new key
3. Copy the key (starts with `re_`)

## 2. Deploy the send-email Edge Function

```bash
supabase functions deploy send-email
```

## 3. Set Supabase Secrets

```bash
# Required - your Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# For testing without domain verification (sends from onboarding@resend.dev)
supabase secrets set RESEND_USE_TEST_SENDER=true
```

**Note:** With `RESEND_USE_TEST_SENDER=true`, emails are sent from `onboarding@resend.dev` and can only be delivered to the email you verified in Resend. For production, verify your domain in Resend and set:

```bash
supabase secrets set FROM_EMAIL=noreply@yourdomain.com
supabase secrets set FROM_NAME="Algo Trading with Ighodalo"
```

## 4. Run the email_logs migration (if not done)

Run `supabase/migrations/setup_email_sending.sql` in the Supabase SQL Editor to create the `email_logs` table.

## Verify

After setup, approve a project inquiry. You should see:
- Status changes to "approved" immediately
- Toast: "Project approved. Email sent to [email]"

If you see "Email could not be sent", check:
- Edge function is deployed: `supabase functions list`
- RESEND_API_KEY is set: `supabase secrets list`
- Resend dashboard for delivery status
