# Deploy Email for Project Approval

To receive emails when you approve EA Development project inquiries:

## 1. Create Resend Account
1. Go to https://resend.com and sign up (free: 100 emails/day)
2. Verify your email

## 2. Get API Key
1. In Resend dashboard: **API Keys** → **Create API Key**
2. Copy the key (starts with `re_`)

## 3. Deploy Edge Function & Set Secrets
```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=re_your_key_here

# For testing: use Resend's default sender (no domain verification needed)
# Emails will be sent from onboarding@resend.dev to the recipient
supabase secrets set RESEND_USE_TEST_SENDER=true

# Deploy the send-email function
supabase functions deploy send-email
```

## 4. Production (custom domain)
When ready for production with your own domain:
```bash
# Add your verified domain in Resend dashboard first
supabase secrets set RESEND_USE_TEST_SENDER=false
supabase secrets set FROM_EMAIL=your@yourdomain.com
supabase secrets set FROM_NAME="Algo Trading"
```

## 5. Test
Approve a project inquiry in the admin panel. You should receive the email.
