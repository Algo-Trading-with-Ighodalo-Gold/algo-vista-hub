import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth-context'

interface ProjectInquiry {
  id: string
  name: string
  email: string
  strategy: string
  instruments: string
  timeframes: string
  entry_logic: string
  exit_logic: string
  risk_management: string
  special_features: string
  budget: string
  timeline: string
  status: string
  created_at: string
  updated_at: string
}

export default function DashboardEADevelopmentPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendly, setShowCalendly] = useState(false)
  const [projectInquiries, setProjectInquiries] = useState<ProjectInquiry[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    strategy: "",
    instruments: "",
    timeframes: "",
    entryLogic: "",
    exitLogic: "",
    riskManagement: "",
    tradeManagement: "",
    specialFeatures: "",
    budget: "",
    timeline: "",
    ndaAgreed: false
  })

  const fetchProjectInquiries = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('project_inquiries')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjectInquiries(data || [])
    } catch (error) {
      console.error('Error fetching project inquiries:', error)
    }
  }

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
        trade_management: formData.tradeManagement,
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
        title: "Project Inquiry Submitted!",
        description: "We'll review your requirements and get back to you within 24 hours.",
      })
      
      setShowCalendly(true)
      
      setFormData({
        name: "",
        email: "",
        strategy: "",
        instruments: "",
        timeframes: "",
        entryLogic: "",
        exitLogic: "",
        riskManagement: "",
        tradeManagement: "",
        specialFeatures: "",
        budget: "",
        timeline: "",
        ndaAgreed: false
      })

      await fetchProjectInquiries()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'pending':
        return 'outline'
      default:
        return 'outline'
    }
  }

  useEffect(() => {
    fetchProjectInquiries()
  }, [user])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Custom Development
              </Badge>
              <Badge variant="outline">Expert Advisors</Badge>
              <Badge variant="outline">Trading Bots</Badge>
            </div>
            
            <h1 className="dashboard-section-title font-bold tracking-tight">
              Start Your EA Development Project
            </h1>
            
            <p className="dashboard-text text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your trading strategy into a profitable automated system. Our expert developers create custom EAs tailored to your specific requirements with proven results.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="dashboard-heading mb-2">Strategy Analysis</h3>
                  <p className="dashboard-text text-muted-foreground">We analyze your trading strategy and optimize it for automation</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="dashboard-heading mb-2">Fast Delivery</h3>
                  <p className="dashboard-text text-muted-foreground">Most projects completed within 1-4 weeks with regular updates</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="dashboard-heading mb-2">Full Support</h3>
                  <p className="dashboard-text text-muted-foreground">Ongoing support and updates to ensure optimal performance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {!showCalendly ? (
        <>
          <div className="text-center space-y-4 mb-8">
            <h2 className="dashboard-title font-bold tracking-tight">
              Ready to Build Your EA?
            </h2>
            <p className="dashboard-text text-muted-foreground max-w-2xl mx-auto">
              Tell us about your trading strategy and we'll provide a detailed quote within 24 hours
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
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
                  <Label htmlFor="tradeManagement">Trade Management</Label>
                  <Textarea
                    id="tradeManagement"
                    value={formData.tradeManagement}
                    onChange={(e) => handleInputChange('tradeManagement', e.target.value)}
                    placeholder="Position sizing, trailing stops, partial closes, breakeven management, etc."
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

          {projectInquiries.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Project Inquiries
                </CardTitle>
                <CardDescription>
                  Track the progress of your EA development requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(inquiry.status)}
                          <h4 className="font-medium">{inquiry.strategy.substring(0, 50)}...</h4>
                        </div>
                        <Badge variant={getStatusVariant(inquiry.status)}>
                          {inquiry.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <strong>Submitted:</strong> {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Budget:</strong> {inquiry.budget || 'Not specified'}
                        </div>
                        <div>
                          <strong>Timeline:</strong> {inquiry.timeline || 'Flexible'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Message Team</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center space-y-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4 text-success">
              🎉 Project Inquiry Submitted!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thank you for your detailed submission. We'll review your requirements and get back to you within 24 hours.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                📅 Book Your Free Consultation
              </CardTitle>
              <CardDescription>
                Schedule a 30-minute strategy session with our EA development experts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                During this consultation, we'll discuss your strategy in detail, answer any questions, 
                and provide you with a comprehensive development plan and timeline.
              </p>
              
              <div className="bg-gradient-primary/10 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">What we'll cover:</h3>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    Strategy analysis and optimization suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    Technical implementation approach
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    Timeline and project milestones
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    Final quote and next steps
                  </li>
                </ul>
              </div>
              
              <Button 
                size="lg" 
                className="text-lg px-8 hover-scale"
                onClick={() => window.open('https://calendly.com/algotradingwithighodalo/30min', '_blank')}
              >
                📅 Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Prefer email? We'll also send you a detailed response within 24 hours.
              </p>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            onClick={() => setShowCalendly(false)}
            className="mt-4"
          >
            Submit Another Request
          </Button>
        </div>
      )}
    </div>
  )
}