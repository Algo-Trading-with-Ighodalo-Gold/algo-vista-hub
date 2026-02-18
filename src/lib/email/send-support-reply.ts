import { supabase } from "@/integrations/supabase/client"

export interface SendSupportReplyOptions {
  to: string
  recipientName?: string | null
  ticketTopic?: string | null
  subject: string
  message: string
}

export interface SendSupportReplyResult {
  success: boolean
  error?: string
}

export async function sendSupportReplyEmail(
  options: SendSupportReplyOptions
): Promise<SendSupportReplyResult> {
  const payload = {
    to: options.to,
    subject: options.subject,
    template: "support_reply",
    data: {
      recipient_name: options.recipientName || undefined,
      ticket_topic: options.ticketTopic || undefined,
      message: options.message,
    },
  }

  try {
    const functionNames = ["send-email", "send_email"] as const
    let lastError = "Failed to send support reply"

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
        if (status === 404 || detailed.includes("404")) continue
        return { success: false, error: lastError }
      }

      const typed = data as { success?: boolean; error?: string } | null
      if (typed?.success === false) {
        return { success: false, error: typed.error || "Failed to send support reply" }
      }

      return { success: true }
    }

    return { success: false, error: lastError }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, error: msg }
  }
}
