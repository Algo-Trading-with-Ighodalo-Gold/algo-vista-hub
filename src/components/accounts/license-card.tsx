import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Plus,
  Calendar,
  Key,
  Copy,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { EnrichedLicense } from '@/hooks/use-accounts-data'
import { 
  isLicenseActive, 
  formatPlanName, 
  getLicenseStatusVariant 
} from '@/lib/accounts-utils'
import { ConnectAccountDialog } from './connect-account-dialog'

interface LicenseCardProps {
  license: EnrichedLicense
  onConnectAccount: (licenseId: string, account: number, accountName?: string, broker?: string) => Promise<void>
  onRemoveAccount: (licenseId: string, account: number) => void | Promise<void>
  isLoading?: boolean
}

export function LicenseCard({ 
  license, 
  onConnectAccount, 
  onRemoveAccount,
  isLoading = false 
}: LicenseCardProps) {
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)

  const active = isLicenseActive(license)
  const statusVariant = getLicenseStatusVariant(license.status, active)
  const planName = formatPlanName(license.tier || null)
  const canConnect = active && (license.max_allowed === 0 || license.connected_count < license.max_allowed)

  const copyLicenseKey = () => {
    navigator.clipboard.writeText(license.license_key)
    toast({
      title: "Copied!",
      description: "License key copied to clipboard",
    })
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleConnect = async (account: number, accountName?: string, broker?: string) => {
    await onConnectAccount(license.id, account, accountName, broker)
    setIsConnectDialogOpen(false)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {license.ea_product_name || 'EA License'}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant={statusVariant}>
                  {active ? 'Active' : license.status}
                </Badge>
                <Badge variant="outline">
                  {planName}
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  {license.connected_count}/{license.max_allowed === 0 ? '∞' : license.max_allowed} accounts
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    View
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* License Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">License Key:</span>
                <div className="flex gap-2">
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {license.license_key}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyLicenseKey}
                    className="h-7 w-7 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {license.expires_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Expires:
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(license.expires_at)}
                  </span>
                </div>
              )}

              {license.tier && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan:</span>
                  <Badge variant="outline">{license.tier.name}</Badge>
                </div>
              )}

              {license.subscription && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subscription:</span>
                  <span className="text-sm font-medium">{license.subscription.plan}</span>
                </div>
              )}
            </div>

            {/* Connected Accounts */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  Connected Accounts ({license.connected_count}/{license.max_allowed === 0 ? '∞' : license.max_allowed})
                </h3>
                <Button
                  size="sm"
                  onClick={() => setIsConnectDialogOpen(true)}
                  disabled={!canConnect || isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Connect Account
                </Button>
              </div>

              {license.connected_accounts.length > 0 ? (
                <div className="space-y-2">
                  {license.connected_accounts.map((account) => (
                    <Card key={account.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {account.status === 'active' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {account.account_name || `Account ${account.account}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              MT5: {account.account} {account.broker && `• ${account.broker}`}
                            </p>
                            {account.balance != null && (
                              <p className="text-xs text-muted-foreground">
                                Balance: ${account.balance.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onRemoveAccount(license.id, account.account)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No accounts connected yet</p>
                </Card>
              )}

              {!canConnect && license.connected_count > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  {active 
                    ? `Account limit reached (${license.max_allowed} max)`
                    : 'License is not active or has expired'
                  }
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <ConnectAccountDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        onConnect={handleConnect}
        isLoading={isLoading}
        licenseName={license.ea_product_name || 'EA License'}
      />
    </>
  )
}

