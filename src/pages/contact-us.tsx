import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Phone,
  Send,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-6 animate-fade-in">
        <h1 className="text-display font-bold text-gradient">
          Contact Us
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Have questions about our algorithmic trading solutions? We're here to help. 
          Reach out to our expert team for personalized support.
        </p>
        <Badge variant="outline" className="text-caption">
          Average Response Time: 2 hours
        </Badge>
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div className="space-y-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Get in Touch
              </CardTitle>
              <CardDescription>
                Multiple ways to reach our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-caption font-medium">Email Support</p>
                  <p className="text-caption text-muted-foreground">support@algotrading.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-caption font-medium">Phone Support</p>
                  <p className="text-caption text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-caption font-medium">Business Hours</p>
                  <p className="text-caption text-muted-foreground">Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-caption font-medium">Location</p>
                  <p className="text-caption text-muted-foreground">New York, NY</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Types */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Support Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Technical Support', color: 'default' },
                { label: 'Account Issues', color: 'secondary' },
                { label: 'EA Configuration', color: 'outline' },
                { label: 'Billing Questions', color: 'default' },
                { label: 'General Inquiries', color: 'secondary' }
              ].map((item) => (
                <Badge key={item.label} variant={item.color as any} className="mr-2">
                  {item.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your question or issue in detail..."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full hover-scale" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
        <div className="text-center">
          <h2 className="text-hero font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-body text-muted-foreground">
            Quick answers to common questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: "How long does it take to set up an EA?",
              answer: "Most EAs can be set up within 15-30 minutes with our step-by-step guides."
            },
            {
              question: "Do you offer live trading support?",
              answer: "Yes, we provide 24/7 technical support for all active subscribers."
            },
            {
              question: "Can I test the EAs before purchasing?",
              answer: "We offer demo versions and detailed backtesting results for all our products."
            },
            {
              question: "What brokers are compatible?",
              answer: "Our EAs work with most MT4/MT5 brokers. Contact us for specific compatibility."
            }
          ].map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-heading flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-caption text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}