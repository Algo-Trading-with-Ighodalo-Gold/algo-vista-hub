import { useState } from "react"
import { Search, Mail, MessageSquare, Phone, Clock, CheckCircle, ArrowRight, FileText, Shield, Download, Users, Zap, ExternalLink, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import JSZip from "jszip"

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        question: "How do I activate my EA license?",
        answer: "After purchase, you'll receive a license key via email. Download the EA file, load it onto your MT5 platform, and enter the license key when prompted. The EA will automatically bind to your account number and hardware for security."
      },
      {
        question: "Which brokers are compatible with your EAs?",
        answer: "Our EAs work with all MT5 brokers. We recommend ECN brokers with low spreads for optimal performance. Popular compatible brokers include IC Markets, Pepperstone, FTMO, and most regulated brokers worldwide."
      },
      {
        question: "What are the minimum system requirements?",
        answer: "You need MetaTrader 5, Windows 7+ or VPS, minimum 1GB RAM, and stable internet connection. We recommend running EAs on a VPS for 24/7 operation and best performance."
      }
    ]
  },
  {
    title: "License Management", 
    questions: [
      {
        question: "Can I transfer my license to a different MT5 account?",
        answer: "Yes, you can transfer licenses through your dashboard. Starter plan allows 1 transfer per month, Pro allows 3 transfers, and Elite allows unlimited transfers. The process takes 5-10 minutes to complete."
      },
      {
        question: "What happens if I change my computer?",
        answer: "Licenses are bound to your MT5 account number, not your computer. You can install the EA on any computer as long as you use the same MT5 account number that was licensed."
      },
      {
        question: "How do I reset my MT5 binding?",
        answer: "Contact our support team with your license key and new MT5 account number. We'll reset the binding within 24 hours. Pro and Elite customers get priority processing."
      }
    ]
  },
  {
    title: "Subscriptions & Billing",
    questions: [
      {
        question: "What happens when my subscription expires?",
        answer: "When your subscription expires, the EAs will stop working and you'll lose access to updates and support. You can reactivate anytime to restore full functionality."
      },
      {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee on all purchases. If you're not satisfied, contact support within 30 days for a full refund. Custom development projects have different terms."
      },
      {
        question: "Can I upgrade or downgrade my plan?",
        answer: "Absolutely! You can change plans anytime through your dashboard. Upgrades take effect immediately, downgrades at your next billing cycle. Unused credits are prorated."
      }
    ]
  },
  {
    title: "Technical Issues",
    questions: [
      {
        question: "My EA is not placing trades. What should I check?",
        answer: "First, verify: 1) EA is enabled and has smiley face, 2) Auto trading is enabled, 3) Account has sufficient balance, 4) License is active, 5) Market is open during EA's trading hours. Check the Experts tab for error messages."
      },
      {
        question: "How do I optimize EA settings for my account?",
        answer: "Start with default settings for 1-2 weeks, then adjust based on your risk tolerance. Key settings: lot size (0.01 per $1000 balance), maximum spread, trading hours, and risk percentage. Avoid over-optimization."
      },
      {
        question: "Can I run multiple EAs on the same account?",
        answer: "Yes, but ensure they trade different pairs or use different magic numbers to avoid conflicts. Monitor total risk exposure and adjust lot sizes accordingly to prevent overexposure."
      }
    ]
  }
]

