import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { EnhancedAffiliateTracking } from '@/components/dashboard/enhanced-affiliate-tracking'
import { AffiliateApplicationForm } from '@/components/dashboard/affiliate-application-form'
import { 
  Users,
  DollarSign,
  Share,
  Copy,
  TrendingUp,
  UserPlus,
  Gift,
  Target,
  Calendar,
  BarChart3,
  Star
} from 'lucide-react'

const commissionTiers = [
  {
    sales: "1-10",
    commission: "20%",
    description: "Great starting rate for new affiliates"
  },
  {
    sales: "11-25", 
    commission: "25%",
    description: "Increased rate for consistent performers"
  },
  {
    sales: "26-50",
    commission: "30%",
    description: "Premium rate for top affiliates"
  },
  {
    sales: "50+",
    commission: "35%",
    description: "Maximum rate for super affiliates"
  }
]

const benefits = [
  {
    icon: DollarSign,
    title: "High Commissions",
    description: "Earn 20-35% commission on all referred sales with performance-based increases",
    highlight: "Up to 35%"
  },
  {
    icon: Calendar,
    title: "Long Cookie Duration", 
    description: "60-day cookie lifetime ensures you get credit for delayed conversions",
    highlight: "60 Days"
  },
  {
    icon: TrendingUp,
    title: "Monthly Payouts",
    description: "Reliable monthly payments with $100 minimum payout threshold",
    highlight: "$100 Min"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Advanced dashboard with detailed conversion tracking and performance metrics",
    highlight: "Live Stats"
  }
]

const faqs = [
  {
    question: "How much can I earn as an affiliate?",
    answer: "Affiliates earn 20-35% commission on all sales. Top affiliates with 50+ monthly sales earn 35% commission, which can result in $3,000+ monthly earnings depending on sales volume and product mix."
  },
  {
    question: "When do I get paid?",
    answer: "Payments are made monthly on the 15th via PayPal, bank transfer, or cryptocurrency. Minimum payout is $100. If you don't reach the minimum, your earnings roll over to the next month."
  },
  {
    question: "What is the cookie duration?",
    answer: "We use a 60-day cookie, meaning if someone clicks your link and purchases within 60 days, you'll receive the commission. This is one of the longest cookie durations in the industry."
  },
  {
    question: "What promotional materials do you provide?",
    answer: "We provide banners, email templates, product images, video reviews, landing pages, and social media content. All materials are professionally designed and optimized for conversion."
  },
  {
    question: "Can I promote on social media and paid ads?",
    answer: "Yes! You can promote on social media, YouTube, blogs, email lists, and paid advertising. We only restrict trademark bidding and spam. Full promotional guidelines are provided upon approval."
  },
  {
    question: "How do I track my performance?",
    answer: "Your affiliate dashboard provides real-time statistics including clicks, conversions, earnings, and detailed analytics. You can track performance by traffic source, campaign, and time period."
  }
]

const testimonials = [
  {
    name: "James Mitchell",
    role: "YouTube Content Creator",
    earnings: "$4,200",
    content: "The conversion rates are incredible! My trading audience loves these EAs and the 35% commission rate makes it very worthwhile. Best affiliate program in the trading space.",
    period: "Last Month"
  },
  {
    name: "Lisa Chen",
    role: "Trading Blog Owner", 
    earnings: "$2,800",
    content: "Excellent support team and marketing materials. The 60-day cookie duration really makes a difference for my blog readers who take time to decide.",
    period: "Last Month"
  },
  {
    name: "Robert Taylor",
    role: "Email Marketer",
    earnings: "$3,500",
    content: "Consistent monthly payouts and great products that actually work. My subscribers trust my recommendations because these EAs deliver results.",
    period: "Last Month"
  }
]

export default function AffiliatePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { 
    affiliate, 
    profile, 
    loading,
    referralClicks 
  } = useDashboardData()

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const referralLink = profile?.affiliate_code 
    ? `https://algotradingwithighodalo.com/ref/${profile.affiliate_code}`
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Affiliate Program
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Earn commissions by referring new customers to our platform
        </p>
      </div>

      {/* Affiliate Status */}
      {affiliate ? (
        <>
          {/* Performance Overview */}
          <div className="grid gap-6 md:grid-cols-4 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${affiliate.commission_earned?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Referral Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {referralClicks?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total clicks</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {referralClicks?.length ? 
                    (((referralClicks.filter(click => click.converted).length) / referralClicks.length) * 100).toFixed(1)
                    : '0.0'
                  }%
                </div>
                <p className="text-xs text-muted-foreground">Click to sale</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payout Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={affiliate.payout_status === 'paid' ? 'default' : 'secondary'}>
                  {affiliate.payout_status || 'pending'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Current status</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          {referralLink && (
            <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5 text-primary" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>
                  Share this link to earn commission on all referral sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    value={referralLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={() => copyToClipboard(referralLink, 'Referral link')}
                    className="hover-scale"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="hover-scale">
                    <Share className="h-4 w-4 mr-2" />
                    Share on Social
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">
                    <Gift className="h-4 w-4 mr-2" />
                    Generate Banner
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Tracking */}
          <div className="animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            <EnhancedAffiliateTracking affiliate={affiliate} loading={loading} />
          </div>

          {/* Commission Structure */}
          <Card className="animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Commission Structure
              </CardTitle>
              <CardDescription>
                Performance-based commission tiers that reward consistent sales and growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {commissionTiers.map((tier, index) => (
                  <Card key={index} className={`text-center hover-scale relative ${index === 3 ? 'border-primary shadow-lg' : ''}`}>
                    {index === 3 && (
                      <Badge className="absolute top-2 right-2 bg-primary text-xs">
                        Best Rate
                      </Badge>
                    )}
                    <CardHeader className="pb-2">
                      <div className="text-2xl font-bold text-primary mb-2">{tier.commission}</div>
                      <CardTitle className="text-sm">{tier.sales} Sales/Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs">{tier.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">60 Days</h3>
                  <p className="text-sm text-muted-foreground">Cookie Duration</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Monthly</h3>
                  <p className="text-sm text-muted-foreground">Payout Schedule</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">$100</h3>
                  <p className="text-sm text-muted-foreground">Minimum Payout</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Benefits */}
          <Card className="animate-fade-in [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle>Program Benefits</CardTitle>
              <CardDescription>
                Why join our affiliate program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-lg font-bold text-primary">{benefit.highlight}</div>
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle>What Our Affiliates Say</CardTitle>
              <CardDescription>
                Success stories from our affiliate partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm">{testimonial.name}</CardTitle>
                          <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {testimonial.earnings}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
                      <p className="text-xs text-muted-foreground mt-2">{testimonial.period}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="animate-fade-in [animation-delay:0.7s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about our affiliate program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Application Form for Non-Affiliates */
        <div className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Join Our Affiliate Program
              </CardTitle>
              <CardDescription>
                Start earning commissions on every successful referral
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Benefits */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              <AffiliateApplicationForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}