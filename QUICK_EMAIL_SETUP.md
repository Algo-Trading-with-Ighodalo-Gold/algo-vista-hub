# Quick Email Setup - Step by Step

## What You Need to Send Emails

### ✅ Step 1: Sign Up for Resend (5 minutes)
1. Go to https://resend.com
2. Click "Sign Up" (free account)
3. Verify your email
4. You'll get 100 emails/day free

### ✅ Step 2: Add Your Domain (10 minutes)
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `unimed.edu.ng`
4. Click **Add**

### ✅ Step 3: Add DNS Records (You need access to unimed.edu.ng DNS)
Resend will show you 3 DNS records to add:

1. **SPF Record** (TXT):
   - Name: `@`
   - Value: `v=spf1 include:resend.com ~all`

2. **DKIM Record** (TXT):
   - Name: `resend._domainkey` (or similar)
   - Value: (provided by Resend)

3. **DMARC Record** (TXT):
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:bcm202576@unimed.edu.ng`

**Where to add**: Your domain registrar's DNS management panel (where you manage unimed.edu.ng)

### ✅ Step 4: Get API Key
1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Copy the key (starts with `re_`)

### ✅ Step 5: Deploy Edge Function
Open terminal in your project folder:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project (get project ref from Supabase dashboard URL)
supabase link --project-ref your-project-ref

# Set API key as secret
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set email address
supabase secrets set FROM_EMAIL=bcm202576@unimed.edu.ng

# Set sender name
supabase secrets set FROM_NAME="Algo Trading with Ighodalo"

# Deploy function
supabase functions deploy send-email
```

### ✅ Step 6: Run SQL Migration
Copy the SQL from `supabase/migrations/setup_email_sending.sql` and run it in Supabase SQL Editor.

### ✅ Step 7: Test
1. Go to Admin → EA Development Projects
2. Approve a project
3. Check if email is sent (check email_logs table)

---

## That's It! 🎉

Once DNS records propagate (usually 1-24 hours), emails will be sent automatically when you approve projects.

---

## If You Don't Have DNS Access

If you can't manage DNS for `unimed.edu.ng`:

1. **Use Resend's default domain** (emails from `onboarding@resend.dev`)
2. **Or use a subdomain** you control
3. **Or contact your IT department** to add DNS records

---

## Check Email Logs

View sent emails in Supabase:
```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;
```
