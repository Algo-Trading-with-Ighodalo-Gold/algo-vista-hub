import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Upload, FileText, MessageSquare, Code, TestTube, Truck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const processSteps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Consultation",
    description: "We analyze your trading strategy and requirements in detail",
    duration: "1-2 days"
  },
  {
    icon: FileText,
    step: "02", 
    title: "Quote",
    description: "Receive detailed proposal with timeline and pricing",
    duration: "1 day"
  },
  {
    icon: Code,
    step: "03",
    title: "Development",
    description: "Professional coding with regular progress updates",
    duration: "5-15 days"
  },
  {
    icon: TestTube,
    step: "04",
    title: "Testing",
    description: "Comprehensive backtesting and optimization",
    duration: "2-5 days"
  },
  {
    icon: Truck,
    step: "05",
    title: "Delivery",
    description: "Final EA with documentation and license system",
    duration: "Same day"
  }
]

const features = [
  {
    title: "Professional Coding",
    description: "Clean, optimized MQL5 code following best practices and industry standards",
    icon: Code
  },
  {
    title: "Advanced Licensing",
    description: "Secure license system with account binding and hardware fingerprinting",
    icon: CheckCircle
  },
  {
    title: "Comprehensive Testing",
    description: "Extensive backtesting, optimization, and forward testing on multiple timeframes",
    icon: TestTube
  },
  {
    title: "Full Documentation",
    description: "Complete user manual, installation guide, and strategy explanation",
    icon: FileText
  }
]

const testimonials = [
  {
    name: "David Chen",
    role: "Hedge Fund Manager",
    content: "Outstanding work! They turned our complex strategy into a robust EA that's been running flawlessly for 8 months. Professional service from start to finish.",
    rating: 5,
    project: "Multi-Strategy Portfolio EA"
  },
  {
    name: "Sarah Williams",
    role: "Professional Trader",
    content: "Exceeded expectations in every way. The EA perfectly implements our scalping strategy with excellent risk management. Highly recommended!",
    rating: 5,
    project: "High-Frequency Scalping EA"
  },
  {
    name: "Michael Rodriguez",
    role: "Trading System Developer",
    content: "Impressed by their technical expertise and attention to detail. The licensing system is bulletproof and the code quality is exceptional.",
    rating: 5,
    project: "Custom Grid Trading System"
  }
]

export default function EADevelopmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    strategy: "",
    instruments: "",
    timeframes: "",
    entryLogic: "",
    exitLogic: "",
    riskManagement: "",
    specialFeatures: "",
    budget: "",
    timeline: "",
    ndaAgreed: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ndaAgreed) {
      toast({
        title: "NDA Agreement Required",
        description: "Please agree to the NDA terms to submit your inquiry.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase.from('project_inquiries').insert({
        name: formData.name,
        email: formData.email,
        strategy: formData.strategy,
        instruments: formData.instruments,
        timeframes: formData.timeframes,
        entry_logic: formData.entryLogic,
        exit_logic: formData.exitLogic,
        risk_management: formData.riskManagement,
        special_features: formData.specialFeatures,
        budget: formData.budget,
        timeline: formData.timeline,
        nda_agreed: formData.ndaAgreed
      })

      if (error) {
        console.error('Error submitting inquiry:', error)
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your inquiry. Please try again.",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Inquiry Submitted Successfully!",
        description: "We'll review your requirements and get back to you within 24 hours.",
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        strategy: "",
        instruments: "",
        timeframes: "",
        entryLogic: "",
        exitLogic: "",
        riskManagement: "",
        specialFeatures: "",
        budget: "",
        timeline: "",
        ndaAgreed: false
      })
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              🚀 Professional EA Development Service
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Turn Your Strategy into a{" "}
              <span className="text-gradient">Secure MT5 EA</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              Professional algorithmic trading development with advanced licensing, comprehensive testing, 
              and ongoing support. Transform your trading ideas into profitable automated systems.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <Button size="lg" className="text-lg px-8 hover-scale">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 hover-scale">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Professional Development Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to deployment, we follow a structured approach to ensure your EA meets the highest standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-2">Step {step.step}</Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{step.description}</CardDescription>
                  <Badge variant="secondary" className="text-xs">
                    {step.duration}
                  </Badge>
                </CardContent>
                
                {/* Connection line for desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-border z-10" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What You Get
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade development with enterprise features and ongoing support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Start Your EA Development Project
              </h2>
              <p className="text-lg text-muted-foreground">
                Tell us about your trading strategy and we'll provide a detailed quote within 24 hours
              </p>
            </div>

            <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CardHeader>
                <CardTitle>Project Inquiry Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us understand your requirements
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
                    <Label htmlFor="strategy">Strategy Description *</Label>
                    <Textarea
                      id="strategy"
                      value={formData.strategy}
                      onChange={(e) => handleInputChange('strategy', e.target.value)}
                      required
                      placeholder="Describe your trading strategy in detail..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="instruments">Instruments/Pairs</Label>
                      <Input
                        id="instruments"
                        value={formData.instruments}
                        onChange={(e) => handleInputChange('instruments', e.target.value)}
                        placeholder="EURUSD, GBPUSD, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeframes">Timeframes</Label>
                      <Input
                        id="timeframes"
                        value={formData.timeframes}
                        onChange={(e) => handleInputChange('timeframes', e.target.value)}
                        placeholder="M1, M5, H1, H4, D1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entryLogic">Entry Logic *</Label>
                    <Textarea
                      id="entryLogic"
                      value={formData.entryLogic}
                      onChange={(e) => handleInputChange('entryLogic', e.target.value)}
                      required
                      placeholder="Describe the entry conditions and signals..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exitLogic">Exit Logic *</Label>
                    <Textarea
                      id="exitLogic"
                      value={formData.exitLogic}
                      onChange={(e) => handleInputChange('exitLogic', e.target.value)}
                      required
                      placeholder="Describe the exit conditions, stop loss, and take profit..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskManagement">Risk Management</Label>
                    <Textarea
                      id="riskManagement"
                      value={formData.riskManagement}
                      onChange={(e) => handleInputChange('riskManagement', e.target.value)}
                      placeholder="Lot sizing, maximum positions, drawdown limits, etc."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialFeatures">Special Features</Label>
                    <Textarea
                      id="specialFeatures"
                      value={formData.specialFeatures}
                      onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                      placeholder="Any special requirements like news filters, time filters, etc."
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                          <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                          <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                          <SelectItem value="5000+">$5,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Required Timeline</Label>
                      <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-2months">1-2 months</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nda"
                        checked={formData.ndaAgreed}
                        onCheckedChange={(checked) => handleInputChange('ndaAgreed', checked as boolean)}
                      />
                      <Label htmlFor="nda" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I agree to sign an NDA to protect confidential strategy information
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Upload className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="text-sm text-muted-foreground">
                        <p>Additional files (charts, documents, etc.) can be shared after initial contact</p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full hover-scale" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Project Inquiry"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Trusted by professional traders and institutions worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="text-sm italic mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="space-y-1">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.project}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your EA?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Transform your trading strategy into a professional automated system. 
            Get started with a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale"
              onClick={() => window.open('https://calendly.com/algotradingwithighodalo/30min', '_blank')}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}