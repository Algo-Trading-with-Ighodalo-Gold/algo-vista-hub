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
  Trash2,
  RefreshCw,
  CalendarPlus,
  Download
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { EnrichedLicense } from '@/hooks/use-accounts-data'
import { 
  isLicenseActive, 
  formatPlanName, 
  getLicenseStatusVariant 
} from '@/lib/accounts-utils'
import { ConnectAccountDialog } from './connect-account-dialog'
import { ExtendLicenseDialog } from './extend-license-dialog'
import { supabase } from '@/integrations/supabase/client'
import JSZip from 'jszip'

interface LicenseCardProps {
  license: EnrichedLicense
  onConnectAccount: (licenseId: string, account: number, accountName?: string, broker?: string) => Promise<void>
  onRemoveAccount: (licenseId: string, account: number) => void | Promise<void>
  onRenew?: (licenseId: string) => Promise<void>
  onExtend?: (licenseId: string, newExpiryDate: Date) => Promise<void>
  isLoading?: boolean
}

export function LicenseCard({ 
  license, 
  onConnectAccount, 
  onRemoveAccount,
  onRenew,
  onExtend,
  isLoading = false 
}: LicenseCardProps) {
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)

  const active = isLicenseActive(license)
  const statusVariant = getLicenseStatusVariant(license.status, active)
  const planName = formatPlanName(license.tier || null)
  const canConnect = active && (license.max_allowed === 0 || license.connected_count < license.max_allowed)
  
  // Check if license is expired
  const isExpired = license.expires_at ? new Date(license.expires_at) < new Date() : false
  const canRenew = !active && (isExpired || license.status === 'expired')
  const canDownload = active && !isExpired && license.status === 'active'

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

  const handleDownload = async () => {
    try {
      // Get download URL from RPC function
      const { data, error: rpcError } = await supabase.rpc('get_ea_download_url' as any, {
        p_license_id: license.id
      }) as { data: any; error: any }

      if (rpcError) {
        console.error('RPC Error:', rpcError)
        toast({
          title: "Download Failed",
          description: rpcError.message || "Failed to get download link. Please try again.",
          variant: "destructive"
        })
        return
      }

      const result = data as { success: boolean; error?: string; file_key?: string; bucket?: string; product_name?: string }
      
      if (!result || !result.success) {
        toast({
          title: "Download Failed",
          description: result?.error || "Failed to get download link.",
          variant: "destructive"
        })
        return
      }

      // Generate signed URL from Supabase Storage
      const { data: urlData, error: urlError } = await supabase.storage
        .from(result.bucket || 'ea-files')
        .createSignedUrl(result.file_key || '', 3600) // 1 hour expiry

      if (urlError || !urlData) {
        toast({
          title: "Download Failed",
          description: urlError?.message || "Failed to generate download link.",
          variant: "destructive"
        })
        return
      }

      // Download the EA file
      const eaResponse = await fetch(urlData.signedUrl)
      if (!eaResponse.ok) {
        throw new Error('Failed to download EA file')
      }
      const eaBlob = await eaResponse.blob()

      // Determine file extension from file_key
      const fileExt = result.file_key?.split('.').pop()?.toLowerCase() || 'ex5'
      const eaFileName = `${result.product_name || 'EA'}.${fileExt}`
      
      // Create settings file content (.set file for MetaTrader)
      // .set files are binary, but we'll create a text-based settings file with recommended parameters
      const settingsFileName = `${result.product_name || 'EA'}.set`
      const settingsContent = `; EA Settings File
; Product: ${result.product_name || 'EA'}
; Generated: ${new Date().toISOString()}

; Recommended Settings:
; Please adjust these parameters according to your trading strategy and risk tolerance

; Risk Management
RiskPercent=1.0
MaxLotSize=10.0
MinLotSize=0.01

; Trading Parameters
MagicNumber=123456
Slippage=3
MaxSpread=50

; Time Settings
StartHour=0
EndHour=23

; Additional Notes:
; - Always test on a demo account first
; - Adjust risk parameters based on your account size
; - Monitor your EA regularly
; - Use proper risk management

; For MT4/MT5: Copy this file to your MetaTrader MQL4/MQL5/Profiles/Tester/ folder
; Or load it directly in the EA input parameters dialog
`

      // Create ZIP file
      const zip = new JSZip()
      
      // Add EA file to ZIP
      zip.file(eaFileName, eaBlob)
      
      // Add settings file to ZIP
      zip.file(settingsFileName, settingsContent)

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })

      // Create download link for ZIP
      const zipUrl = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = zipUrl
      link.download = `${result.product_name || 'EA'}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the object URL
      URL.revokeObjectURL(zipUrl)

      toast({
        title: "Download Started!",
        description: `Downloading ${result.product_name || 'EA'} package (ZIP)...`,
      })
    } catch (error: any) {
      console.error('Error downloading EA:', error)
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download EA. Please try again.",
        variant: "destructive"
      })
    }
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
            <div className="flex gap-2 flex-wrap">
              {onExtend && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => setIsExtendDialogOpen(true)}
                  disabled={isLoading}
                >
                  <CalendarPlus className="h-4 w-4" />
                  Extend License
                </Button>
              )}
              {canRenew && onRenew && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => onRenew(license.id)}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                  Renew
                </Button>
              )}
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatDate(license.expires_at)}
                    </span>
                    {onExtend && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => setIsExtendDialogOpen(true)}
                        disabled={isLoading}
                      >
                        <CalendarPlus className="h-3 w-3" />
                        Extend
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {!license.expires_at && onExtend && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    No expiry date set
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => setIsExtendDialogOpen(true)}
                    disabled={isLoading}
                  >
                    <CalendarPlus className="h-3 w-3" />
                    Set Expiry
                  </Button>
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

              {/* Download EA Button */}
              {canDownload && (
                <div className="pt-2 border-t">
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full gap-2"
                    onClick={handleDownload}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4" />
                    Download EA
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Download the EA file (.ex4) for this license
                  </p>
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

      {onExtend && (
        <ExtendLicenseDialog
          open={isExtendDialogOpen}
          onOpenChange={setIsExtendDialogOpen}
          onExtend={async (licenseId, newExpiryDate) => {
            await onExtend(license.id, newExpiryDate)
            setIsExtendDialogOpen(false)
          }}
          isLoading={isLoading}
          licenseName={license.ea_product_name || 'EA License'}
          currentExpiryDate={license.expires_at}
          licenseId={license.id}
        />
      )}
    </>
  )
}

