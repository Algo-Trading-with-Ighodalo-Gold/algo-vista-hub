import { useState } from "react"
import { Link } from "react-router-dom"
import { Check, X, ArrowRight, Crown, Shield, Users, Download, Clock, Headphones } from "lucide-react"
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
    yearlyPrice: 150,
    lifetimePrice: 299
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
    yearlyPrice: 300,
    lifetimePrice: 599
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
    yearlyPrice: 750,
    lifetimePrice: 1499
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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly')

  const getPrice = (plan: typeof plans[0]) => {
    switch(billingPeriod) {
      case 'monthly': return plan.monthlyPrice
      case 'yearly': return plan.yearlyPrice  
      case 'lifetime': return plan.lifetimePrice
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

      {/* Pricing Toggle */}
      <section id="pricing-section" className="py-12">
        <div className="container">
          <div className="flex justify-center mb-12 animate-fade-in">
            <div className="flex items-center space-x-4 bg-muted p-2 rounded-lg">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={billingPeriod !== 'monthly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              <Badge variant="secondary" className="ml-2 bg-success/10 text-success">
                Save 17%
              </Badge>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => setBillingPeriod('lifetime')}
                className={`text-sm px-3 py-1 rounded ${
                  billingPeriod === 'lifetime' 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Lifetime
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards] ${
                  plan.popular ? 'border-primary shadow-xl scale-105' : ''
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {plan.popular && (
                  <Badge className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    plan.popular ? 'bg-primary' : 'bg-gradient-primary'
                  }`}>
                    <plan.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">${getPrice(plan)}</span>
                      <span className="text-muted-foreground ml-1">
                        {billingPeriod === 'lifetime' ? ' once' : billingPeriod === 'yearly' ? '/year' : '/month'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && getSavings(plan) > 0 && (
                      <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                        Save {getSavings(plan)}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limits.map((limit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    size="lg" 
                    className={`w-full hover-scale ${
                      plan.popular ? '' : 'variant-outline'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Choose {plan.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
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