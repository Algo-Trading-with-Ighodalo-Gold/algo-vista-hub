import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botResponses = {
  greeting: [
    "Hello! I'm here to help with your trading questions. How can I assist you today?",
    "Hi there! Welcome to AlgoTrading with Ighodalo. What would you like to know?",
    "Greetings! I'm your trading assistant. How can I help you today?"
  ],
  ea: [
    "Our Expert Advisors are professional trading algorithms designed for MetaTrader 5. We offer 7+ EAs including Scalper Pro EA, Swing Master EA, Grid Trader EA, Trend Rider EA, Gold Rush EA, Night Owl EA, and Crypto Pulse EA.",
    "Each EA is specifically designed for different trading styles. Scalper Pro EA focuses on high-frequency scalping with 12-18% monthly returns, while Swing Master EA captures medium-term trends with lower frequency trades.",
    "Our EAs are backtested and optimized for different market conditions. They support various currency pairs and timeframes, with minimum deposits starting from $500."
  ],
  scalper: [
    "Scalper Pro EA is our high-frequency scalping strategy with advanced risk management. It targets EURUSD, GBPUSD, and USDJPY on M1 and M5 timeframes with an average monthly return of 12-18% and maximum drawdown of 8%.",
    "This EA is perfect for traders who want to capitalize on small price movements throughout the day. It uses sophisticated algorithms to identify optimal entry and exit points in volatile markets.",
    "Scalper Pro EA costs $149 and includes lifetime updates. It requires a minimum deposit of $500 and has generated +234.5% performance."
  ],
  swing: [
    "Swing Master EA captures medium-term market movements using advanced trend analysis. It's perfect for traders who prefer less frequent but more substantial trades with higher profit potential.",
    "This EA uses trend following algorithms with medium-term position holding and multiple timeframe analysis. It includes automated stop-loss management and market volatility adaptation.",
    "Swing Master EA is ideal for traders who can't monitor the markets constantly but want to capture significant price movements over days or weeks."
  ],
  grid: [
    "Grid Trader EA uses a sophisticated grid trading system that places buy and sell orders at predetermined intervals. This strategy works well in ranging markets and can generate consistent profits.",
    "The grid system automatically manages positions and adjusts to market conditions. It's particularly effective in sideways markets where traditional trend-following strategies might struggle.",
    "Grid Trader EA includes advanced risk management features to protect against adverse market movements and optimize profit potential."
  ],
  pricing: [
    "Our EA pricing varies by strategy and features. Scalper Pro EA costs $149, Swing Master EA is $199, Grid Trader EA is $179, and Trend Rider EA is $159. All include lifetime updates.",
    "We offer flexible pricing options including one-time purchases and subscription plans. Most EAs start from $149 with lifetime updates included and 30-day money-back guarantee.",
    "All our EAs come with 30-day money-back guarantee, lifetime updates, and 24/7 support. No hidden fees! Check our products page for detailed pricing and subscription options."
  ],
  support: [
    "For technical support, you can reach us through our support page or join our Telegram community at https://t.me/AlgotradingwithIghodalo.",
    "We provide 24/7 support through multiple channels. The fastest way is usually through our Telegram group where you can get real-time assistance from our community.",
    "If you need immediate assistance, I can direct you to our support form or Telegram community. We also offer priority email support for premium users."
  ],
  telegram: [
    "Join our Telegram community at https://t.me/AlgotradingwithIghodalo for real-time support, market updates, and trading discussions with other users.",
    "Our Telegram group is the best place to get quick help, share experiences, and stay updated with the latest EA performance and market insights.",
    "You can join our Telegram community for free and get access to exclusive trading tips, EA updates, and direct support from our team."
  ],
  performance: [
    "Our EAs have generated over $4.2M+ in cumulative returns with a 94% success rate. We have 2,500+ active traders worldwide with +12% growth this month.",
    "Scalper Pro EA has achieved +234.5% performance, while our overall success rate is 94% with profitable months consistently above 90%.",
    "Our Expert Advisors have proven track records with low drawdowns (typically 8% or less) and consistent monthly returns ranging from 8% to 18% depending on the strategy."
  ],
  features: [
    "Our EAs include advanced features like real-time market analysis, automated risk management, multiple currency pair support, and adaptive algorithms that adjust to market conditions.",
    "Each EA comes with comprehensive backtesting results, detailed documentation, and 24/7 monitoring capabilities. They're designed for both beginners and experienced traders.",
    "Key features include automated stop-loss management, position sizing algorithms, market volatility adaptation, and support for multiple timeframes and currency pairs."
  ],
  default: [
    "I understand you're asking about that. Let me connect you with our support team for a more detailed answer.",
    "That's a great question! Our support team can provide you with more specific information about this.",
    "I'd love to help, but for this specific question, our support team would be better equipped to assist you."
  ]
}

