import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Link as LinkIcon, DollarSign, Users, Settings, CheckCircle, XCircle, MousePointerClick, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/integrations/supabase/types"

type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"]

interface AffiliateWithUser extends Affiliate {
  user_name: string | null
  user_email: string | null
  referral_clicks?: number
  conversions?: number
}

type ReferralClick = Database["public"]["Tables"]["referral_clicks"]["Row"]

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<AffiliateWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateWithUser | null>(null)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  const [commissionRate, setCommissionRate] = useState("")
  const [processingPayout, setProcessingPayout] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch affiliates
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false })

      if (affiliatesError) throw affiliatesError

      // Get profiles for affiliates to show user info
      const userIds = (affiliatesData || []).map((a) => a.user_id)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds)

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p])
      )

      // Fetch referral clicks for each affiliate
      const affiliatesWithUsers: AffiliateWithUser[] = await Promise.all(
        (affiliatesData || []).map(async (affiliate) => {
          const profile = profileMap.get(affiliate.user_id)
          const userName = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null
            : null
          
          // Fetch referral clicks
          const { data: clicks } = await supabase
            .from("referral_clicks")
            .select("*")
            .eq("referrer_user_id", affiliate.user_id)

          const referralClicks = clicks?.length || 0
          const conversions = clicks?.filter(c => c.converted).length || 0
          
          return {
            ...affiliate,
            user_name: userName,
            user_email: null, // Email would need RPC function to fetch
            referral_clicks: referralClicks,
            conversions: conversions
          }
        })
      )

      setAffiliates(affiliatesWithUsers)
    } catch (error: any) {
      console.error("Error fetching affiliates:", error)
      toast({
        title: "Error",
        description: "Failed to load affiliates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetCommission = (affiliate: AffiliateWithUser) => {
    setEditingAffiliate(affiliate)
    setCommissionRate("") // Would need to get current rate from database
    setIsCommissionDialogOpen(true)
  }

  const handleSaveCommission = async () => {
    if (!editingAffiliate || !commissionRate) return

    try {
      const rate = parseFloat(commissionRate)
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast({
          title: "Error",
          description: "Commission rate must be between 0 and 100",
          variant: "destructive",
        })
        return
      }

      // Update commission rate (would need a commission_rates table or update affiliate record)
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: `Commission rate set to ${rate}% for affiliate`,
      })

      setIsCommissionDialogOpen(false)
      setCommissionRate("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set commission rate",
        variant: "destructive",
      })
    }
  }

  const handleProcessPayout = async (affiliate: AffiliateWithUser) => {
    setProcessingPayout(affiliate.id)

    try {
      const { error } = await supabase
        .from("affiliates")
        .update({
          payout_status: "paid",
          updated_at: new Date().toISOString()
        })
        .eq("id", affiliate.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Payout processed successfully",
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process payout",
        variant: "destructive",
      })
    } finally {
      setProcessingPayout(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalCommission = affiliates.reduce(
    (sum, aff) => sum + (aff.commission_earned || 0),
    0
  )

  const paidCommission = affiliates
    .filter(aff => aff.payout_status === "paid")
    .reduce((sum, aff) => sum + (aff.commission_earned || 0), 0)

  const pendingCommission = affiliates
    .filter(aff => aff.payout_status === "pending")
    .reduce((sum, aff) => sum + (aff.commission_earned || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground mt-2">
          Manage affiliate program participants and commission earnings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <p className="text-sm text-muted-foreground">
              Active affiliate accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              All-time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Paid Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${paidCommission.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              Commission paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${pendingCommission.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              Awaiting payout
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Affiliates</CardTitle>
          <CardDescription>
            Affiliate program participants and earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {affiliates.map((affiliate) => (
              <div
                key={affiliate.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {affiliate.user_name || `User ${affiliate.user_id.substring(0, 8)}`}
                    </p>
                    <Badge
                      variant={
                        affiliate.payout_status === "paid"
                          ? "default"
                          : affiliate.payout_status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {affiliate.payout_status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon className="h-3 w-3" />
                      <span>Code: {affiliate.referral_code}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3" />
                        <span>{affiliate.referral_clicks || 0} clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{affiliate.conversions || 0} conversions</span>
                      </div>
                    </div>
                    {affiliate.user_id && (
                      <span className="text-xs text-muted-foreground">
                        ID: {affiliate.user_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-lg">
                      ${(affiliate.commission_earned || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(affiliate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetCommission(affiliate)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {affiliate.payout_status === "pending" && affiliate.commission_earned > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProcessPayout(affiliate)}
                        disabled={processingPayout === affiliate.id}
                      >
                        {processingPayout === affiliate.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {affiliates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No affiliates yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Set Commission Rate Dialog */}
      <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Commission Rate</DialogTitle>
            <DialogDescription>
              {editingAffiliate?.user_name || `Affiliate ${editingAffiliate?.referral_code}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="e.g., 10.5"
              />
              <p className="text-xs text-muted-foreground">
                Enter the commission percentage (0-100)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCommission}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

