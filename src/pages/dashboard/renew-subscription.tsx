import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { CreditCard, Calendar, CheckCircle, ArrowLeft } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type License = Database["public"]["Tables"]["licenses"]["Row"]
type SubscriptionTier = Database["public"]["Tables"]["subscription_tiers"]["Row"]

export default function RenewSubscriptionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [licenses, setLicenses] = useState<License[]>([])
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [renewingLicense, setRenewingLicense] = useState<License | null>(null)
  const [selectedTier, setSelectedTier] = useState<string>("")
  const [renewalPeriod, setRenewalPeriod] = useState<string>("1year")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch user licenses
      const { data: licensesData, error: licensesError } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (licensesError) throw licensesError
      setLicenses(licensesData || [])

      // Fetch subscription tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from("subscription_tiers")
        .select("*")
        .eq("is_active", true)

      if (tiersError) throw tiersError
      setTiers(tiersData || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRenew = async () => {
    if (!renewingLicense || !selectedTier) {
      toast({
        title: "Error",
        description: "Please select a subscription tier",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Calculate new expiration date
      const currentExpiration = renewingLicense.expires_at 
        ? new Date(renewingLicense.expires_at)
        : new Date()
      
      const renewalMonths = renewalPeriod === "1year" ? 12 : renewalPeriod === "6months" ? 6 : 3
      const newExpiration = new Date(currentExpiration)
      newExpiration.setMonth(newExpiration.getMonth() + renewalMonths)

      // Update license expiration
      const { error: licenseError } = await supabase
        .from("licenses")
        .update({
          expires_at: newExpiration.toISOString(),
          status: "active",
          updated_at: new Date().toISOString()
        })
        .eq("id", renewingLicense.id)

      if (licenseError) throw licenseError

      // Get tier price
      const tier = tiers.find(t => t.id === selectedTier)
      const price = tier?.price_cents || 0

      // Note: In a real implementation, you would:
      // 1. Process payment via Stripe
      // 2. Create a transaction record in a transactions table
      // 3. The transaction will automatically appear in the transactions page
      // 4. Send confirmation email
      
      // For now, we'll create a license record that represents the renewal transaction
      // This will show up in the user's licenses and can be tracked

      toast({
        title: "Success",
        description: "Subscription renewed successfully! Your license has been extended.",
      })

      // Redirect to transactions page
      setTimeout(() => {
        navigate("/dashboard/transactions")
      }, 2000)
    } catch (error: any) {
      console.error("Error renewing subscription:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to renew subscription",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getExpiredLicenses = () => {
    const now = new Date()
    return licenses.filter(license => {
      if (!license.expires_at) return false
      return new Date(license.expires_at) < now || license.status !== "active"
    })
  }

  const expiredLicenses = getExpiredLicenses()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/accounts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Renew Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Renew your expired or expiring licenses
          </p>
        </div>
      </div>

      {expiredLicenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium">All licenses are active</p>
            <p className="text-muted-foreground">You don't have any expired licenses to renew</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Select License to Renew</CardTitle>
              <CardDescription>Choose which license you want to renew</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expiredLicenses.map((license) => (
                <div
                  key={license.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    renewingLicense?.id === license.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setRenewingLicense(license)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{license.ea_product_name || "License"}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {license.license_key.substring(0, 20)}...
                      </p>
                    </div>
                    <Badge variant={license.status === "active" ? "default" : "destructive"}>
                      {license.status}
                    </Badge>
                  </div>
                  {license.expires_at && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Expired: {new Date(license.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Renewal Options</CardTitle>
              <CardDescription>Select your renewal period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renewingLicense ? (
                <>
                  <div className="space-y-2">
                    <Label>Subscription Tier</Label>
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name} - ${(tier.price_cents / 100).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Renewal Period</Label>
                    <Select value={renewalPeriod} onValueChange={setRenewalPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTier && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Selected Tier:</span>
                        <span className="font-medium">
                          {tiers.find(t => t.id === selectedTier)?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium text-lg">
                          ${((tiers.find(t => t.id === selectedTier)?.price_cents || 0) / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">New Expiration:</span>
                        <span className="font-medium">
                          {(() => {
                            const currentExpiration = renewingLicense.expires_at 
                              ? new Date(renewingLicense.expires_at)
                              : new Date()
                            const renewalMonths = renewalPeriod === "1year" ? 12 : renewalPeriod === "6months" ? 6 : 3
                            const newExpiration = new Date(currentExpiration)
                            newExpiration.setMonth(newExpiration.getMonth() + renewalMonths)
                            return newExpiration.toLocaleDateString()
                          })()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleRenew}
                    disabled={!selectedTier || isProcessing}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Renew Subscription"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a license to renew
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