export function LiveChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your trading assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      setIsAtBottom(true)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottomNow = target.scrollTop + target.clientHeight >= target.scrollHeight - 10
    setIsAtBottom(isAtBottomNow)
  }

  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    const messagesContainer = document.querySelector('.chatbot-scroll')
    if (messagesContainer) {
      const isAtBottomNow = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 10
      if (isAtBottomNow) {
    scrollToBottom()
      }
    }
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Greeting detection
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)]
    }
    
    // Specific EA detection
    if (message.includes('scalper') || message.includes('scalping') || message.includes('high frequency')) {
      return botResponses.scalper[Math.floor(Math.random() * botResponses.scalper.length)]
    }
    
    if (message.includes('swing') || message.includes('swing master') || message.includes('medium term')) {
      return botResponses.swing[Math.floor(Math.random() * botResponses.swing.length)]
    }
    
    if (message.includes('grid') || message.includes('grid trader') || message.includes('ranging')) {
      return botResponses.grid[Math.floor(Math.random() * botResponses.grid.length)]
    }
    
    // General EA detection
    if (message.includes('ea') || message.includes('expert advisor') || message.includes('algorithm') || message.includes('bot') || message.includes('automated trading')) {
      return botResponses.ea[Math.floor(Math.random() * botResponses.ea.length)]
    }
    
    // Pricing detection
    if (message.includes('price') || message.includes('cost') || message.includes('buy') || message.includes('purchase') || message.includes('subscription') || message.includes('plan')) {
      return botResponses.pricing[Math.floor(Math.random() * botResponses.pricing.length)]
    }
    
    // Performance detection
    if (message.includes('performance') || message.includes('return') || message.includes('profit') || message.includes('success rate') || message.includes('drawdown') || message.includes('monthly')) {
      return botResponses.performance[Math.floor(Math.random() * botResponses.performance.length)]
    }
    
    // Features detection
    if (message.includes('feature') || message.includes('capability') || message.includes('function') || message.includes('backtest') || message.includes('risk management')) {
      return botResponses.features[Math.floor(Math.random() * botResponses.features.length)]
    }
    
    // Support detection
    if (message.includes('support') || message.includes('help') || message.includes('problem') || message.includes('issue') || message.includes('trouble') || message.includes('assistance')) {
      return botResponses.support[Math.floor(Math.random() * botResponses.support.length)]
    }
    
    // Telegram detection
    if (message.includes('telegram') || message.includes('community') || message.includes('group') || message.includes('chat') || message.includes('discord')) {
      return botResponses.telegram[Math.floor(Math.random() * botResponses.telegram.length)]
    }
    
    // MetaTrader detection
    if (message.includes('metatrader') || message.includes('mt5') || message.includes('mt4') || message.includes('platform')) {
      return "Our Expert Advisors are designed specifically for MetaTrader 5 (MT5) platform. They work seamlessly with MT5's advanced features and can be easily installed and configured. All our EAs are compatible with MT5 and include detailed setup instructions."
    }
    
    // Currency pairs detection
    if (message.includes('eurusd') || message.includes('gbpusd') || message.includes('usdjpy') || message.includes('currency') || message.includes('forex') || message.includes('pair')) {
      return "Our EAs support multiple major currency pairs including EURUSD, GBPUSD, USDJPY, and more. Each EA is optimized for specific pairs and timeframes. Scalper Pro EA works best with EURUSD, GBPUSD, and USDJPY on M1 and M5 timeframes."
    }
    
    // Installation/setup detection
    if (message.includes('install') || message.includes('setup') || message.includes('configure') || message.includes('download') || message.includes('how to')) {
      return "Installing our EAs is straightforward! After purchase, you'll receive detailed installation instructions, the EA file, and setup parameters. Our support team can also assist with installation and configuration. All EAs come with comprehensive documentation."
    }
    
    // Money back guarantee detection
    if (message.includes('guarantee') || message.includes('refund') || message.includes('money back') || message.includes('trial')) {
      return "We offer a 30-day money-back guarantee on all our Expert Advisors. If you're not satisfied with the performance within 30 days, you can request a full refund. This gives you plenty of time to test the EA and see if it meets your trading goals."
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: "Scalper Pro EA", action: "Tell me about Scalper Pro EA" },
    { label: "Swing Master EA", action: "Tell me about Swing Master EA" },
    { label: "Pricing", action: "What are your prices?" },
    { label: "Performance", action: "What are your performance results?" },
    { label: "Support", action: "I need help" },
    { label: "Telegram", action: "How do I join your community?" }
  ]

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    handleSendMessage()
  }

  const redirectToSupport = () => {
    window.open('/support', '_blank')
    toast({
      title: "Redirecting to Support",
      description: "Opening our support page for detailed assistance",
    })
  }

  const redirectToTelegram = () => {
    window.open('https://t.me/AlgotradingwithIghodalo', '_blank')
    toast({
      title: "Joining Telegram",
      description: "Opening our Telegram community",
    })
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          data-chat-trigger
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-crazy-bounce hover-crazy-pulse"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 animate-crazy-wiggle" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] animate-fade-in-scale">
          <Card className="h-full flex flex-col shadow-2xl border-0">
            <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <CardTitle className="text-sm font-semibold">Live Chat</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-3 chatbot-scroll min-h-0" 
                style={{ maxHeight: '320px' }}
                onScroll={handleScroll}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                        <Bot className="h-3 w-3" />
                      </div>
                      <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
                
                {/* Scroll to bottom button */}
                {!isAtBottom && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={scrollToBottom}
                      className="text-xs h-6 px-2 bg-background/80 backdrop-blur-sm"
                    >
                      ↓ New messages
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t bg-background sticky bottom-0">
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs h-7 px-2 text-left justify-start"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="text-sm h-8"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redirectToSupport}
                    className="text-xs h-6 flex-1"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Support
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redirectToTelegram}
                    className="text-xs h-6 flex-1"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Telegram
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

