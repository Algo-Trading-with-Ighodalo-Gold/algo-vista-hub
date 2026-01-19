# Email Setup Instructions

## For Email: bcm202576@unimed.edu.ng

### 1. SPF Record Setup (DNS Configuration)

SPF records are **DNS settings**, not database settings. You need to add this to your domain's DNS records:

**For unimed.edu.ng domain**, add this TXT record:

```
Type: TXT
Name: @ (or unimed.edu.ng)
Value: v=spf1 include:_spf.google.com include:sendgrid.net ~all
TTL: 3600
```

### 2. Database Setup

Run the SQL file `supabase/migrations/setup_email_sending.sql` in your Supabase SQL Editor.

### 3. Email Service Setup

Choose one of these email services:

#### Option A: Resend (Recommended - Easy Setup)
1. Sign up at https://resend.com
2. Verify your domain `unimed.edu.ng`
3. Add DNS records (SPF, DKIM, DMARC) provided by Resend
4. Get your API key
5. Create Supabase Edge Function to use Resend API

#### Option B: SendGrid
1. Sign up at https://sendgrid.com
2. Verify sender domain `unimed.edu.ng`
3. Add DNS records provided by SendGrid
4. Get your API key
5. Create Supabase Edge Function

#### Option C: Mailgun
1. Sign up at https://mailgun.com
2. Verify domain `unimed.edu.ng`
3. Add DNS records
4. Get API key
5. Create Supabase Edge Function

### 4. Supabase Edge Function Setup

Create a file: `supabase/functions/send-email/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, template, data } = await req.json()

    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'bcm202576@unimed.edu.ng',
        to: [to],
        subject: subject,
        html: generateEmailHTML(template, data)
      })
    })

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function generateEmailHTML(template: string, data: any): string {
  if (template === 'project_approval') {
    return `
      <h1>Your EA Development Project Has Been Approved!</h1>
      <p>Dear ${data.name},</p>
      <p>Great news! Your project "${data.project_name}" has been approved.</p>
      <p>Our team will contact you shortly to discuss next steps.</p>
    `
  }
  return '<p>Email content</p>'
}
```

### 5. Environment Variables

Add to Supabase Dashboard > Settings > Edge Functions:
- `RESEND_API_KEY`: Your Resend API key

### 6. Deploy Edge Function

```bash
supabase functions deploy send-email
```

### 7. Test Email Sending

Run this SQL in Supabase SQL Editor:

```sql
SELECT public.send_project_approval_email(
  'inquiry-id-here'::UUID,
  'bcm202576@unimed.edu.ng',
  'Test User',
  'Test Project'
);
```

## Important Notes

1. **SPF is DNS, not SQL**: SPF records must be added to your domain's DNS settings, not the database
2. **Domain Verification**: You need to verify ownership of `unimed.edu.ng` with your email service
3. **DNS Records**: You'll need to add multiple DNS records (SPF, DKIM, DMARC) provided by your email service
4. **Email Service Required**: Supabase doesn't send emails directly - you need a third-party service

## Quick Start (Simplest)

1. Use Resend.com (free tier available)
2. Sign up and verify `unimed.edu.ng` domain
3. Add DNS records they provide
4. Get API key
5. Deploy Edge Function (code above)
6. Run the SQL migration
7. Emails will automatically send when projects are approved!