const documentGuides = [
  {
    title: "EA Installation Guide",
    description: "Complete step-by-step guide to install and configure Expert Advisors",
    icon: Download,
    content: `
# EA Installation Guide

## Prerequisites
- MetaTrader 5 platform installed
- Valid broker account with MT5 access
- Active EA license from your dashboard

## Step-by-Step Installation

### 1. Download Your EA
1. Login to your dashboard
2. Navigate to "Products & Licenses"
3. Click "Download" next to your purchased EA
4. Save the downloaded ZIP package to your computer
5. Extract the ZIP and locate the EA file (.ex5/.ex4)

### 2. Install on MetaTrader 5
1. Open MetaTrader 5
2. Go to File → Open Data Folder
3. Navigate to MQL5 → Experts folder
4. Copy your extracted .ex5 file into this folder
5. Restart MetaTrader 5

### 3. Activate Your License
1. Drag the EA onto a chart
2. Enter your license key when prompted
3. Configure settings as needed
4. Click "OK" to start trading

### 4. Verify Installation
- Check that EA shows a "smiley face" icon
- Ensure "AutoTrading" is enabled
- Monitor the "Experts" tab for any errors

## Troubleshooting
- **No smiley face**: Check if AutoTrading is enabled
- **License error**: Verify your license key is correct
- **No trades**: Check market hours and account balance
    `
  },
  {
    title: "Account Configuration",
    description: "Optimize your broker account settings for best EA performance",
    icon: Users,
    content: `
# Account Configuration Guide

## Recommended Broker Settings

### Account Type
- **ECN accounts preferred** for tighter spreads
- Raw spread accounts with commission structure
- Minimum deposit: $500 for safe lot sizing

### Leverage Settings
- **1:100 to 1:500 recommended**
- Higher leverage allows smaller lot sizes
- Don't over-leverage your account

### Symbol Settings
- Enable all major currency pairs
- Ensure 5-digit pricing is available
- Check spread history during trading hours

## EA Configuration

### Risk Management
- **Lot Size**: 0.01 per $1000 account balance
- **Max Risk**: Never risk more than 2% per trade
- **Stop Loss**: Always use protective stops

### Trading Hours
- Avoid major news events
- Best performance during London/NY overlap
- Consider your broker's server time

### Money Management
- Start with minimum lot sizes
- Increase gradually as account grows
- Never risk money you can't afford to lose

## Monitoring Your EA
- Check daily performance
- Review trade history regularly
- Adjust settings based on market conditions
    `
  },
  {
    title: "Risk Management",
    description: "Essential risk management principles for algorithmic trading",
    icon: Shield,
    content: `
# Risk Management Guide

## Core Principles

### Position Sizing
- **2% Rule**: Never risk more than 2% of account per trade
- **Lot Size Calculation**: Account Balance × 0.02 ÷ Stop Loss Pips
- **Progressive Sizing**: Increase lots as account grows

### Stop Loss Guidelines
- Always set stop losses before entering trades
- Use technical levels, not arbitrary numbers
- ATR-based stops for volatile markets

### Portfolio Management
- Diversify across different EAs
- Don't concentrate on single currency pairs
- Monitor correlation between trading strategies

## Risk Control Settings

### Maximum Drawdown
- Set maximum acceptable drawdown (15-20%)
- Use equity stop-loss if available
- Monitor daily, weekly, monthly performance

### Trading Hours
- Avoid major news events (NFP, FOMC, etc.)
- Best hours: London (8-12 GMT) and NY (13-17 GMT)
- Consider weekend gaps and Monday volatility

### Market Conditions
- **Trending Markets**: Use trend-following EAs
- **Ranging Markets**: Use scalping/grid EAs
- **High Volatility**: Reduce position sizes

## Emergency Procedures
1. **If EA malfunctions**: Stop AutoTrading immediately
2. **If large drawdown**: Review and adjust settings
3. **If broker issues**: Have backup broker ready
4. **Regular backups**: Export EA settings regularly
    `
  },
  {
    title: "Troubleshooting Common Issues",
    description: "Solutions to the most frequently encountered problems",
    icon: Zap,
    content: `
# Troubleshooting Guide

## License Issues

### "Invalid License" Error
1. **Check license key**: Ensure no extra spaces
2. **Account binding**: License tied to specific MT5 account
3. **Expiry date**: Check subscription status in dashboard
4. **Contact support**: If still issues persist

### "Hardware ID Mismatch"
- License bound to computer hardware
- Contact support for hardware reset
- Pro/Elite plans have more transfer allowances

## Trading Issues

### EA Not Placing Trades
1. **AutoTrading enabled**: Check MT5 settings
2. **Sufficient balance**: Minimum required for lot size
3. **Market hours**: EA may have time filters
4. **Spread conditions**: Check maximum spread settings

### Trades Closing Immediately
- **Spread too wide**: Increase max spread setting
- **Insufficient margin**: Reduce lot size
- **Stop loss hit**: Normal risk management

## Technical Problems

### EA Disappeared from Chart
1. **Check Experts folder**: File may be corrupted
2. **Reinstall EA**: Download fresh copy
3. **Check permissions**: Windows may block files
4. **Antivirus interference**: Add MT5 to exceptions

### Performance Issues
- **VPS recommended**: For 24/7 trading
- **Internet connection**: Stable connection required
- **MT5 updates**: Keep platform updated
- **Broker server**: Choose nearby server location

## Getting Help
- Check error messages in Experts tab
- Take screenshots of issues
- Note exact error codes
- Contact support with detailed information
    `
  }
]

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Mon-Fri, 9 AM - 6 PM GMT",
    responseTime: "< 5 minutes",
    badge: "Fastest"
  },
  {
    icon: Mail,
    title: "Email Support", 
    description: "Detailed assistance for complex issues",
    availability: "24/7 - We'll respond within",
    responseTime: "< 24 hours",
    badge: "Detailed"
  },
  {
    icon: FileText,
    title: "Knowledge Base",
    description: "Comprehensive guides and tutorials",
    availability: "Available 24/7",
    responseTime: "Instant access",
    badge: "Self-Service"
  }
]

