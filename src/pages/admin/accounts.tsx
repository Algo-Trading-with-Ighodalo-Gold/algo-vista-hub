import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Activity, Package, TrendingUp, RefreshCw, Eye, Unlink, CalendarPlus } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type LicenseAccount = Database["public"]["Tables"]["license_accounts"]["Row"]
type License = Database["public"]["Tables"]["licenses"]["Row"]
type EaProduct = Database["public"]["Tables"]["ea_products"]["Row"]

interface AccountWithLicense extends LicenseAccount {
  license: License | null
}

interface AccountsByEA {
  ea_product_id: string | null
  ea_product_name: string | null
  product_code: string | null
  accounts: AccountWithLicense[]
}

interface AccountActivity {
  id: string
  account: string
  action: string
  timestamp: string
  details?: any
}

export default function AdminAccounts() {
  const [accountsByEA, setAccountsByEA] = useState<AccountsByEA[]>([])
  const [allAccounts, setAllAccounts] = useState<AccountWithLicense[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEA, setFilterEA] = useState<string>("all")
  const [viewingAccount, setViewingAccount] = useState<AccountWithLicense | null>(null)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)
  const [accountActivities, setAccountActivities] = useState<AccountActivity[]>([])
  const [unlinkingAccount, setUnlinkingAccount] = useState<AccountWithLicense | null>(null)
  const [extendingLicense, setExtendingLicense] = useState<{ licenseId: string; account: AccountWithLicense } | null>(null)
  const [newExpiryDate, setNewExpiryDate] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch accounts with license info
      const { data: accountsData, error: accountsError } = await supabase
        .from("license_accounts")
        .select(`
          *,
          license:licenses(*)
        `)
        .order("created_at", { ascending: false })
        
      console.log('Accounts fetch - data:', accountsData)
      console.log('Accounts fetch - error:', accountsError)

      if (accountsError) {
        console.error("Error fetching accounts:", accountsError)
        toast({
          title: "Error",
          description: accountsError.message || "Failed to load accounts. Make sure admin policies are applied.",
          variant: "destructive",
        })
        setAllAccounts([])
        setAccountsByEA([])
        setLoading(false)
        return
      }

      // Fetch EA products to match with licenses (use products table, fallback to ea_products)
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
      
      let eaProducts = productsData || []
      if (productsError || !productsData || productsData.length === 0) {
        // Fallback to ea_products for backward compatibility
        const { data: eaProductsData, error: eaProductsError } = await supabase
        .from("ea_products")
        .select("*")
      if (eaProductsError) {
        console.error("Error fetching EA products:", eaProductsError)
        }
        if (eaProductsData && eaProductsData.length > 0) {
          eaProducts = eaProductsData
        }
      }

      if (productsError && (!eaProducts || eaProducts.length === 0)) {
        console.error("Error fetching products:", productsError)
        // Continue without products - we'll just show what we have
      }

      const eaProductsMap = new Map(
        (eaProducts || []).map(p => [p.id, p])
      )

      // Also create a map by product_code for matching
      const eaProductsByCodeMap = new Map(
        (eaProducts || []).map(p => [p.product_code, p])
      )

      const accounts = (accountsData as AccountWithLicense[]) || []
      
      // Check for expired licenses and update account status
      const now = new Date()
      const updatedAccounts = await Promise.all(
        accounts.map(async (account) => {
          if (account.license && account.license.expires_at) {
            const expiresAt = new Date(account.license.expires_at)
            if (expiresAt < now && account.status === "active") {
              // License expired, update account status to inactive
              try {
                await supabase
                  .from("license_accounts")
                  .update({ status: "inactive" })
                  .eq("id", account.id)
                
                return { ...account, status: "inactive" as const }
              } catch (error) {
                console.error("Error updating account status:", error)
                return account
              }
            }
          }
          return account
        })
      )
      
      setAllAccounts(updatedAccounts)

      // Group accounts by EA product
      const grouped = new Map<string, AccountsByEA>()

      accounts.forEach((account) => {
        const license = account.license
        if (!license) {
          // Handle accounts without licenses
          const key = "no-license"
          if (!grouped.has(key)) {
            grouped.set(key, {
              ea_product_id: null,
              ea_product_name: "No License",
              product_code: null,
              accounts: []
            })
          }
          const updatedAccount = updatedAccounts.find(a => a.id === account.id) || account
          grouped.get(key)!.accounts.push(updatedAccount)
          return
        }

        // Try to find EA product
        let eaProduct: EaProduct | null = null
        if (license.ea_product_id) {
          // Try UUID match first
          eaProduct = eaProductsMap.get(license.ea_product_id) || null
          // If not found, try by product_code (ea_product_id might be product_code)
          if (!eaProduct) {
            eaProduct = eaProductsByCodeMap.get(license.ea_product_id) || null
          }
        }

        const eaProductId = eaProduct?.id || license.ea_product_id || "unknown"
        const eaProductName = eaProduct?.name || license.ea_product_name || "Unknown EA"
        const productCode = eaProduct?.product_code || null

        if (!grouped.has(eaProductId)) {
          grouped.set(eaProductId, {
            ea_product_id: eaProductId === "unknown" ? null : eaProductId,
            ea_product_name: eaProductName,
            product_code: productCode,
            accounts: []
          })
        }

        // Use updated account status
        const updatedAccount = updatedAccounts.find(a => a.id === account.id) || account
        grouped.get(eaProductId)!.accounts.push(updatedAccount)
      })

      // Convert to array and sort
      const groupedArray = Array.from(grouped.values()).sort((a, b) => {
        const nameA = a.ea_product_name || ""
        const nameB = b.ea_product_name || ""
        return nameA.localeCompare(nameB)
      })

      setAccountsByEA(groupedArray)
    } catch (error: any) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load accounts. Make sure you have admin permissions.",
        variant: "destructive",
      })
      // Set empty arrays on error so UI doesn't break
      setAllAccounts([])
      setAccountsByEA([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewActivity = async (account: AccountWithLicense) => {
    setViewingAccount(account)
    setIsLogsDialogOpen(true)

    try {
      // Fetch license logs related to this account
      if (account.license_id) {
        const { data: logs } = await supabase
          .from("license_logs")
          .select("*")
          .eq("license_id", account.license_id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (logs) {
          const activities: AccountActivity[] = logs.map(log => ({
            id: log.id,
            account: account.account.toString(),
            action: log.action,
            timestamp: log.created_at,
            details: log.details
          }))
          setAccountActivities(activities)
        }
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error)
      setAccountActivities([])
    }
  }

  const handleUnlinkAccount = async (account: AccountWithLicense) => {
    if (!account.license_id) return

    try {
      const { error } = await supabase
        .from("license_accounts")
        .delete()
        .eq("id", account.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Account unlinked successfully",
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unlink account",
        variant: "destructive",
      })
    }
  }

  const handleExtendLicense = async () => {
    if (!extendingLicense) return

    try {
      const { data, error: rpcError } = await supabase.rpc('extend_license_expiry' as any, {
        p_license_id: extendingLicense.licenseId,
        p_new_expiry_date: new Date(newExpiryDate).toISOString()
      }) as { data: any; error: any }

      if (rpcError) {
        console.error('RPC Error:', rpcError)
        throw rpcError
      }

      const result = data as { success: boolean; error?: string; message?: string }
      
      if (!result) {
        throw new Error('No response from server')
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to extend license')
      }

      toast({
        title: "License Extended!",
        description: `License expiry date has been updated to ${new Date(newExpiryDate).toLocaleDateString()}`,
      })

      setExtendingLicense(null)
      setNewExpiryDate("")
      fetchData()
    } catch (error: any) {
      console.error('Error extending license:', error)
      toast({
        title: "Extension Failed",
        description: error.message || error.error || "Failed to extend license. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const activeAccounts = allAccounts.filter((a) => a.status === "active").length
  const filteredAccountsByEA = filterEA === "all" 
    ? accountsByEA 
    : accountsByEA.filter(group => 
        group.ea_product_id === filterEA || 
        group.product_code === filterEA
      )

  // Get unique EA products for filter
  const eaProducts = accountsByEA.map(group => ({
    id: group.ea_product_id || "unknown",
    name: group.ea_product_name || "Unknown EA",
    code: group.product_code
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connected Accounts</h1>
          <p className="text-muted-foreground mt-2">
            View all MT5 accounts connected to EA licenses, grouped by EA product
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true)
              fetchData()
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={filterEA} onValueChange={setFilterEA}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by EA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All EAs</SelectItem>
            {eaProducts.map((ea) => (
              <SelectItem key={ea.id} value={ea.id}>
                {ea.name} {ea.code && `(${ea.code})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Total Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allAccounts.length}</div>
            <p className="text-sm text-muted-foreground">
              {activeAccounts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              EA Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountsByEA.length}</div>
            <p className="text-sm text-muted-foreground">
              With connected accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allAccounts.length > 0 
                ? `${Math.round((activeAccounts / allAccounts.length) * 100)}%`
                : "0%"}
            </div>
            <p className="text-sm text-muted-foreground">
              Accounts currently active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {filteredAccountsByEA.map((group) => (
          <Card key={group.ea_product_id || "unknown"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {group.ea_product_name}
                  </CardTitle>
                  <CardDescription>
                    {group.product_code && `Product Code: ${group.product_code}`}
                    {!group.product_code && "No product code"}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {group.accounts.length} account{group.accounts.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {group.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
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
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            License: {account.license.license_key?.substring(0, 20)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            User: {account.license.user_id?.substring(0, 8)}...
                          </p>
                          {account.license.expires_at && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {new Date(account.license.expires_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                      {account.balance !== null && account.balance !== undefined && (
                        <p className="font-medium">
                          ${typeof account.balance === 'number' 
                            ? account.balance.toFixed(2) 
                            : parseFloat(String(account.balance || 0)).toFixed(2)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(account.created_at).toLocaleDateString()}
                      </p>
                      </div>
                      <div className="flex gap-2">
                        {account.license && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (account.license_id) {
                                const defaultDate = account.license.expires_at 
                                  ? new Date(account.license.expires_at)
                                  : new Date()
                                if (defaultDate <= new Date()) {
                                  defaultDate.setFullYear(defaultDate.getFullYear() + 1)
                                } else {
                                  defaultDate.setFullYear(defaultDate.getFullYear() + 1)
                                }
                                setNewExpiryDate(defaultDate.toISOString().split('T')[0])
                                setExtendingLicense({ licenseId: account.license_id, account })
                              }
                            }}
                            title="Extend License"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewActivity(account)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUnlinkingAccount(account)}
                            >
                              <Unlink className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Unlink Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to unlink account {account.account}? This will remove the connection between the account and its license.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleUnlinkAccount(account)}>
                                Unlink
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}

                {group.accounts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No accounts connected to this EA
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAccountsByEA.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No accounts found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Activity Logs Dialog */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Activity Logs</DialogTitle>
            <DialogDescription>
              Account: {viewingAccount?.account} - {viewingAccount?.account_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {accountActivities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="text-xs">
                        {activity.details ? JSON.stringify(activity.details) : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No activity logs found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Extend License Dialog */}
      <Dialog open={!!extendingLicense} onOpenChange={(open) => !open && setExtendingLicense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend License</DialogTitle>
            <DialogDescription>
              Set a new expiration date for the license associated with account {extendingLicense?.account.account}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {extendingLicense?.account.license?.expires_at && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-xs text-muted-foreground">Current Expiration</Label>
                <p className="text-sm font-medium">
                  {new Date(extendingLicense.account.license.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="expiry-date">New Expiration Date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">
                Select a date in the future. The license will expire on this date.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtendingLicense(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtendLicense}
              disabled={!newExpiryDate || new Date(newExpiryDate) <= new Date()}
            >
              Extend License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

