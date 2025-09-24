import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail
} from 'lucide-react'
import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const faqCategories = [
  {
    category: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "How do I get started with algorithmic trading?",
        answer: "Start by choosing an EA that matches your trading style and risk tolerance. Download it, install it on your MT4/MT5 platform, and configure the settings according to our provided guidelines. We recommend starting with a demo account first."
      },
      {
        question: "What is the minimum account balance required?",
        answer: "We recommend a minimum balance of $1,000 for optimal performance, though our EAs can work with smaller accounts. The minimum varies by EA - Basic plans start at $500, Pro at $1,000, and Elite at $2,000."
      },
      {
        question: "Which brokers are compatible with your EAs?",
        answer: "Our EAs are compatible with most MT4 and MT5 brokers. We recommend brokers with low spreads, fast execution, and good regulatory standing. Contact us for a list of tested and recommended brokers."
      }
    ]
  },
  {
    category: "Subscriptions & Billing",
    icon: "💳",
    faqs: [
      {
        question: "What subscription plans do you offer?",
        answer: "We offer two main subscription periods: 3 months and 1 year subscriptions. Each comes in Basic, Pro, and Elite tiers with different MT5 account limits and features. All subscriptions auto-renew."
      },
      {
        question: "Can I change my subscription plan?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
      },
      {
        question: "Do you accept cryptocurrency payments?",
        answer: "Yes! We accept cryptocurrency payments through Confirmo in addition to traditional payment methods via Stripe. Bitcoin, Ethereum, and other major cryptocurrencies are supported."
      },
      {
        question: "Is there a refund policy?",
        answer: "We offer a 7-day evaluation period for new subscribers. If you're not satisfied within the first 7 days, contact us for a full refund. Refunds are not available after this period."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: "🛠️",
    faqs: [
      {
        question: "How do I install an EA on MT4/MT5?",
        answer: "1. Download the EA file from your dashboard 2. Copy it to your MetaTrader's 'Experts' folder 3. Restart MT4/MT5 4. Drag the EA onto your chart 5. Configure settings and enable live trading. Detailed video guides are available in your account."
      },
      {
        question: "Why is my EA not placing trades?",
        answer: "Check: 1) AutoTrading is enabled 2) EA shows a smiley face on the chart 3) Your account balance meets minimum requirements 4) Market conditions match EA parameters 5) No conflicting EAs are running."
      },
      {
        question: "Can I run multiple EAs simultaneously?",
        answer: "Yes, but ensure they don't conflict with each other. Our Elite plans support up to 10 MT5 accounts, allowing you to diversify across multiple EAs and currency pairs effectively."
      },
      {
        question: "How often are EAs updated?",
        answer: "We continuously monitor market conditions and update our EAs as needed. Major updates are released quarterly, with minor optimizations monthly. All updates are free for active subscribers."
      }
    ]
  },
  {
    category: "Performance & Risk",
    icon: "📈",
    faqs: [
      {
        question: "What returns can I expect?",
        answer: "Past performance doesn't guarantee future results. Our EAs typically target 10-25% monthly returns, but actual performance varies based on market conditions, account size, and risk settings. Always review backtesting results and live performance data."
      },
      {
        question: "How is risk managed?",
        answer: "Our EAs use multiple risk management techniques: stop losses, position sizing, maximum daily/weekly limits, correlation filters, and volatility adjustments. You can customize risk levels to match your tolerance."
      },
      {
        question: "What happens during high-impact news events?",
        answer: "Most of our EAs include news filters that pause trading during high-impact events. This helps avoid unpredictable market movements that could cause significant losses."
      }
    ]
  },
  {
    category: "Account Management", 
    icon: "👤",
    faqs: [
      {
        question: "How do I access my EA downloads?",
        answer: "Log into your dashboard and navigate to the 'Accounts' section. All your licensed EAs will be available for download with installation instructions and configuration guides."
      },
      {
        question: "Can I transfer my license to a different MT5 account?",
        answer: "Yes, you can change your MT5 account details in your dashboard. Basic plans allow 3 accounts, Pro plans allow 5, and Elite plans allow up to 10 accounts."
      },
      {
        question: "What if I forget my login credentials?",
        answer: "Use the 'Forgot Password' link on the login page. If you've forgotten your email or need additional help, contact our support team with your account details."
      }
    ]
  }
]

export default function PublicFAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-6 animate-fade-in">
        <h1 className="text-display font-bold text-gradient">
          Frequently Asked Questions
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our algorithmic trading solutions, 
          subscriptions, and technical support.
        </p>
        <Badge variant="outline" className="text-caption">
          Updated Weekly
        </Badge>
      </section>

      {/* Search */}
      <section className="max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Categories */}
      <section className="space-y-8">
        {filteredFAQs.map((category, categoryIndex) => (
          <div 
            key={category.category}
            className="animate-fade-in opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: `${0.4 + categoryIndex * 0.1}s` }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </CardTitle>
                <CardDescription>
                  {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const itemId = `${category.category}-${faqIndex}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <Collapsible key={faqIndex}>
                      <CollapsibleTrigger
                        onClick={() => toggleItem(itemId)}
                        className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg hover:bg-accent transition-colors group"
                      >
                        <span className="font-medium text-heading">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 py-4">
                        <p className="text-body text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="text-center space-y-6 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-center">
              <MessageSquare className="h-12 w-12" />
            </div>
            <h2 className="text-hero font-bold">Still Have Questions?</h2>
            <p className="text-body opacity-90 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="hover-scale">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale">
                <HelpCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}