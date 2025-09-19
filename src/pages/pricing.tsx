import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Check, X, ArrowRight, Crown, Shield, Users, Star, Zap, CheckCircle } from "lucide-react"
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-subtle border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              💎 Choose Your Plan
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Simple, Transparent{" "}
              <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Choose the perfect plan for your algorithmic trading needs. 
              All plans include our proven EAs and dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-4 p-2 bg-muted rounded-xl">
              <span className={`px-4 py-2 font-medium transition-colors ${
                billingPeriod === 'monthly' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Monthly
              </span>
              <Switch
                checked={billingPeriod === 'yearly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 font-medium transition-colors ${
                  billingPeriod === 'yearly' ? 'text-primary' : 'text-muted-foreground'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-2 border-primary scale-105 shadow-xl' 
                  : 'border hover:border-primary/50'
              }`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  {/* Icon */}
                  <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground' 
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

                  {/* CTA Button */}
                  <Button 
                    className="w-full mb-6"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handlePlanSelection(plan.id, billingPeriod)}
                  >
                    {plan.popular ? 'Get Started' : `Choose ${plan.name}`}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Features */}
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      What's Included
                    </h4>
                    
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limits.length > 0 && (
                      <div className="pt-4 border-t">
                        <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                          Limitations
                        </h5>
                        {plan.limits.map((limit, i) => (
                          <div key={i} className="flex items-start gap-3 opacity-60">
                            <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{limit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-success" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>Instant activation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare All Features</h2>
            <p className="text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-lg border">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Features</th>
                  <th className="text-center p-4 font-medium">Starter</th>
                  <th className="text-center p-4 font-medium bg-primary/5">
                    Pro
                    <Badge variant="secondary" className="ml-2 text-xs">Popular</Badge>
                  </th>
                  <th className="text-center p-4 font-medium">Elite</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category) => (
                  <>
                    <tr key={category.category} className="border-b bg-muted/20">
                      <td colSpan={4} className="p-4 font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b last:border-b-0">
                        <td className="p-4">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.starter === 'boolean' 
                            ? feature.starter 
                              ? <Check className="w-5 h-5 text-success mx-auto" />
                              : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                            : feature.starter
                          }
                        </td>
                        <td className="p-4 text-center bg-primary/5">
                          {typeof feature.pro === 'boolean' 
                            ? feature.pro 
                              ? <Check className="w-5 h-5 text-success mx-auto" />
                              : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                            : feature.pro
                          }
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.elite === 'boolean' 
                            ? feature.elite 
                              ? <Check className="w-5 h-5 text-success mx-auto" />
                              : <X className="w-5 h-5 text-muted-foreground mx-auto" />
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
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Got questions? We have answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-subtle border-t">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of traders who trust our algorithmic trading solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handlePlanSelection('pro', billingPeriod)}>
              Start with Pro Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/support">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}