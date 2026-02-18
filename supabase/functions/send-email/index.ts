// Supabase Edge Function to send emails via Resend
// Deploy with: supabase functions deploy send-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// Use onboarding@resend.dev for testing (no domain verification needed)
const USE_TEST_SENDER = Deno.env.get('RESEND_USE_TEST_SENDER') === 'true'
const FROM_EMAIL = USE_TEST_SENDER
  ? 'onboarding@resend.dev'
  : (Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev')
const FROM_NAME = Deno.env.get('FROM_NAME') || 'Algo Trading with Ighodalo'

serve(async (req) => {
  try {
    const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    // Require POST - reject GET/navigation requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Use POST' }),
        { status: 405, headers: corsHeaders }
      )
    }

    // Parse JSON body - handle empty or invalid body
    let body: Record<string, unknown> = {}
    try {
      const text = await req.text()
      if (text) {
        body = JSON.parse(text) as Record<string, unknown>
        // Supabase/client may wrap payload in 'body' or 'record'
        if (body && typeof body === 'object' && !body.to && (body.body || body.record)) {
          const unwrapped = (body.body || body.record) as Record<string, unknown>
          if (unwrapped && typeof unwrapped === 'object') body = unwrapped
        }
      }
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const to = body.to as string | undefined
    let subject = body.subject as string | undefined
    const template = body.template as string | undefined
    const data = body.data as Record<string, unknown> | undefined

    if (!to) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: to' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Default subject for project_approval template
    if (!subject && template === 'project_approval') {
      subject = 'Your EA Development Project Has Been Approved!'
    }
    if (!subject) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: subject' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Generate HTML email content
    const html = generateEmailHTML(template || 'generic', data)

    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [to],
        subject: subject,
        html: html
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', result)
      return new Response(
        JSON.stringify({ success: false, error: result.message || 'Failed to send email' }),
        { status: response.status, headers: corsHeaders }
      )
    }

    // Log success in database (optional - don't fail if this errors)
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      await supabaseClient.from('email_logs').insert({
        to_email: to,
        subject,
        template_type: template || 'generic',
        status: 'sent',
        sent_at: new Date().toISOString()
      })
    } catch (logErr) {
      console.warn('Email log failed (non-fatal):', logErr)
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})

function generateEmailHTML(template: string, data: any): string {
  if (template === 'project_approval') {
    const calendlyLink = data?.calendly_link || "https://calendly.com/algotradingwithighodalo/30min"
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🎉 Project Approved!</h1>
  </div>
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Dear ${data.recipient_name || 'Valued Client'},</p>
    
    <p style="font-size: 16px;">Great news! Your EA Development project inquiry has been <strong>approved</strong>!</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Project Details:</h3>
      <p style="margin: 5px 0;"><strong>Project:</strong> ${data.project_name || 'Your EA Development Project'}</p>
      ${data.admin_notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${data.admin_notes}</p>` : ''}
    </div>
    
    <p style="font-size: 16px;">Our development team will contact you shortly to discuss:</p>
    <ul style="font-size: 16px;">
      <li>Project timeline and milestones</li>
      <li>Technical requirements and specifications</li>
      <li>Next steps and development process</li>
    </ul>
    
    <p style="font-size: 16px; margin-top: 20px;">
      Please book your kickoff meeting using the link below:
    </p>
    
    <div style="text-align: center; margin-top: 16px;">
      <a href="${calendlyLink}" 
         style="background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Book Meeting on Calendly
      </a>
    </div>
    
    <p style="font-size: 16px;">If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${Deno.env.get('APP_URL') || 'https://your-domain.com'}/dashboard/ea-development" 
         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Project Status
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Best regards,<br>
      <strong>Algo Trading with Ighodalo Team</strong>
    </p>
  </div>
</body>
</html>
    `
  }

  if (template === 'support_reply') {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Support Reply</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 620px; margin: 0 auto; padding: 20px;">
  <div style="background: #2563eb; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; color: #fff; font-size: 22px;">Support Team Response</h1>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; padding: 24px; background: #fff;">
    <p>Hi ${data?.recipient_name || "there"},</p>
    ${data?.ticket_topic ? `<p><strong>Topic:</strong> ${data.ticket_topic}</p>` : ""}
    <div style="white-space: pre-wrap; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
      ${data?.message || ""}
    </div>
    <p style="margin-top: 18px;">Best regards,<br><strong>Algo Trading with Ighodalo Support</strong></p>
  </div>
</body>
</html>
    `
  }
  
  // Default template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
  <h2>${data.subject || 'Notification'}</h2>
  <p>${data.message || 'You have a new notification.'}</p>
</body>
</html>
  `
}
