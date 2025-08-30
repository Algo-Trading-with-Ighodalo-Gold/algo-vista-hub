import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CreditCard, Shield, Lock, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

// Mock order data - in real app this would come from routing/context
const orderData = {
  product: "EA TitanX",
  plan: "Pro Plan - 3 Accounts",
  price: 199,
  originalPrice: 299,
  savings: 100,
  billingPeriod: "lifetime",
  features: [
    "3 MT5 Account Licenses",
    "Lifetime Updates",
    "Priority Support",
    "Advanced Risk Management",
    "30-Day Money Back Guarantee"
  ]
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express"
  },
  {
    id: "paypal", 
    name: "PayPal",
    icon: "💰",
    description: "Pay with your PayPal account"
  }
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    agreeTerms: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

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

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Payment Successful!",
        description: "Redirecting to download page...",
      })
      // In real app, redirect to success page
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange('cardNumber', formatted)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8">
        {/* Back Link */}
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/products/ea-titanx" 
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
                    <span className="font-medium">{orderData.product}</span>
                    <Badge variant="secondary">AI-Powered</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {orderData.plan}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {orderData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="line-through text-muted-foreground">${orderData.originalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Discount</span>
                    <span className="text-success">-${orderData.savings}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${orderData.price}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    One-time payment • No recurring charges
                  </div>
                </div>

                <div className="mt-6 p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    30-Day Money Back Guarantee
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
                  Your payment information is encrypted and secure
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="your@email.com"
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

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {typeof method.icon === 'string' ? (
                                  <span className="text-xl">{method.icon}</span>
                                ) : (
                                  <method.icon className="h-5 w-5" />
                                )}
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.description}</div>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Payment Details */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Card Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            required
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              required
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              required
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nameOnCard">Name on Card *</Label>
                          <Input
                            id="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                            required
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    </div>
                  )}

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
                        Complete Order - ${orderData.price}
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
                  <span className="text-2xl">✅</span>
                  <span className="text-xs font-medium">Money Back Guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}