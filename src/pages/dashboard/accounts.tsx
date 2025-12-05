import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { 
  Activity, 
  Search,
  RefreshCw,
  Key,
  BarChart3,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleReveal } from '@/components/ui/scroll-reveal'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useAccountsData, EnrichedLicense } from '@/hooks/use-accounts-data'
import { LicenseCard } from '@/components/accounts/license-card'
import { supabase } from '@/integrations/supabase/client'
import { isLicenseActive, getLicenseStatusVariant } from '@/lib/accounts-utils'

export default function AccountsPage() {
  const { user } = useAuth()
  const { licenses, loading, error, refetch } = useAccountsData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('licenses')
  const [isLoading, setIsLoading] = useState(false)
  const [removingAccount, setRemovingAccount] = useState<{ licenseId: string; account: number } | null>(null)

  // Filter licenses by search term
  const filteredLicenses = useMemo(() => {
    if (!searchTerm) return licenses

    const term = searchTerm.toLowerCase()
    return licenses.filter(license => 
      license.ea_product_name?.toLowerCase().includes(term) ||
      license.license_key.toLowerCase().includes(term) ||
      license.connected_accounts.some(acc => 
        acc.account.toString().includes(term) ||
        acc.account_name?.toLowerCase().includes(term)
      )
    )
  }, [licenses, searchTerm])

  // Get all accounts across all licenses
  const allAccounts = useMemo(() => {
    return licenses.flatMap(license => 
      license.connected_accounts.map(acc => ({
        ...acc,
        license_id: license.id,
        license_name: license.ea_product_name || 'EA License',
        license_status: license.status,
        license_active: isLicenseActive(license)
      }))
    )
  }, [licenses])

  // Filter accounts by search term
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return allAccounts

    const term = searchTerm.toLowerCase()
    return allAccounts.filter(account =>
      account.account.toString().includes(term) ||
      account.account_name?.toLowerCase().includes(term) ||
      account.broker?.toLowerCase().includes(term) ||
      account.license_name?.toLowerCase().includes(term)
    )
  }, [allAccounts, searchTerm])

  const handleConnectAccount = async (
    licenseId: string, 
    account: number, 
    accountName?: string, 
    broker?: string
  ) => {
    setIsLoading(true)
    try {
      const { data, error: rpcError } = await supabase.rpc('link_account_to_license' as any, {
        p_license_id: licenseId,
        p_account: account
      }) as { data: any; error: any }

      if (rpcError) throw rpcError

      const result = data as { success: boolean; error?: string; message?: string }
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to connect account')
      }

      // Update account metadata if provided (optional fields)
      if (accountName || broker) {
        const { error: updateError } = await supabase
          .from('license_accounts' as any)
          .update({
            account_name: accountName || null,
            broker: broker || null
          })
          .eq('license_id', licenseId)
          .eq('account', account)

        if (updateError) {
          console.warn('Failed to update account metadata:', updateError)
          // Don't fail the whole operation, just log it
        }
      }

      toast({
        title: "Account Connected!",
        description: `MT5 account ${account} has been linked successfully`,
      })

      await refetch()
    } catch (error: any) {
      console.error('Error connecting account:', error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAccount = async (licenseId: string, account: number) => {
    setIsLoading(true)
    try {
      const { data, error: rpcError } = await supabase.rpc('unlink_account_from_license' as any, {
        p_license_id: licenseId,
        p_account: account
      }) as { data: any; error: any }

      if (rpcError) throw rpcError

      const result = data as { success: boolean; error?: string; message?: string }
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to remove account')
      }

      toast({
        title: "Account Removed",
        description: `MT5 account ${account} has been unlinked`,
      })

      await refetch()
    } catch (error: any) {
      console.error('Error removing account:', error)
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setRemovingAccount(null)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await refetch()
      toast({
        title: "Refreshed!",
        description: "Account data has been updated",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRenew = async (licenseId: string) => {
    setIsLoading(true)
    try {
      // Find the license to get its details
      const license = licenses.find(l => l.id === licenseId)
      if (!license) {
        throw new Error('License not found')
      }

      // Map EA product names to route IDs
      const eaRouteMap: Record<string, string> = {
        'Scalper Pro EA': 'scalper-pro-ea',
        'Swing Master EA': 'swing-master-ea',
        'Grid Trader EA': 'grid-trader-ea',
        'Trend Rider EA': 'trend-rider-ea',
        'Gold Rush EA': 'gold-rush-ea',
        'Night Owl EA': 'night-owl-ea',
        'Crypto Pulse EA': 'crypto-pulse-ea',
      }
      
      const eaRoute = license.ea_product_name 
        ? eaRouteMap[license.ea_product_name] || 'scalper-pro-ea'
        : 'scalper-pro-ea'
      
      // Navigate to subscription plans page
      navigate(`/products/subscription-plans/${eaRoute}`, {
        state: { 
          renewing: true,
          licenseId: licenseId,
          previousPlan: license.tier?.name || 'Pro'
        }
      })
      
      toast({
        title: "Redirecting to Renewal",
        description: "You'll be redirected to select a renewal plan",
      })
    } catch (error: any) {
      console.error('Error initiating renewal:', error)
      toast({
        title: "Renewal Failed",
        description: error.message || "Failed to initiate renewal. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const activeLicenses = licenses.filter(l => isLicenseActive(l)).length
  const activeAccounts = allAccounts.filter(a => a.status === 'active').length

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h3 className="font-semibold mb-2">Error Loading Data</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-7 w-7 text-primary" />
              EA Licenses & Accounts
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your Expert Advisor licenses and connected trading accounts
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </ScrollReveal>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <ScaleReveal delay={0.1}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Licenses</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">{activeLicenses}</div>
              <p className="text-sm text-muted-foreground">{licenses.length} total</p>
            </CardContent>
          </Card>
        </ScaleReveal>

        <ScaleReveal delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">{allAccounts.length}</div>
              <p className="text-sm text-muted-foreground">{activeAccounts} active</p>
            </CardContent>
          </Card>
        </ScaleReveal>

        <ScaleReveal delay={0.3}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-primary">
                {licenses.reduce((sum, l) => sum + l.connected_count, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Across all licenses</p>
            </CardContent>
          </Card>
        </ScaleReveal>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="licenses" className="gap-2">
            <Key className="h-4 w-4" />
            Licenses ({filteredLicenses.length})
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Trading Accounts ({filteredAccounts.length})
          </TabsTrigger>
        </TabsList>

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search licenses by EA name or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLicenses.length > 0 ? (
            <StaggerContainer className="space-y-3">
              {filteredLicenses.map((license, index) => (
                <StaggerItem key={license.id} direction={index % 2 === 0 ? 'left' : 'right'}>
                  <LicenseCard
                    license={license}
                    onConnectAccount={handleConnectAccount}
                    onRemoveAccount={async (licenseId, account) => {
                      setRemovingAccount({ licenseId, account })
                    }}
                    onRenew={handleRenew}
                    isLoading={isLoading}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card className="p-12 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No Licenses Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? "No licenses match your search"
                  : "Purchase an EA to get started with algorithmic trading"
                }
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Trading Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts by ID, name, or broker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAccounts.length > 0 ? (
            <StaggerContainer className="space-y-3">
              {filteredAccounts.map((account, index) => (
                <StaggerItem key={`${account.license_id}-${account.account}`} direction={index % 2 === 0 ? 'left' : 'right'}>
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {account.status === 'active' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            {account.account_name || `Account ${account.account}`}
                          </CardTitle>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                              {account.status}
                            </Badge>
                            <Badge variant="outline" className="font-mono">
                              {account.account}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Connected to EA</p>
                        <p className="text-sm font-semibold text-primary flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          {account.license_name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {account.broker && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Broker</p>
                            <p className="text-sm font-medium">{account.broker}</p>
                          </div>
                        )}
                        {account.balance != null && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Balance</p>
                            <p className="text-sm font-medium">${account.balance.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setRemovingAccount({ licenseId: account.license_id, account: account.account })}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Unlink Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No Accounts Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? "No accounts match your search"
                  : "Connect trading accounts from the Licenses tab"
                }
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Remove Account Confirmation Dialog */}
      <AlertDialog open={!!removingAccount} onOpenChange={(open) => !open && setRemovingAccount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink MT5 account {removingAccount?.account}? 
              This will disconnect it from the license but won't delete the account itself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (removingAccount) {
                  await handleRemoveAccount(removingAccount.licenseId, removingAccount.account)
                }
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Unlinking...
                </>
              ) : (
                'Unlink Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
