import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { ArrowLeft, Shield, Lock, Check, CreditCard } from "lucide-react"
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

  const price = ((product.price_cents || 0) / 100).toFixed(2)
  const features = product.key_features || []

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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

      const payment = await paymentAPI.createPaystackPayment(
        Number(price),
        email,
        'NGN',
        {
          productId: product.id,
          productCode: product.product_code,
          productName: product.name,
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
        }
      )

      // Redirect to Paystack payment page
      if (payment.authorization_url) {
        window.location.href = payment.authorization_url
      } else {
        throw new Error('Payment initialization failed')
      }
    } catch (error: any) {
      setIsProcessing(false)
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment. Please try again.",
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

                <div className="space-y-2">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₦{Number(price).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    One-time payment • No recurring charges
                  </div>
                </div>

                <div className="mt-6 p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    Secure Payment via Paystack
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Supports cards, bank transfer, USSD & mobile money
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
                  Complete your purchase with Paystack
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
                        <div className="font-medium">Paystack Payment</div>
                        <div className="text-sm text-muted-foreground">
                          You will be redirected to Paystack's secure payment page to complete your transaction.
                          Paystack supports multiple payment methods including cards, bank transfers, USSD, and mobile money.
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
                        Pay ₦{Number(price).toLocaleString()} with Paystack
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
