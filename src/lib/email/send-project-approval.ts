/**
 * Sends project approval email via Supabase Edge Function (Resend).
 * Uses Supabase Functions invoke (POST) to avoid URL mismatch issues.
 */

import { supabase } from "@/integrations/supabase/client"

export interface ProjectInquiryForEmail {
  email: string
  name: string
  strategy: string
}

export interface SendProjectApprovalOptions {
  inquiry: ProjectInquiryForEmail
  adminNotes?: string
  calendlyLink?: string
}

export interface SendProjectApprovalResult {
  success: boolean
  error?: string
}

/**
 * Sends project approval email via the send-email Edge Function.
 * Uses explicit POST request to avoid GET/navigation issues.
 */
export async function sendProjectApprovedEmail(
  options: SendProjectApprovalOptions
): Promise<SendProjectApprovalResult> {
  const { inquiry, adminNotes, calendlyLink } = options
  const payload = {
    to: inquiry.email,
    subject: "Your EA Development Project Has Been Approved!",
    template: "project_approval",
    data: {
      recipient_name: inquiry.name,
      project_name: inquiry.strategy.substring(0, 50),
      admin_notes: adminNotes || undefined,
      calendly_link: calendlyLink || "https://calendly.com/algotradingwithighodalo/30min",
    },
  }

  try {
    // Use invoke so Supabase client handles the correct project/function endpoint.
    // Try both common naming styles to avoid 404 if deployment name differs.
    const functionNames = ["send-email", "send_email"] as const
    let lastError = "Email failed"

    for (const functionName of functionNames) {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
      })

      if (error) {
        const anyErr = error as unknown as {
          message?: string
          context?: { status?: number; json?: () => Promise<{ error?: string; message?: string }> }
        }

        let detailed = anyErr.message || String(error)
        const status = anyErr.context?.status

        // Extract backend error body when available (e.g. {"error":"Use POST"})
        if (anyErr.context?.json) {
          try {
            const body = await anyErr.context.json()
            if (body?.error || body?.message) {
              detailed = body.error || body.message || detailed
            }
          } catch {
            // keep default message
          }
        }

        lastError = detailed

        // If function name isn't found, try alternate naming.
        if (status === 404 || detailed.includes("404")) continue
        return { success: false, error: lastError }
      }

      const typed = data as { success?: boolean; error?: string } | null
      if (typed?.success === false) {
        return { success: false, error: typed.error || "Email failed" }
      }

      return { success: true }
    }

    return { success: false, error: lastError }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, error: msg }
  }
}
