import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Check, X, ArrowRight, Crown, Shield, Users, Download, Clock, Headphones, Star, Zap, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individual traders getting started",
    icon: Users,
    popular: false,
    features: [
      "1 MT5 Account License",
      "Access to 3 Basic EAs",
      "Email Support",
      "Installation Guide",
      "30-Day Money Back Guarantee",
      "Basic Risk Management Tools"
    ],
    limits: [
      "Limited to 1 trading account",
      "No premium EAs access",
      "Email support only"
    ],
    monthlyPrice: 15,
    yearlyPrice: 150
  },
  {
    id: "pro",
    name: "Pro", 
    description: "Most popular for serious traders",
    icon: Crown,
    popular: true,
    features: [
      "3 MT5 Account Licenses",
      "Access to ALL Premium EAs",
      "Priority Email & Chat Support",
      "Advanced Analytics Dashboard", 
      "Backtesting Reports",
      "Custom Risk Settings",
      "Monthly Strategy Updates",
      "VPS Setup Guide"
    ],
    limits: [
      "Limited to 3 trading accounts"
    ],
    monthlyPrice: 30,
    yearlyPrice: 300
  },
  {
    id: "elite",
    name: "Elite",
    description: "For professional traders and institutions",
    icon: Shield,
    popular: false,
    features: [
      "Unlimited MT5 Accounts",
      "Access to ALL EAs + Beta Releases",
      "24/7 Priority Support",
      "Personal Account Manager",
      "Custom EA Development (1 per year)",
      "Advanced Portfolio Management",
      "White-label Solutions",
      "API Access",
      "Dedicated Telegram Group"
    ],
    limits: [],
    monthlyPrice: 75,
    yearlyPrice: 750
  }
]

const comparisonFeatures = [
  {
    category: "Licenses & Access",
    features: [
      { name: "MT5 Account Licenses", starter: "1", pro: "3", elite: "Unlimited" },
      { name: "Premium EA Access", starter: "Basic Only", pro: "All EAs", elite: "All + Beta" },
      { name: "Simultaneous Installations", starter: "1", pro: "3", elite: "Unlimited" }
    ]
  },
  {
    category: "Support & Updates",
    features: [
      { name: "Support Channel", starter: "Email", pro: "Email + Chat", elite: "24/7 Priority" },
      { name: "Response Time", starter: "48 hours", pro: "24 hours", elite: "4 hours" },
      { name: "Strategy Updates", starter: "Quarterly", pro: "Monthly", elite: "Weekly" }
    ]
  },
  {
    category: "Advanced Features", 
    features: [
      { name: "Custom EA Development", starter: false, pro: false, elite: "1 per year" },
      { name: "Portfolio Management", starter: false, pro: "Basic", elite: "Advanced" },
      { name: "API Access", starter: false, pro: false, elite: true },
      { name: "White-label Rights", starter: false, pro: false, elite: true }
    ]
  }
]

