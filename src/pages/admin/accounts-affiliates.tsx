import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Activity, Link as LinkIcon, DollarSign, CreditCard } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type LicenseAccount = Database["public"]["Tables"]["license_accounts"]["Row"]
type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"]
type License = Database["public"]["Tables"]["licenses"]["Row"]

interface AccountWithLicense extends LicenseAccount {
  license: License | null
}

interface AffiliateWithUser extends Affiliate {
  user_email: string | null
}

export default function AccountsAffiliates() {
  const [accounts, setAccounts] = useState<AccountWithLicense[]>([])
  const [affiliates, setAffiliates] = useState<AffiliateWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch accounts with license info
      const { data: accountsData, error: accountsError } = await supabase
        .from("license_accounts")
        .select(`
          *,
          license:licenses(*)
        `)
        .order("created_at", { ascending: false })

      if (accountsError) throw accountsError

      setAccounts((accountsData as AccountWithLicense[]) || [])

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

      const affiliatesWithEmails: AffiliateWithUser[] = (affiliatesData || []).map(
        (affiliate) => {
          const profile = profileMap.get(affiliate.user_id)
          return {
            ...affiliate,
            user_email: profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null
              : null,
          }
        }
      )

      setAffiliates(affiliatesWithEmails)
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load accounts and affiliates",
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

  const activeAccounts = accounts.filter((a) => a.status === "active").length
  const totalCommission = affiliates.reduce(
    (sum, aff) => sum + (aff.commission_earned || 0),
    0
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Accounts & Affiliates</h1>
        <p className="text-muted-foreground mt-2">
          Manage connected accounts and affiliate information
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
            <CardDescription>
              {activeAccounts} active of {accounts.length} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-sm text-muted-foreground">
              Total MT5 accounts connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Affiliates
            </CardTitle>
            <CardDescription>
              Total commission: ${totalCommission.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <p className="text-sm text-muted-foreground">
              Active affiliate accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Connected Accounts</CardTitle>
              <CardDescription>
                MT5 accounts linked to EA licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Account: {account.account}</p>
                        <Badge
                          variant={
                            account.status === "active"
                              ? "default"
                              : account.status === "suspended"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {account.status}
                        </Badge>
                      </div>
                      {account.account_name && (
                        <p className="text-sm text-muted-foreground">
                          {account.account_name}
                        </p>
                      )}
                      {account.broker && (
                        <p className="text-sm text-muted-foreground">
                          Broker: {account.broker}
                        </p>
                      )}
                      {account.license && (
                        <p className="text-xs text-muted-foreground mt-1">
                          License: {account.license.license_key?.substring(0, 12)}...
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {account.balance !== null && (
                        <p className="font-medium">
                          ${account.balance.toFixed(2)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(account.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {accounts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No connected accounts yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {affiliate.user_email || `User ${affiliate.user_id.substring(0, 8)}`}
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
                      <p className="text-sm text-muted-foreground">
                        Code: {affiliate.referral_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">
                        ${(affiliate.commission_earned || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(affiliate.created_at).toLocaleDateString()}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