const downloadGuideAsZip = async (
  guide: { title: string; content: string },
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    const zip = new JSZip()
    const safeName = guide.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    zip.file(`${safeName}.md`, guide.content.trim())
    zip.file(
      "README.txt",
      `Downloaded guide: ${guide.title}

What to do after downloading this ZIP:
1. Extract the ZIP file.
2. Open the .md file in any text editor.
3. Follow the setup steps in order.
4. If this is an EA setup guide, copy the EA file to MetaTrader Experts folder.
5. Contact support if any step fails.`
    )

    const blob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${safeName}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Guide Downloaded",
      description: `${guide.title} was downloaded as a ZIP package.`,
    })
  } catch (error) {
    console.error("Guide ZIP download failed:", error)
    toast({
      title: "Download Failed",
      description: "Could not create ZIP guide package. Please try again.",
      variant: "destructive",
    })
  }
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<typeof documentGuides[0] | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          name: formData.name,
          email: formData.email,
          topic: formData.topic,
          message: formData.message
        })

      if (error) throw error

      setIsSubmitted(true)
      toast({
        title: "Message Sent Successfully!",
        description: "Our support team will get back to you within 24 hours.",
      })
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", topic: "", message: "" })
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting support ticket:', error)
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredQuestions = faqCategories.flatMap(category => 
    category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(q => ({ ...q, category: category.title }))
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              🎯 Expert Support & Resources
            </Badge>
            <h1 className="text-hero font-bold tracking-tight animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              We're Here to{" "}
              <span className="text-gradient">Help You Succeed</span>
            </h1>
            <p className="mt-6 text-body leading-7 text-muted-foreground max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Get expert support, comprehensive guides, and answers to all your questions about 
              algorithmic trading with our Expert Advisors.
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="dashboard-title font-bold tracking-tight mb-4">
              Multiple Ways to Get Help
            </h2>
            <p className="dashboard-text text-muted-foreground max-w-2xl mx-auto">
              Choose the support channel that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="text-center hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardHeader>
                  <div className="relative">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                      <channel.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <Badge className="absolute -top-2 -right-12" variant="secondary">
                      {channel.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {channel.availability}
                    </div>
                    <div className="font-medium text-primary">
                      Response: {channel.responseTime}
                    </div>
                  </div>
                  <Button 
                    className="mt-4 w-full hover-scale" 
                    size="sm"
                    onClick={() => {
                      if (channel.title === "Live Chat") {
                        // Trigger the live chat bot
                        const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement
                        if (chatButton) {
                          chatButton.click()
                        } else {
                          // Fallback: scroll to top and show a message
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                          alert('Live chat is available in the bottom right corner of the page!')
                        }
                      } else if (channel.title === "Email Support") {
                        window.location.href = 'mailto:support@yourcompany.com?subject=Support Request'
                      } else {
                        // Scroll to knowledge base section
                        document.getElementById('knowledge-base')?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {channel.title === "Live Chat" ? "Start Chat" : 
                     channel.title === "Email Support" ? "Send Email" : "Browse Guides"}
                    {channel.title === "Live Chat" && <ExternalLink className="ml-2 h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-subtle border-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Join Our Community</CardTitle>
                <CardDescription>
                  Connect with other traders, share strategies, and get real-time support from our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full hover-scale" 
                  onClick={() => window.open('https://t.me/AlgotradingwithIghodalo', '_blank')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join Telegram Community
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  1,500+ active traders • 24/7 discussions • Expert tips
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation & Guides */}
      <section id="knowledge-base" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-hero mb-4">
              Knowledge Base & Guides
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides to help you get the most out of our Expert Advisors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentGuides.map((guide, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover-scale transition-all duration-200 hover:shadow-lg animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                        <guide.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <guide.icon className="h-5 w-5" />
                      {guide.title}
                    </DialogTitle>
                    <DialogDescription>
                      {guide.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => downloadGuideAsZip(guide, toast)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download ZIP
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-normal bg-muted p-4 rounded-lg">
                      {guide.content}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            
            {/* Additional Quick Start Guide */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover-scale transition-all duration-200 hover:shadow-lg animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '0.5s' }}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                      <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">Quick Start Guide</CardTitle>
                    <CardDescription className="text-sm">
                      Get started with your first EA in under 10 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Zap className="mr-2 h-4 w-4" />
                      Start Tutorial
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Start Guide
                  </DialogTitle>
                  <DialogDescription>
                    Get started with your first EA in under 10 minutes
                  </DialogDescription>
                </DialogHeader>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-normal bg-muted p-4 rounded-lg">
{`# Quick Start Guide

## Step 1: Purchase & Download (2 minutes)
1. Choose an EA from our Products page
2. Complete purchase via secure checkout
3. Download EA ZIP package from your Dashboard
4. Extract the ZIP file
5. Locate the .ex5/.ex4 file and optional .set file

## Step 2: Install on MT5 (3 minutes)
1. Open MetaTrader 5
2. Go to File → Open Data Folder
3. Navigate to MQL5 → Experts
4. Copy your EA file here (from extracted ZIP)
5. Restart MT5

## Step 3: Activate License (2 minutes)
1. Drag EA onto any chart
2. Enter your license key from dashboard
3. Configure basic settings:
   - Lot Size: 0.01 per $1000 balance
   - Risk %: 2% maximum
   - Trading Hours: London/NY session
4. Enable AutoTrading
5. Click OK

## Step 4: Verify & Monitor (3 minutes)
1. Check EA shows smiley face ✓
2. Monitor Experts tab for messages
3. Verify first trades align with strategy
4. Set up mobile alerts (optional)

## Next Steps
- Join our Telegram community
- Read the full documentation
- Contact support if needed

## Pro Tips
✓ Start with demo account first
✓ Use VPS for 24/7 trading
✓ Keep MT5 updated
✓ Monitor during first week
✓ Adjust settings gradually

## Need Help?
- Live Chat: Connect with Lovable support
- Email: support@yourcompany.com  
- Community: Join our Telegram group`}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-hero mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Find quick answers to the most common questions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            {searchTerm ? (
              filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredQuestions.map((item, index) => (
                    <Card key={index}>
                      <AccordionItem value={`search-${index}`} className="border-none">
                        <CardHeader className="pb-2">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <div className="font-medium">{item.question}</div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                        </CardHeader>
                        <AccordionContent>
                          <CardContent className="pt-0 pb-4">
                            <p className="text-muted-foreground">{item.answer}</p>
                          </CardContent>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  ))}
                </Accordion>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No FAQs found matching "{searchTerm}"</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )
            ) : (
              // Show categorized FAQs
              <Accordion type="single" collapsible className="space-y-6">
                {faqCategories.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {category.title === "Getting Started" && <Zap className="h-5 w-5" />}
                        {category.title === "License Management" && <Shield className="h-5 w-5" />}
                        {category.title === "Subscriptions & Billing" && <Users className="h-5 w-5" />}
                        {category.title === "Technical Issues" && <FileText className="h-5 w-5" />}
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.questions.map((faq, index) => (
                          <AccordionItem 
                            key={index} 
                            value={`${categoryIndex}-${index}`} 
                            className="border rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-left text-sm">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-sm">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-hero mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-muted-foreground">
                Can't find what you're looking for? Send us a message and we'll get back to you quickly.
              </p>
            </div>

            <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Describe your issue in detail and we'll provide personalized assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-title mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. Our support team will respond within 24 hours.
                    </p>
                  </div>
                ) : (
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
                      <Label htmlFor="topic">Topic *</Label>
                      <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the topic of your inquiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="license">License & Activation Issues</SelectItem>
                          <SelectItem value="technical">Technical Problems</SelectItem>
                          <SelectItem value="billing">Billing & Subscriptions</SelectItem>
                          <SelectItem value="ea-config">EA Configuration Help</SelectItem>
                          <SelectItem value="broker">Broker Compatibility</SelectItem>
                          <SelectItem value="custom">Custom Development</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        placeholder="Please describe your issue or question in detail..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full hover-scale"
                      disabled={!formData.name || !formData.email || !formData.topic || !formData.message || isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-hero mb-4">
              Additional Resources
            </h2>
            <p className="text-lg text-muted-foreground">
              Helpful resources to maximize your trading success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Download,
                title: "Installation Guides",
                description: "Step-by-step guides for setting up EAs on MT5",
                link: "View Guides"
              },
              {
                icon: FileText,
                title: "Trading Documentation",
                description: "Complete documentation for all our Expert Advisors",
                link: "Read Docs"
              },
              {
                icon: Users,
                title: "Community Forum",
                description: "Connect with other traders and share strategies",
                link: "Join Community"
              }
            ].map((resource, index) => (
              <Card key={index} className="text-center hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <resource.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="hover-scale">
                    {resource.link}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}