const faqs = [
  {
    question: "What happens when my subscription expires?",
    answer: "When your subscription expires, your EAs will stop working and you'll lose access to updates and support. However, you can reactivate anytime and your previous settings will be restored."
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. Any unused credits are prorated."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied within 30 days of purchase, contact support for a full refund."
  },
  {
    question: "What's the difference between monthly and lifetime pricing?",
    answer: "Monthly/yearly plans provide ongoing access as long as you maintain your subscription. Lifetime plans provide permanent access to the EAs purchased, but exclude future new EA releases."
  },
  {
    question: "Can I transfer my license to a different MT5 account?",
    answer: "Yes, you can transfer licenses between MT5 accounts through your dashboard. Pro and Elite plans allow multiple transfers per month, while Starter allows one transfer per month."
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const navigate = useNavigate()

  const handlePlanSelection = (planId: string, period: string) => {
    const selectedPlan = plans.find(plan => plan.id === planId)
    if (selectedPlan) {
      const planData = {
        planId: planId,
        planName: selectedPlan.name,
        billingPeriod: period,
        price: period === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice,
        features: selectedPlan.features
      }
      navigate('/payment', { state: planData })
    }
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              💎 Choose Your Trading Plan
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Pricing That{" "}
              <span className="text-gradient">Scales With You</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              From individual traders to professional institutions, we have the perfect plan 
              for your algorithmic trading needs. All plans include our proven EAs and dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Billing Toggle Section */}
      <section id="pricing-section" className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          {/* Enhanced billing toggle with better design */}
          <div className="flex justify-center mb-16 animate-fade-in">
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-50"></div>
              
              <div className="relative flex items-center space-x-6 bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-xl">
                <span className={`text-lg font-semibold transition-all duration-300 ${
                  billingPeriod === 'monthly' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                  Monthly Billing
                </span>
                
                {/* Enhanced Switch Design */}
                <div className="relative">
                  <Switch
                    checked={billingPeriod !== 'monthly'}
                    onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary/80 scale-125"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-semibold transition-all duration-300 ${
                    billingPeriod === 'yearly' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    Yearly Billing
                  </span>
                  
                  <Badge className="bg-gradient-to-r from-success via-success/90 to-success/80 text-white px-4 py-2 text-sm font-bold shadow-lg border-0 animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Save 17%
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Pricing Cards with Better Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {plans.map((plan, index) => (
              <div key={plan.id} className="relative group animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                
                {/* Popular plan spotlight effect */}
                {plan.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/25 to-primary/50 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                )}
                
                <Card 
                  className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl border-2 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-card to-primary/5 border-primary/30 shadow-2xl transform scale-105 lg:scale-110' 
                      : 'bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-primary/40 hover:transform hover:scale-105'
                  }`}
                >
                  {/* Popular badge with enhanced positioning */}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-xl border-0 rounded-full">
                        <Star className="w-4 h-4 mr-2 fill-current animate-pulse" />
                        Most Popular Choice
                      </Badge>
                    </div>
                  )}
                  
                  {/* Plan Header Section */}
                  <CardHeader className="text-center pb-4 pt-12 relative bg-gradient-to-b from-transparent to-muted/10">
                    
                    {/* Plan Icon with Enhanced Design */}
                    <div className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl transition-all duration-500 group-hover:scale-110 ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-xl shadow-primary/25' 
                        : 'bg-gradient-to-br from-muted via-muted/80 to-muted/60 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-lg'
                    }`}>
                      <plan.icon className={`h-12 w-12 transition-all duration-300 ${
                        plan.popular ? 'text-primary-foreground drop-shadow-lg' : 'text-foreground group-hover:text-primary'
                      }`} />
                    </div>
                    
                    {/* Plan Title and Description */}
                    <div className="space-y-4">
                      <CardTitle className="text-4xl font-bold group-hover:text-primary transition-colors duration-300">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-lg leading-relaxed max-w-sm mx-auto px-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  {/* Pricing Section */}
                  <div className="px-8 pb-6">
                    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' 
                        : 'bg-gradient-to-br from-muted/30 to-muted/10 border-border/30 group-hover:border-primary/20'
                    }`}>
                      <div className="text-center space-y-3">
                        <div className="flex items-baseline justify-center">
                          <span className="text-6xl font-extrabold tracking-tight text-foreground">
                            ${getPrice(plan)}
                          </span>
                          <span className="text-xl text-muted-foreground ml-3 font-medium">
                            {billingPeriod === 'yearly' ? '/year' : '/month'}
                          </span>
                        </div>
                        
                        {billingPeriod === 'yearly' && getSavings(plan) > 0 && (
                          <div className="flex justify-center">
                            <Badge className="bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30 px-4 py-2">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Save {getSavings(plan)}% annually
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <CardContent className="px-8 pb-8 space-y-8">
                    
                    {/* Features List */}
                    <div className="space-y-5">
                      <h4 className="font-semibold text-lg text-center mb-6 text-muted-foreground uppercase tracking-wide">
                        What's Included
                      </h4>
                      
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 group/feature p-3 rounded-xl hover:bg-muted/30 transition-all duration-200">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </div>
                          </div>
                          <span className="text-base leading-relaxed group-hover/feature:text-foreground transition-colors font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                      
                      {plan.limits.length > 0 && (
                        <div className="pt-4 border-t border-border/50">
                          <h5 className="text-sm font-medium text-muted-foreground mb-3">Limitations:</h5>
                          {plan.limits.map((limit, i) => (
                            <div key={i} className="flex items-start gap-4 opacity-70 p-2">
                              <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{limit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* CTA Section */}
                    <div className="space-y-4 pt-6 border-t border-border/30">
                      <Button 
                        size="lg" 
                        className={`w-full h-16 text-lg font-bold transition-all duration-300 rounded-xl ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:to-primary/80 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-0' 
                            : 'border-2 border-primary/20 hover:border-primary/60 hover:bg-primary/10 hover:transform hover:-translate-y-1 hover:shadow-lg'
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handlePlanSelection(plan.id, billingPeriod)}
                      >
                        <div className="flex items-center justify-center gap-3">
                          {plan.popular ? 'Get Started Now' : `Choose ${plan.name} Plan`}
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </Button>
                      
                      {/* Trust indicators with better styling */}
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4 text-success" />
                          <span>30-day money-back guarantee</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          <span>Instant activation</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detailed breakdown of what's included in each plan
            </p>
          </div>

          <div className="max-w-6xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-6 font-medium">Features</th>
                        <th className="text-center p-6 font-medium">Starter</th>
                        <th className="text-center p-6 font-medium bg-primary/5">Pro</th>
                        <th className="text-center p-6 font-medium">Elite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((category) => (
                        <>
                          <tr key={category.category} className="border-b bg-muted/20">
                            <td colSpan={4} className="p-4 font-medium text-sm uppercase tracking-wide text-muted-foreground">
                              {category.category}
                            </td>
                          </tr>
                          {category.features.map((feature, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-4">{feature.name}</td>
                              <td className="p-4 text-center">
                                {typeof feature.starter === 'boolean' 
                                  ? (feature.starter ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />)
                                  : feature.starter
                                }
                              </td>
                              <td className="p-4 text-center bg-primary/5">
                                {typeof feature.pro === 'boolean'
                                  ? (feature.pro ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />)
                                  : feature.pro
                                }
                              </td>
                              <td className="p-4 text-center">
                                {typeof feature.elite === 'boolean'
                                  ? (feature.elite ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />)
                                  : feature.elite
                                }
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Pricing FAQ
            </h2>
            <p className="text-lg text-muted-foreground">
              Common questions about our pricing and billing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders using our proven Expert Advisors. 
            Choose your plan and start automated trading today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 hover-scale"
              onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale"
              asChild
            >
              <Link to="/support">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}