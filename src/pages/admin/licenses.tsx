import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Key, Search, Calendar, Eye, Clock, RefreshCw, Plus, Cloud } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"
import { syncLicenseToCloudflare } from "@/lib/cloudflare-sync"

type License = Database["public"]["Tables"]["licenses"]["Row"]
type LicenseValidation = Database["public"]["Tables"]["license_validations"]["Row"]
type LicenseLog = {
  id: string
  license_id: string
  action: string
  details: any
  created_at: string
}

interface LicenseWithUser extends License {
  user_email?: string
  user_name?: string
}

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<LicenseWithUser[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<LicenseWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingLicense, setViewingLicense] = useState<LicenseWithUser | null>(null)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)
  const [extendingLicense, setExtendingLicense] = useState<LicenseWithUser | null>(null)
  const [newExpirationDate, setNewExpirationDate] = useState("")
  const [licenseLogs, setLicenseLogs] = useState<LicenseLog[]>([])
  const [licenseValidations, setLicenseValidations] = useState<LicenseValidation[]>([])
  const [syncingLicense, setSyncingLicense] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchLicenses()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = licenses.filter(
        (license) =>
          license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.ea_product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredLicenses(filtered)
    } else {
      setFilteredLicenses(licenses)
    }
  }, [searchTerm, licenses])

  const fetchLicenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("licenses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Get user info for each license
      const licensesWithUsers: LicenseWithUser[] = await Promise.all(
        (data || []).map(async (license) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", license.user_id)
            .single()

          return {
            ...license,
            user_email: `user-${license.user_id.substring(0, 8)}`,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined
          }
        })
      )

      setLicenses(licensesWithUsers)
      setFilteredLicenses(licensesWithUsers)
    } catch (error: any) {
      console.error("Error fetching licenses:", error)
      toast({
        title: "Error",
        description: "Failed to load licenses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewLogs = async (license: LicenseWithUser) => {
    setViewingLicense(license)
    setIsLogsDialogOpen(true)

    try {
      // Fetch license logs (if table exists)
      const { data: logs } = await supabase
        .from("license_logs")
        .select("*")
        .eq("license_id", license.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (logs) {
        setLicenseLogs(logs as LicenseLog[])
      }

      // Fetch license validations
      const { data: validations } = await supabase
        .from("license_validations")
        .select("*")
        .eq("license_id", license.id)
        .order("validated_at", { ascending: false })
        .limit(50)

      if (validations) {
        setLicenseValidations(validations)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  const handleExtendLicense = (license: LicenseWithUser) => {
    setExtendingLicense(license)
    if (license.expires_at) {
      setNewExpirationDate(new Date(license.expires_at).toISOString().split('T')[0])
    } else {
      // Set default to 1 year from now
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      setNewExpirationDate(oneYearFromNow.toISOString().split('T')[0])
    }
    setIsExtendDialogOpen(true)
  }

  const handleSaveExtension = async () => {
    if (!extendingLicense || !newExpirationDate) return

    try {
      const { error } = await supabase
        .from("licenses")
        .update({
          expires_at: newExpirationDate,
          updated_at: new Date().toISOString()
        })
        .eq("id", extendingLicense.id)

      if (error) throw error

      // Sync to Cloudflare after extending
      if (extendingLicense.ea_product_id) {
        try {
          // Get product code from product
          const { data: product } = await supabase
            .from("products")
            .select("product_code, max_mt5_accounts")
            .eq("id", extendingLicense.ea_product_id)
            .single()

          if (product?.product_code) {
            const days = Math.ceil((new Date(newExpirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            await syncLicenseToCloudflare({
              product_id: product.product_code,
              days: days,
              max_accounts: product.max_mt5_accounts || 1,
            })
          }
        } catch (syncError: any) {
          console.error('Error syncing to Cloudflare:', syncError)
          // Don't fail the extension if sync fails
        }
      }

      toast({
        title: "Success",
        description: "License expiration extended successfully",
      })

      setIsExtendDialogOpen(false)
      fetchLicenses()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to extend license",
        variant: "destructive",
      })
    }
  }

  const handleSyncToCloudflare = async (license: LicenseWithUser) => {
    if (!license.ea_product_id) {
      toast({
        title: "Error",
        description: "License does not have a product ID",
        variant: "destructive",
      })
      return
    }

    setSyncingLicense(license.id)

    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("product_code, max_mt5_accounts")
        .eq("id", license.ea_product_id)
        .single()

      if (productError || !product) {
        // Try ea_products as fallback
        const { data: eaProduct } = await supabase
          .from("ea_products")
          .select("product_code, max_mt5_accounts")
          .eq("id", license.ea_product_id)
          .single()

        if (!eaProduct || !eaProduct.product_code) {
          throw new Error("Product not found or missing product code")
        }

        const days = license.expires_at 
          ? Math.ceil((new Date(license.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 365

        const result = await syncLicenseToCloudflare({
          product_id: eaProduct.product_code,
          days: days,
          max_accounts: eaProduct.max_mt5_accounts || 1,
        })

        if (result.success) {
          toast({
            title: "Success",
            description: "License synced to Cloudflare successfully",
          })
        } else {
          throw new Error(result.error || "Failed to sync license")
        }
      } else {
        const days = license.expires_at 
          ? Math.ceil((new Date(license.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 365

        const result = await syncLicenseToCloudflare({
          product_id: product.product_code,
          days: days,
          max_accounts: product.max_mt5_accounts || 1,
        })

        if (result.success) {
          toast({
            title: "Success",
            description: "License synced to Cloudflare successfully",
          })
        } else {
          throw new Error(result.error || "Failed to sync license")
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sync license to Cloudflare",
        variant: "destructive",
      })
    } finally {
      setSyncingLicense(null)
    }
  }

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
          <h1 className="text-3xl font-bold">License Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all EA licenses
          </p>
        </div>
        <Button onClick={fetchLicenses} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search licenses by key, product, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Key</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell className="font-mono text-xs">
                      {license.license_key.substring(0, 20)}...
                    </TableCell>
                    <TableCell>{license.ea_product_name || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{license.user_name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{license.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          license.status === "active"
                            ? "default"
                            : license.status === "expired"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {license.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {license.expires_at ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(license.expires_at).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLogs(license)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Logs
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExtendLicense(license)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Extend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncToCloudflare(license)}
                          disabled={syncingLicense === license.id}
                        >
                          <Cloud className={`h-4 w-4 mr-1 ${syncingLicense === license.id ? 'animate-spin' : ''}`} />
                          Sync
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLicenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No licenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Logs Dialog */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>License Usage Logs</DialogTitle>
            <DialogDescription>
              {viewingLicense?.license_key} - {viewingLicense?.ea_product_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Validation Logs */}
            <div>
              <h3 className="font-semibold mb-2">Validation Logs</h3>
              {licenseValidations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>MT5 Account</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseValidations.map((validation) => (
                      <TableRow key={validation.id}>
                        <TableCell>{new Date(validation.validated_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={validation.validation_result === "valid" ? "default" : "destructive"}>
                            {validation.validation_result}
                          </Badge>
                        </TableCell>
                        <TableCell>{validation.ip_address || "N/A"}</TableCell>
                        <TableCell>{validation.mt5_account_number || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No validation logs found</p>
              )}
            </div>

            {/* Activity Logs */}
            <div>
              <h3 className="font-semibold mb-2">Activity Logs</h3>
              {licenseLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-xs">
                          {log.details ? JSON.stringify(log.details) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No activity logs found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extend License Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend License Expiration</DialogTitle>
            <DialogDescription>
              {extendingLicense?.license_key} - {extendingLicense?.ea_product_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Expiration Date</Label>
              <Input
                type="date"
                value={newExpirationDate}
                onChange={(e) => setNewExpirationDate(e.target.value)}
              />
            </div>
            {extendingLicense?.expires_at && (
              <p className="text-sm text-muted-foreground">
                Current expiration: {new Date(extendingLicense.expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExtension}>Extend License</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


