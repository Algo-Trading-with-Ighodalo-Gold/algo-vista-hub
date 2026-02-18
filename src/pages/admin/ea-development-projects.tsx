import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableScroll } from "@/components/admin/TableScroll"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { sendProjectApprovedEmail } from "@/lib/email/send-project-approval"
import { useToast } from "@/hooks/use-toast"
import { FileText, Search, CheckCircle, XCircle, Clock, Eye, Mail, RefreshCw } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type ProjectInquiry = Database["public"]["Tables"]["project_inquiries"]["Row"]

interface ProjectInquiryWithDetails extends ProjectInquiry {
  user_name?: string
  user_email?: string
}

export default function EADevelopmentProjectsManagement() {
  const [inquiries, setInquiries] = useState<ProjectInquiryWithDetails[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<ProjectInquiryWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingInquiry, setViewingInquiry] = useState<ProjectInquiryWithDetails | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [approvingInquiry, setApprovingInquiry] = useState<ProjectInquiryWithDetails | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [calendlyLink, setCalendlyLink] = useState("https://calendly.com/algotradingwithighodalo/30min")
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
    
    // Set up real-time subscription for project_inquiries table
    const channel = supabase
      .channel('project_inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'project_inquiries'
        },
        (payload) => {
          fetchInquiries(false)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = inquiries.filter(
        (inquiry) =>
          inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredInquiries(filtered)
    } else {
      setFilteredInquiries(inquiries)
    }
  }, [searchTerm, inquiries])

  const fetchInquiries = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const { data, error } = await supabase
        .from("project_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Get user info for each inquiry
      const inquiriesWithDetails: ProjectInquiryWithDetails[] = await Promise.all(
        (data || []).map(async (inquiry) => {
          // Try to find user by email
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, user_id")
            .eq("user_id", inquiry.user_id || "")
            .single()

          return {
            ...inquiry,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
            user_email: inquiry.email
          }
        })
      )

      setInquiries(inquiriesWithDetails)
      setFilteredInquiries(inquiriesWithDetails)
    } catch (error: any) {
      console.error("Error fetching inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to load project inquiries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (inquiry: ProjectInquiryWithDetails) => {
    setViewingInquiry(inquiry)
    setIsViewDialogOpen(true)
  }

  const handleApprove = (inquiry: ProjectInquiryWithDetails) => {
    setApprovingInquiry(inquiry)
    setIsApproveDialogOpen(true)
  }

  const handleProcessApproval = async () => {
    if (!approvingInquiry || isApproving) return

    setIsApproving(true)
    const inquiry = approvingInquiry
    const notesForEmail = adminNotes
    const linkForEmail = calendlyLink

    try {
      // 1. Update inquiry status in database first
      const { error: updateError } = await supabase
        .from("project_inquiries")
        .update({
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", inquiry.id)

      if (updateError) throw updateError

      // 2. Optimistic UI update - show approved immediately
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: "approved" } : i))
      )
      setFilteredInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: "approved" } : i))
      )

      // 3. Close dialog so user sees the table update
      setIsApproveDialogOpen(false)
      setApprovingInquiry(null)
      setAdminNotes("")
      setCalendlyLink("https://calendly.com/algotradingwithighodalo/30min")

      // 4. Send email via helper (uses POST explicitly)
      const emailResult = await sendProjectApprovedEmail({
        inquiry: { email: inquiry.email, name: inquiry.name, strategy: inquiry.strategy },
        adminNotes: notesForEmail || undefined,
        calendlyLink: linkForEmail || "https://calendly.com/algotradingwithighodalo/30min",
      })

      toast({
        title: "Approved",
        description: emailResult.success
          ? `Project approved. Email sent to ${inquiry.email}`
          : "Project approved.",
      })
      if (!emailResult.success) {
        toast({
          title: "Email failed",
          description: emailResult.error || "Check Supabase Function logs.",
          variant: "destructive",
        })
      }

      await fetchInquiries(false)
      window.dispatchEvent(new CustomEvent("projectInquiryApproved"))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve inquiry",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async (inquiry: ProjectInquiryWithDetails) => {
    if (!confirm(`Are you sure you want to reject this inquiry from ${inquiry.name}?`)) return

    try {
      const { error } = await supabase
        .from("project_inquiries")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString()
        })
        .eq("id", inquiry.id)

      if (error) throw error

      // Optimistic UI update - show rejected immediately
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === inquiry.id ? { ...i, status: "rejected" } : i
        )
      )
      setFilteredInquiries((prev) =>
        prev.map((i) =>
          i.id === inquiry.id ? { ...i, status: "rejected" } : i
        )
      )

      toast({
        title: "Success",
        description: "Project inquiry rejected",
      })

      await fetchInquiries(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject inquiry",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const pendingCount = inquiries.filter(i => i.status === "pending").length
  const approvedCount = inquiries.filter(i => i.status === "approved").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EA Development Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and approve EA development project inquiries
          </p>
        </div>
        <Button onClick={fetchInquiries} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
            <p className="text-sm text-muted-foreground">
              All project inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-sm text-muted-foreground">
              Approved projects
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search inquiries by name, email, or strategy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="min-w-0 p-2 sm:p-6 -mx-2 sm:mx-0">
          <div className="rounded-md border">
            <TableScroll>
              <Table noWrapper compact>
                <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {inquiry.strategy.substring(0, 50)}...
                    </TableCell>
                    <TableCell>{inquiry.budget || "N/A"}</TableCell>
                    <TableCell>{inquiry.timeline || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(inquiry.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(inquiry)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {inquiry.status === "pending" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApprove(inquiry)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(inquiry)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </TableScroll>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Inquiry Details</DialogTitle>
            <DialogDescription>
              {viewingInquiry?.name} - {viewingInquiry?.email}
            </DialogDescription>
          </DialogHeader>
          {viewingInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge variant={getStatusVariant(viewingInquiry.status)}>
                    {viewingInquiry.status}
                  </Badge>
                </div>
                <div>
                  <Label>Submitted</Label>
                  <p>{new Date(viewingInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label>Strategy Description</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.strategy}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Instruments</Label>
                  <p className="text-sm">{viewingInquiry.instruments || "N/A"}</p>
                </div>
                <div>
                  <Label>Timeframes</Label>
                  <p className="text-sm">{viewingInquiry.timeframes || "N/A"}</p>
                </div>
              </div>
              <div>
                <Label>Entry Logic</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.entry_logic}</p>
              </div>
              <div>
                <Label>Exit Logic</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.exit_logic}</p>
              </div>
              <div>
                <Label>Risk Management</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.risk_management || "N/A"}</p>
              </div>
              <div>
                <Label>Trade Management</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.trade_management || "N/A"}</p>
              </div>
              <div>
                <Label>Special Features</Label>
                <p className="text-sm whitespace-pre-wrap">{viewingInquiry.special_features || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Budget</Label>
                  <p className="text-sm font-medium">{viewingInquiry.budget || "Not specified"}</p>
                </div>
                <div>
                  <Label>Timeline</Label>
                  <p className="text-sm font-medium">{viewingInquiry.timeline || "Flexible"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog
        open={isApproveDialogOpen}
        onOpenChange={(open) => {
          setIsApproveDialogOpen(open)
          if (!open) setApprovingInquiry(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Project Inquiry</DialogTitle>
            <DialogDescription>
              Approve this project inquiry and notify the user via email
            </DialogDescription>
          </DialogHeader>
          {approvingInquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Project: {approvingInquiry.strategy.substring(0, 50)}...</p>
                <p className="text-sm text-muted-foreground">Client: {approvingInquiry.name} ({approvingInquiry.email})</p>
              </div>
              <div className="space-y-2">
                <Label>Admin Notes (Optional)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Calendly Booking Link</Label>
                <Input
                  value={calendlyLink}
                  onChange={(e) => setCalendlyLink(e.target.value)}
                  placeholder="https://calendly.com/your-team/30min"
                />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 inline mr-2" />
                  An approval email with booking link will be sent to {approvingInquiry.email}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleProcessApproval}
              disabled={isApproving}
            >
              {isApproving ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {isApproving ? "Approving..." : "Approve & Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

