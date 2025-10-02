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
    "Our Expert Advisors are professional trading algorithms designed for MetaTrader 5. They can help automate your trading strategies with proven results.",
    "We offer various EAs including Scalper Pro, Swing Master, Grid Trader, and more. Each is backtested and optimized for different market conditions.",
    "Our EAs are designed for different trading styles - from scalping to swing trading. Would you like to know about a specific strategy?"
  ],
  pricing: [
    "Our EA pricing varies by strategy and features. Most EAs start from $99 with lifetime updates included.",
    "We offer flexible pricing options including one-time purchases and subscription plans. Check our products page for detailed pricing.",
    "All our EAs come with 30-day money-back guarantee and lifetime updates. No hidden fees!"
  ],
  support: [
    "For technical support, you can reach us through our support page or join our Telegram community.",
    "We provide 24/7 support through multiple channels. The fastest way is usually through our Telegram group.",
    "If you need immediate assistance, I can direct you to our support form or Telegram community."
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
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)]
    }
    
    if (message.includes('ea') || message.includes('expert advisor') || message.includes('algorithm')) {
      return botResponses.ea[Math.floor(Math.random() * botResponses.ea.length)]
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('buy')) {
      return botResponses.pricing[Math.floor(Math.random() * botResponses.pricing.length)]
    }
    
    if (message.includes('support') || message.includes('help') || message.includes('problem')) {
      return botResponses.support[Math.floor(Math.random() * botResponses.support.length)]
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
    { label: "Tell me about EAs", action: "What are Expert Advisors?" },
    { label: "Pricing info", action: "What are your prices?" },
    { label: "Get support", action: "I need help" },
    { label: "Join Telegram", action: "How do I join your community?" }
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
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 animate-fade-in-scale">
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
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t">
                <div className="flex flex-wrap gap-1 mb-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs h-6 px-2"
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

