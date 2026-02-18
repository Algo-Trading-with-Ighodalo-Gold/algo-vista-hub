import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Shield, Lock, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/integrations/supabase/client"

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Get plan data from navigation state with proper defaults
  const planData = {
    eaId: "",
    eaPlanId: "",
    eaName: "Expert Advisor",
    planName: "Pro Plan",
    billingPeriod: "monthly",
    maxAccounts: 3,
    price: 0,
    features: [],
    ...location.state
  }

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    agreeTerms: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCodeInput, setPromoCodeInput] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [appliedCampaign, setAppliedCampaign] = useState<{
    id: string
    name: string
    discount_type: "percentage" | "fixed_amount"
    discount_value: number
    promo_code: string | null
  } | null>(null)

  const billingLabel =
    planData.billingPeriod === "yearly"
      ? "Annual"
      : planData.billingPeriod === "quarterly"
        ? "Quarterly"
        : "Monthly"

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth/login', { 
        state: { from: location },
        replace: true 
      })
      return
    }

    if (!location.state) {
      navigate("/products", { replace: true })
    }
  }, [user, navigate, location])
  
  // Don't render if not authenticated
  if (!user) {
    return null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const applyPromo = async () => {
    const code = promoCodeInput.trim().toUpperCase()
    if (!code) {
      setPromoError("Enter a promo code")
      return
    }
    setPromoError("")
    setPromoLoading(true)
    try {
      const nowIso = new Date().toISOString()
      const { data: campaigns, error } = await supabase
        .from("discount_campaigns")
        .select("id, name, discount_type, discount_value, promo_code, product_ids, is_active, starts_at, ends_at, max_redemptions, redemption_count")
        .eq("promo_code", code)
        .eq("is_active", true)
        .lte("starts_at", nowIso)
        .gte("ends_at", nowIso)
        .limit(1)

      if (error) throw error
      const campaign = campaigns?.[0] as {
        id: string
        name: string
        discount_type: "percentage" | "fixed_amount"
        discount_value: number
        promo_code: string | null
        product_ids: string[] | null
        max_redemptions: number | null
        redemption_count: number
      } | undefined
      if (!campaign) {
        setPromoError("Invalid, inactive, or expired promo code")
        setAppliedCampaign(null)
        return
      }
      if (campaign.max_redemptions != null && Number(campaign.redemption_count || 0) >= Number(campaign.max_redemptions)) {
        setPromoError("Promo code redemption limit reached")
        setAppliedCampaign(null)
        return
      }
      const productId = planData.eaId
      if (Array.isArray(campaign.product_ids) && campaign.product_ids.length > 0 && productId) {
        const allowed = campaign.product_ids.some((id) => String(id) === String(productId))
        if (!allowed) {
          setPromoError("This code doesn't apply to this product")
          setAppliedCampaign(null)
          return
        }
      }
      setAppliedCampaign({
        id: campaign.id,
        name: campaign.name,
        discount_type: campaign.discount_type,
        discount_value: Number(campaign.discount_value),
        promo_code: campaign.promo_code,
      })
    } catch (e: any) {
      setPromoError(e.message || "Could not validate promo code")
      setAppliedCampaign(null)
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromo = () => {
    setAppliedCampaign(null)
    setPromoCodeInput("")
    setPromoError("")
  }

  const basePrice = Number(planData.price || 0)
  const discountAmount = appliedCampaign
    ? appliedCampaign.discount_type === "percentage"
      ? basePrice * (appliedCampaign.discount_value / 100)
      : Math.min(basePrice, appliedCampaign.discount_value)
    : 0
  const finalPrice = Math.max(0, basePrice - discountAmount)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms and Conditions to proceed.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Initialize checkout (Paystack primary, Polar fallback-ready)
      const { paymentAPI } = await import('@/lib/api/payments')
      
      // Use user email if available, otherwise form email
      const email = user.email || formData.email
      
      if (!email) {
        throw new Error('Email is required for payment')
      }
      const metadata = {
        eaId: planData.eaId,
        ea_plan_id: planData.eaPlanId,
        eaName: planData.eaName,
        planName: planData.planName,
        billingPeriod: planData.billingPeriod,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        userId: user.id,
        ...(appliedCampaign && {
          discount_campaign_id: appliedCampaign.id,
          promo_code: appliedCampaign.promo_code ?? undefined,
        }),
      }

      const payment = planData.eaPlanId && !appliedCampaign
        ? await paymentAPI.createCheckout("paystack", {
            eaPlanId: planData.eaPlanId,
            allowDiscountCodes: true,
            metadata,
          })
        : await paymentAPI.createCheckout("paystack", {
            amount: finalPrice,
            email,
            currency: "USD",
            metadata,
          })

      // Redirect to hosted checkout page
      if (payment?.checkoutUrl) {
        window.location.assign(payment.checkoutUrl)
        return
      }
      if (!payment?.checkoutUrl) {
        throw new Error('Payment initialization failed')
      }
    } catch (error: any) {
      setIsProcessing(false)
      toast({
        title: "Payment failed",
        description: error?.message || "Failed to initialize payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8">
        {/* Back Link */}
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/products" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Subscription Summary */}
          <div className="lg:col-span-1 animate-fade-in">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Subscription Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{planData.eaName}</span>
                    <Badge variant="secondary">AI-Powered</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {planData.planName} Plan - {billingLabel} Subscription
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Up to {planData.maxAccounts} MT5 account{planData.maxAccounts > 1 ? "s" : ""}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {planData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-success" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label className="text-sm">Promo code</Label>
                    {appliedCampaign ? (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-success/10 text-success text-sm">
                        <span className="font-medium">{appliedCampaign.promo_code} applied</span>
                        <Button type="button" variant="ghost" size="sm" onClick={removePromo} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. LAUNCH20"
                          value={promoCodeInput}
                          onChange={(e) => { setPromoCodeInput(e.target.value); setPromoError("") }}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                          className="uppercase"
                        />
                        <Button type="button" variant="outline" onClick={applyPromo} disabled={promoLoading}>
                          {promoLoading ? "..." : "Apply"}
                        </Button>
                      </div>
                    )}
                    {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                  </div>

                  <div className="space-y-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>{billingLabel} Subscription</span>
                    <span>${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {appliedCampaign && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount ({appliedCampaign.promo_code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Recurring {planData.billingPeriod} • Cancel anytime
                  </div>
                </div>

                <div className="mt-6 p-3 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-2 text-accent text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Secure & Encrypted
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Your subscription includes continuous updates and support
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Secure Payment
                </CardTitle>
                <CardDescription>
                  Start your subscription with secure payment processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contact Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || user?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="your@email.com"
                        disabled={!!user?.email}
                      />
                      <p className="text-xs text-muted-foreground">
                        Account access will be sent to this email
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="sg">Singapore</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to our secure checkout page to complete your transaction.
                      We accept cards and supported wallets based on your region.
                    </p>
                  </div>

                  <Separator />

                  {/* Terms & Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        {". "}I understand this is a recurring {planData.billingPeriod} subscription that can be cancelled at any time.
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full hover-scale" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing Subscription...
                      </div>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Start Subscription - ${planData.price}/{planData.billingPeriod === 'yearly' ? 'year' : planData.billingPeriod === 'quarterly' ? 'quarter' : 'month'}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Shield className="h-3 w-3" />
                      Secured by 256-bit SSL encryption
                    </div>
                    Your payment information is safe and will never be stored on our servers
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium">SSL Secured</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">💳</span>
                  <span className="text-xs font-medium">All Cards Accepted</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <span className="text-xs font-medium">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-medium">Cancel Anytime</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}