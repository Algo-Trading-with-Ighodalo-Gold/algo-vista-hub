import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  HelpCircle,
  Search,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqCategories = [
  {
    title: 'Getting Started',
    badge: 'Most Popular',
    faqs: [
      {
        question: 'How do I install an Expert Advisor (EA)?',
        answer: 'To install an EA, download the .ex4 or .mq4 file, place it in your MetaTrader platform\'s "Experts" folder (usually located at MT4/MQL4/Experts or MT5/MQL5/Experts), restart your platform, and drag the EA onto your desired chart.',
        helpful: 127
      },
      {
        question: 'What is the minimum deposit required?',
        answer: 'The minimum deposit depends on your broker and account type. However, we recommend starting with at least $1,000 to properly implement risk management strategies and allow the EA to function optimally.',
        helpful: 98
      },
      {
        question: 'Can I use multiple EAs on the same account?',
        answer: 'Yes, you can run multiple EAs on the same account. However, ensure they don\'t conflict with each other by trading different currency pairs or using different timeframes. Monitor your total risk exposure carefully.',
        helpful: 156
      },
      {
        question: 'Do I need a VPS for trading EAs?',
        answer: 'A VPS is highly recommended for EA trading as it ensures 24/7 uptime, stable internet connection, and prevents interruptions from computer restarts or power outages. This maximizes your EA\'s performance and profit potential.',
        helpful: 89
      }
    ]
  },
  {
    title: 'Account & Licensing',
    badge: 'Important',
    faqs: [
      {
        question: 'How does the EA licensing work?',
        answer: 'Each EA comes with a unique license key tied to your account. The license allows installation on a specific number of MT4/MT5 accounts as specified in your purchase. Enterprise licenses offer additional flexibility for multiple accounts.',
        helpful: 145
      },
      {
        question: 'Can I transfer my license to a different broker?',
        answer: 'Yes, licenses can be transferred between brokers. Contact our support team with your new account details, and we\'ll help you migrate your license. This process typically takes 24-48 hours.',
        helpful: 73
      },
      {
        question: 'What happens if my license expires?',
        answer: 'When your license expires, the EA will stop functioning. You\'ll receive email notifications 7, 3, and 1 days before expiration. Renewal is simple through your dashboard, and there\'s usually a grace period for existing positions.',
        helpful: 91
      }
    ]
  },
  {
    title: 'Technical Issues',
    badge: 'Support',
    faqs: [
      {
        question: 'Why is my EA not making any trades?',
        answer: 'Common reasons include: incorrect settings, insufficient balance for minimum lot size, market conditions outside EA parameters, or platform connectivity issues. Check your EA logs and verify all settings match the recommended configuration.',
        helpful: 234
      },
      {
        question: 'How do I optimize EA settings?',
        answer: 'Start with default settings, then gradually adjust based on your risk tolerance and account size. Use the strategy tester for backtesting different parameters. Key settings include lot sizing, risk percentage, and maximum spread limits.',
        helpful: 187
      },
      {
        question: 'Can I modify the EA code?',
        answer: 'Standard licenses don\'t include source code access. However, we offer customization services for specific requirements. Alternatively, consider our EA development service for completely custom solutions.',
        helpful: 56
      }
    ]
  },
  {
    title: 'Performance & Results',
    badge: 'Results', 
    faqs: [
      {
        question: 'What returns can I expect?',
        answer: 'Returns vary based on market conditions, EA settings, and account management. Historical performance shows 10-30% monthly returns, but past performance doesn\'t guarantee future results. Always trade with proper risk management.',
        helpful: 203
      },
      {
        question: 'How do I track my EA\'s performance?',
        answer: 'Use your platform\'s built-in reports, our analytics dashboard, or third-party tools like Myfxbook. Monitor key metrics: profit/loss, win rate, drawdown, and risk-adjusted returns. Regular analysis helps optimize performance.',
        helpful: 124
      },
      {
        question: 'Why did my EA lose money?',
        answer: 'Losses can occur due to adverse market conditions, poor settings, high spreads, or news events. Review your settings, ensure proper risk management, and consider market conditions. Contact support if losses seem excessive.',
        helpful: 167
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="dashboard-section-title flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          FAQ
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Frequently asked questions and helpful answers
        </p>
      </div>

      {/* Search */}
      <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search FAQs..." 
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">16</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Helpful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">234</div>
            <p className="text-xs text-muted-foreground">Helpful votes</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full hover-scale">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6 animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={category.title} className={`hover:shadow-lg transition-shadow animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                style={{ animationDelay: `${0.4 + categoryIndex * 0.1}s` }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.title}</span>
                <Badge variant="secondary">{category.badge}</Badge>
              </CardTitle>
              <CardDescription>
                {category.faqs.length} questions in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="hover-scale">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Helpful ({faq.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="hover-scale">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="text-center">Still Need Help?</CardTitle>
          <CardDescription className="text-center">
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button className="hover-scale">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline" className="hover-scale">
            <ExternalLink className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}