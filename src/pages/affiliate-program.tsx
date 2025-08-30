import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Users, DollarSign, Calendar, TrendingUp, CheckCircle, Star, Copy, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

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

export default function AffiliateProgramPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    trafficSource: "",
    experience: "",
    paymentMethod: ""
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 24-48 hours.",
    })
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      website: "",
      trafficSource: "",
      experience: "",
      paymentMethod: ""
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              💰 High Converting Affiliate Program
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Earn by Referring{" "}
              <span className="text-gradient">Traders</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              Join our exclusive affiliate program and earn up to 35% commission promoting premium Expert Advisors 
              to the algorithmic trading community. High converting products with proven results.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <Button size="lg" className="text-lg px-8 hover-scale">
                Join Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 hover-scale">
                View Commission Rates
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                Up to 35% Commission
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                60-Day Cookie Duration
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                Monthly Payouts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Commission Structure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Performance-based commission tiers that reward consistent sales and growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier, index) => (
              <Card key={index} className={`relative overflow-hidden hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards] ${index === 3 ? 'border-primary shadow-lg' : ''}`} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                {index === 3 && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    Best Rate
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{tier.commission}</div>
                  <CardTitle className="text-lg">{tier.sales} Sales/Month</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{tier.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Join Our Program?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-leading benefits designed to maximize your earnings potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover-scale group animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{benefit.highlight}</div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 4-step process to start earning commissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Apply", description: "Submit your application with traffic source details" },
              { step: "02", title: "Get Approved", description: "Review process typically takes 24-48 hours" },
              { step: "03", title: "Promote", description: "Use your unique links and marketing materials" },
              { step: "04", title: "Get Paid", description: "Receive monthly payments for all conversions" }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Connection arrow for desktop */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-1/2 transform translate-x-8 w-16">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Join Our Affiliate Program
              </h2>
              <p className="text-lg text-muted-foreground">
                Start earning high commissions by promoting premium Expert Advisors
              </p>
            </div>

            <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CardHeader>
                <CardTitle>Affiliate Application</CardTitle>
                <CardDescription>
                  Tell us about your promotional methods and audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Social Media *</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      required
                      placeholder="https://yourwebsite.com or @yoursocial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trafficSource">Primary Traffic Source *</Label>
                    <Select value={formData.trafficSource} onValueChange={(value) => handleInputChange('trafficSource', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your main traffic source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog/Website</SelectItem>
                        <SelectItem value="youtube">YouTube Channel</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email Marketing</SelectItem>
                        <SelectItem value="paid">Paid Advertising</SelectItem>
                        <SelectItem value="forum">Forums/Communities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Affiliate Marketing Experience *</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="wire">Wire Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" size="lg" className="w-full hover-scale">
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Real earnings from our top-performing affiliates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Earned {testimonial.earnings}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{testimonial.period}</span>
                  </div>
                  <blockquote className="text-sm italic mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our affiliate program
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
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of affiliates already earning substantial commissions promoting our premium Expert Advisors. 
            Apply now and start earning within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale">
              View Marketing Materials
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}