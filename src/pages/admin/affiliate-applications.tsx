import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, CheckCircle, XCircle, Clock, RefreshCw, ExternalLink } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type AffiliateApplication = Database["public"]["Tables"]["affiliate_applications"]["Row"]

export default function AdminAffiliateApplications() {
  const [applications, setApplications] = useState<AffiliateApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchApplications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const { data, error } = await supabase
        .from("affiliate_applications")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load affiliate applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReferralCode = (userId: string) => {
    const short = userId.replace(/-/g, "").slice(0, 6).toUpperCase()
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `AFF${short}${rand}`
  }

  const handleApprove = async (app: AffiliateApplication) => {
    setProcessing(app.id)
    try {
      const { data: existing } = await supabase
        .from("affiliates")
        .select("id, referral_code")
        .eq("user_id", app.user_id)
        .single()

      let referralCode: string
      if (existing) {
        referralCode = existing.referral_code
      } else {
        referralCode = generateReferralCode(app.user_id)
        const { error: insertError } = await supabase.from("affiliates").insert({
          user_id: app.user_id,
          referral_code: referralCode,
          commission_earned: 0,
          payout_status: "pending",
        })
        if (insertError) throw insertError
      }

      const { error: updateError } = await supabase
        .from("affiliate_applications")
        .update({ status: "approved" })
        .eq("id", app.id)

      if (updateError) throw updateError

      // Optimistic UI update - show approved immediately (don't refetch to avoid overwriting)
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "approved" } : a))
      )

      toast({
        title: "Approved",
        description: existing
          ? `${app.full_name} was already an affiliate. Application marked approved.`
          : `${app.full_name} is now an affiliate with code: ${referralCode}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (app: AffiliateApplication) => {
    if (!confirm(`Reject affiliate application from ${app.full_name}?`)) return
    setProcessing(app.id)
    try {
      const { error } = await supabase
        .from("affiliate_applications")
        .update({ status: "rejected" })
        .eq("id", app.id)

      if (error) throw error

      // Optimistic UI update - show rejected immediately
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "rejected" } : a))
      )

      toast({ title: "Rejected", description: "Application rejected" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const pendingCount = applications.filter((a) => a.status === "pending").length

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
            <UserPlus className="h-8 w-8" />
            Affiliate Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve users who want to become affiliates
          </p>
        </div>
        <Button onClick={fetchApplications} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
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
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Approve applications to create affiliate accounts. Rejected users can reapply.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0 overflow-x-auto">
          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No applications yet.</p>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{app.full_name}</div>
                    <div className="text-sm text-muted-foreground truncate">{app.email}</div>
                    {app.social_link && (
                      <a
                        href={app.social_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {app.social_link}
                      </a>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "default"
                          : app.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {app.status}
                    </Badge>
                    {app.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(app)}
                          disabled={processing === app.id}
                        >
                          {processing === app.id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(app)}
                          disabled={processing === app.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
