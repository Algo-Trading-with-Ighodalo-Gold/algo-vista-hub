import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Link as LinkIcon, DollarSign, Users } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"]

interface AffiliateWithUser extends Affiliate {
  user_name: string | null
  user_email: string | null
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<AffiliateWithUser[]>([])
  const [loading, setLoading] = useState(true)
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

      // Get user emails from auth.users (if accessible via RPC)
      const affiliatesWithUsers: AffiliateWithUser[] = (affiliatesData || []).map(
        (affiliate) => {
          const profile = profileMap.get(affiliate.user_id)
          const userName = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null
            : null
          
          return {
            ...affiliate,
            user_name: userName,
            user_email: null, // Email would need RPC function to fetch
          }
        }
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
                    {affiliate.user_id && (
                      <span className="text-xs text-muted-foreground">
                        ID: {affiliate.user_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium text-lg">
                    ${(affiliate.commission_earned || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(affiliate.created_at).toLocaleDateString()}
                  </p>
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
    </div>
  )
}

