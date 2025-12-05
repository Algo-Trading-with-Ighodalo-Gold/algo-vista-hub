import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Activity, Package, TrendingUp, RefreshCw } from "lucide-react"
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

export default function AdminAccounts() {
  const [accountsByEA, setAccountsByEA] = useState<AccountsByEA[]>([])
  const [allAccounts, setAllAccounts] = useState<AccountWithLicense[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEA, setFilterEA] = useState<string>("all")
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

      // Fetch EA products to match with licenses
      const { data: eaProducts, error: eaProductsError } = await supabase
        .from("ea_products")
        .select("*")

      if (eaProductsError) {
        console.error("Error fetching EA products:", eaProductsError)
        // Continue without EA products - we'll just show what we have
      }

      const eaProductsMap = new Map(
        (eaProducts || []).map(p => [p.id, p])
      )

      // Also create a map by product_code for matching
      const eaProductsByCodeMap = new Map(
        (eaProducts || []).map(p => [p.product_code, p])
      )

      const accounts = (accountsData as AccountWithLicense[]) || []
      
      setAllAccounts(accounts)

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
          grouped.get(key)!.accounts.push(account)
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

        grouped.get(eaProductId)!.accounts.push(account)
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
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
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
    </div>
  )
}

