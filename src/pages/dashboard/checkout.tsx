import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { ArrowLeft, Shield, Lock, Check, CreditCard, Tag, X } from "lucide-react"
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
import { paymentAPI } from "@/lib/api/payments"

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Get product data from navigation state
  const productData = location.state || {}
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    country: "",
    agreeTerms: false
  })
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

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth/login', { 
        state: { from: location, redirectTo: '/dashboard/checkout' },
        replace: true 
      })
      return
    }

    // Load product data
    const loadProduct = async () => {
      if (productData.productId || productData.productCode) {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .or(`id.eq.${productData.productId || ''},product_code.eq.${productData.productCode || ''}`)
            .single()

          if (error || !data) {
            // Fallback to ea_products
            const { data: eaData } = await supabase
              .from("ea_products")
              .select("*")
              .eq("product_code", productData.productCode || productData.productId)
              .single()
            
            if (eaData) {
              setProduct(eaData)
            } else {
              toast({
                title: "Error",
                description: "Product not found",
                variant: "destructive"
              })
              navigate("/products")
            }
          } else {
            setProduct(data)
          }
        } catch (error) {
          console.error("Error loading product:", error)
          navigate("/products")
        }
      } else {
        toast({
          title: "Error",
          description: "No product selected",
          variant: "destructive"
        })
        navigate("/products")
      }
      setLoading(false)
    }

    loadProduct()
  }, [user, navigate, location, productData, toast])

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const priceNum = (product.price_cents || 0) / 100
  const price = priceNum.toFixed(2)
  const features = product.key_features || []

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
      const { data: campaigns, error } = await supabase
        .from("discount_campaigns")
        .select("id, name, discount_type, discount_value, promo_code, product_ids")
        .eq("promo_code", code)
        .limit(1)

      if (error) throw error
      const campaign = campaigns?.[0] as { id: string; name: string; discount_type: string; discount_value: number; promo_code: string | null; product_ids: string[] | null } | undefined
      if (!campaign) {
        setPromoError("Invalid or expired promo code")
        setAppliedCampaign(null)
        return
      }
      const productIds = campaign.product_ids
      const productId = product?.id ?? product?.product_code
      if (Array.isArray(productIds) && productIds.length > 0 && productId != null) {
        const allowed = productIds.some((id: string) => String(id) === String(productId))
        if (!allowed) {
          setPromoError("This code doesn't apply to this product")
          setAppliedCampaign(null)
          return
        }
      }
      setAppliedCampaign({
        id: campaign.id,
        name: campaign.name,
        discount_type: campaign.discount_type as "percentage" | "fixed_amount",
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

  const discountAmount = appliedCampaign
    ? appliedCampaign.discount_type === "percentage"
      ? priceNum * (appliedCampaign.discount_value / 100)
      : Math.min(priceNum, appliedCampaign.discount_value)
    : 0
  const finalPrice = Math.max(0, priceNum - discountAmount)
  const finalPriceStr = finalPrice.toFixed(2)

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
      const email = user.email || formData.email
      
      if (!email) {
        throw new Error('Email is required for payment')
      }

      const payment = await paymentAPI.createPolarCheckout(
        finalPrice,
        email,
        'USD',
        {
          productId: product.id,
          productCode: product.product_code,
          productName: product.name,
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          ...(appliedCampaign && {
            discount_campaign_id: appliedCampaign.id,
            promo_code: appliedCampaign.promo_code ?? undefined,
          }),
        }
      )

      // Redirect to Polar hosted checkout page
      if (payment?.checkoutUrl) {
        window.location.assign(payment.checkoutUrl)
        return
      }
      throw new Error('Payment link was not received. Please try again.')
    } catch (error: any) {
      setIsProcessing(false)
      const message = error?.message || "Failed to initialize payment. Please try again."
      toast({
        title: "Payment failed",
        description: message,
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
            to={`/products/${product.product_code}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="lg:col-span-1 animate-fade-in">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="secondary">EA License</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-success" />
                      <span>Full License Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-success" />
                      <span>Regular Updates</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Promo code */}
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

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {appliedCampaign && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount ({appliedCampaign.promo_code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${Number(finalPriceStr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    One-time payment • No recurring charges
                  </div>
                </div>

                <div className="mt-6 p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Secure Payment
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Secure checkout supports cards and wallets by region
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Secure Checkout
                </CardTitle>
                <CardDescription>
                  Complete your purchase
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
                        License key will be sent to this email
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
                        <SelectContent>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="gh">Ghana</SelectItem>
                          <SelectItem value="ke">Kenya</SelectItem>
                          <SelectItem value="za">South Africa</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Secure Payment</div>
                        <div className="text-sm text-muted-foreground">
                          You will be redirected to our secure payment page to complete your transaction.
                          Cards and supported wallets are available based on your region.
                        </div>
                      </div>
                    </div>
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
                        Processing Payment...
                      </div>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay ${Number(finalPriceStr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          </div>
        </div>
      </div>
    </div>
  )
}
