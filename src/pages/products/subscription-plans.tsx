import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check, Crown, Shield, Users, Star, ArrowRight, Bitcoin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CandlestickBackground } from "@/components/ui/candlestick-background"

// Import EA images
import scalperProImage from "@/assets/scalper-pro-ea.jpg"
import swingMasterImage from "@/assets/swing-master-ea.jpg"
import gridTraderImage from "@/assets/grid-trader-ea.jpg"
import trendRiderImage from "@/assets/trend-rider-ea.jpg"
import goldRushImage from "@/assets/gold-rush-ea.jpg"
import nightOwlImage from "@/assets/night-owl-ea.jpg"
import cryptoPulseImage from "@/assets/crypto-pulse-ea.jpg"

const expertAdvisors = [
  {
    id: "scalper-pro-ea",
    name: "Scalper Pro EA",
    image: scalperProImage,
  },
  {
    id: "swing-master-ea",
    name: "Swing Master EA",
    image: swingMasterImage,
  },
  {
    id: "grid-trader-ea",
    name: "Grid Trader EA",
    image: gridTraderImage,
  },
  {
    id: "trend-rider-ea",
    name: "Trend Rider EA",
    image: trendRiderImage,
  },
  {
    id: "gold-rush-ea",
    name: "Gold Rush EA",
    image: goldRushImage,
  },
  {
    id: "night-owl-ea",
    name: "Night Owl EA",
    image: nightOwlImage,
  },
  {
    id: "crypto-pulse-ea",
    name: "Crypto Pulse EA",
    image: cryptoPulseImage,
  }
]

const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for individual traders starting out",
    icon: Users,
    popular: false,
    features: [
      "Up to 3 MT5 Accounts",
      "Full EA Access & Updates",
      "Email Support",
      "Installation Guide",
      "Basic Risk Management Tools",
      "Monthly Performance Reports"
    ],
    monthlyPrice: 29,
    yearlyPrice: 290
  },
  {
    id: "pro",
    name: "Pro", 
    description: "Most popular for serious traders",
    icon: Crown,
    popular: true,
    features: [
      "Up to 5 MT5 Accounts",
      "Full EA Access & Updates",
      "Priority Email & Chat Support",
      "Advanced Analytics Dashboard", 
      "Backtesting Reports",
      "Custom Risk Settings",
      "Weekly Strategy Updates",
      "VPS Setup Guide"
    ],
    monthlyPrice: 49,
    yearlyPrice: 490
  },
  {
    id: "elite",
    name: "Elite",
    description: "For professional traders and institutions",
    icon: Shield,
    popular: false,
    features: [
      "Up to 10 MT5 Accounts",
      "Full EA Access & Beta Releases",
      "24/7 Priority Support",
      "Personal Account Manager",
      "Advanced Portfolio Management",
      "Custom Parameter Optimization",
      "Dedicated Telegram Group",
      "Monthly Strategy Calls"
    ],
    monthlyPrice: 99,
    yearlyPrice: 990
  }
]

const paymentMethods = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express"
  },
  {
    id: "confirmo",
    name: "Cryptocurrency",
    icon: Bitcoin,
    description: "Bitcoin, Ethereum, USDT and 50+ other cryptocurrencies"
  }
]

export default function SubscriptionPlansPage() {
  const { eaId } = useParams()
  const navigate = useNavigate()
  const [ea, setEa] = useState<typeof expertAdvisors[0] | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'quaterly' | 'yearly'>('yearly')
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  useEffect(() => {
    const foundEa = expertAdvisors.find(advisor => advisor.id === eaId)
    if (foundEa) {
      setEa(foundEa)
    } else {
      navigate('/products')
    }
    window.scrollTo(0, 0)
  }, [eaId, navigate])

  if (!ea) {
    return null
  }

  const getPrice = (plan: typeof plans[0]) => {
    switch(billingPeriod) {
      case 'monthly': return plan.monthlyPrice
      case 'yearly': return plan.yearlyPrice  
      default: return plan.yearlyPrice
    }
  }

  const getSavings = (plan: typeof plans[0]) => {
    if (billingPeriod === 'yearly') {
      const yearlySavings = (plan.monthlyPrice * 12) - plan.yearlyPrice
      return Math.round((yearlySavings / (plan.monthlyPrice * 12)) * 100)
    }
    return 0
  }

  const handlePlanSelection = () => {
    const plan = plans.find(p => p.id === selectedPlan)
    if (plan) {
      const planData = {
        eaId: ea.id,
        eaName: ea.name,
        planId: selectedPlan,
        planName: plan.name,
        billingPeriod: billingPeriod,
        price: getPrice(plan),
        features: plan.features,
        paymentMethod: paymentMethod
      }
      navigate('/payment', { state: planData })
    }
  }

  return (
    <div className="min-h-screen relative">
      <CandlestickBackground variant="products" intensity="low" />
      
      {/* Breadcrumb */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products/${ea.id}`} className="hover:text-accent transition-colors">{ea.name}</Link>
            <span>/</span>
            <span className="text-foreground">Subscription Plans</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-subtle border-b">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img 
                src={ea.image} 
                alt={ea.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <Badge variant="secondary" className="mb-2">
                  <Star className="h-3 w-3 mr-1" />
                  Choose Your Plan
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight">
                  {ea.name} Subscription
                </h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Select the perfect subscription plan for your {ea.name} trading strategy. 
              All plans include full access, regular updates, and dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12">
        <div className="container">
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 p-2 bg-muted rounded-xl">
              <span className={`px-4 py-2 font-medium transition-colors ${
                billingPeriod === 'monthly' ? 'text-accent' : 'text-muted-foreground'
              }`}>
                Monthly
              </span>
              <Switch
                checked={billingPeriod === 'yearly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 font-medium transition-colors ${
                  billingPeriod === 'yearly' ? 'text-accent' : 'text-muted-foreground'
                }`}>
                  Yearly
                </span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Save 17%
                </Badge>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-2 border-accent scale-105 shadow-xl' 
                  : plan.popular 
                    ? 'border-2 border-accent/50 scale-105 shadow-lg' 
                    : 'border hover:border-accent/50'
              }`}
              onClick={() => setSelectedPlan(plan.id)}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  {/* Icon */}
                  <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedPlan === plan.id || plan.popular
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <plan.icon className="w-8 h-8" />
                  </div>

                  {/* Plan Name & Description */}
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                {/* Pricing */}
                <div className="px-6 pb-6">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${getPrice(plan)}</span>
                      <span className="text-muted-foreground">
                        {billingPeriod === 'yearly' ? '/year' : '/month'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && getSavings(plan) > 0 && (
                      <p className="text-sm text-success mt-1">
                        Save {getSavings(plan)}% annually
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      What's Included
                    </h4>
                    
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Method Selection */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <method.icon className="h-5 w-5" />
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

                <Button 
                  size="lg" 
                  className="w-full mt-6 hover-scale"
                  onClick={handlePlanSelection}
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-subtle border-t">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Plans?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team is here to help you choose the right subscription for your trading needs.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/support">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}