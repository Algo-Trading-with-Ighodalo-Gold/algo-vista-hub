import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Mail, RefreshCw, MessageSquare, CheckCircle, Clock, Send } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableScroll } from "@/components/admin/TableScroll"
import type { Database } from "@/integrations/supabase/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendSupportReplyEmail } from "@/lib/email/send-support-reply"

type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"]

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [sendingReply, setSendingReply] = useState(false)
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [replySubject, setReplySubject] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const { toast } = useToast()

  const fetchTickets = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load support tickets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markResolved = async (ticket: SupportTicket) => {
    setUpdatingId(ticket.id)
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          status: "resolved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticket.id)

      if (error) throw error

      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, status: "resolved" } : t))
      )
      toast({ title: "Updated", description: "Ticket marked as resolved" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const openReplyDialog = (ticket: SupportTicket) => {
    setActiveTicket(ticket)
    setReplySubject(`Re: ${ticket.topic}`)
    setReplyMessage(`Hi ${ticket.name},\n\nThank you for contacting support.\n\n`)
  }

  const closeReplyDialog = () => {
    setActiveTicket(null)
    setReplySubject("")
    setReplyMessage("")
    setSendingReply(false)
  }

  const handleSendReply = async () => {
    if (!activeTicket) return
    if (!replySubject.trim() || !replyMessage.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please enter both subject and message.",
        variant: "destructive",
      })
      return
    }

    setSendingReply(true)
    try {
      const result = await sendSupportReplyEmail({
        to: activeTicket.email,
        recipientName: activeTicket.name,
        ticketTopic: activeTicket.topic,
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      })

      if (!result.success) {
        throw new Error(result.error || "Email failed")
      }

      toast({
        title: "Reply Sent",
        description: `Email sent to ${activeTicket.email}`,
      })

      // Mark ticket in-progress after successful response
      if (activeTicket.status === "pending") {
        const { error } = await supabase
          .from("support_tickets")
          .update({
            status: "in_progress",
            updated_at: new Date().toISOString(),
          })
          .eq("id", activeTicket.id)

        if (!error) {
          setTickets((prev) =>
            prev.map((t) =>
              t.id === activeTicket.id ? { ...t, status: "in_progress" } : t
            )
          )
        }
      }

      closeReplyDialog()
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Unable to send support reply.",
        variant: "destructive",
      })
      setSendingReply(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const pendingCount = tickets.filter((t) => t.status === "pending").length

  const statusBadge = (status: string) => {
    if (status === "resolved") return <Badge variant="default">resolved</Badge>
    if (status === "in_progress") return <Badge variant="secondary">in progress</Badge>
    return <Badge variant="outline">pending</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-1">
            Review user support requests and reply via email
          </p>
        </div>
        <Button onClick={() => fetchTickets(false)} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Support Requests</CardTitle>
          <CardDescription>
            Compose and send replies directly from this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0 p-2 sm:p-6 -mx-2 sm:mx-0">
          <div className="rounded-md border">
            <TableScroll>
              <Table noWrapper compact>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No support tickets yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.name}</TableCell>
                        <TableCell>{ticket.email}</TableCell>
                        <TableCell>{ticket.topic}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="truncate">{ticket.message}</p>
                        </TableCell>
                        <TableCell>{statusBadge(ticket.status)}</TableCell>
                        <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReplyDialog(ticket)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            {ticket.status !== "resolved" && (
                              <Button
                                size="sm"
                                onClick={() => markResolved(ticket)}
                                disabled={updatingId === ticket.id}
                              >
                                {updatingId === ticket.id ? (
                                  <Clock className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Resolve
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableScroll>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!activeTicket} onOpenChange={(open) => !open && closeReplyDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reply to Support Ticket</DialogTitle>
            <DialogDescription>
              Compose and send a response email directly to {activeTicket?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>To</Label>
              <Input value={activeTicket?.email || ""} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reply-subject">Subject</Label>
              <Input
                id="reply-subject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reply-message">Message</Label>
              <Textarea
                id="reply-message"
                rows={10}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your response..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeReplyDialog} disabled={sendingReply}>
                Cancel
              </Button>
              <Button onClick={handleSendReply} disabled={sendingReply}>
                {sendingReply ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

