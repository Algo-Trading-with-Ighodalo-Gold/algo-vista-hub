import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Star, TrendingUp, Shield, Clock, ArrowRight, BarChart3, Target, DollarSign, Timer } from "lucide-react"

// Import EA images
import scalperProImage from "@/assets/scalper-pro-ea.jpg"
import swingMasterImage from "@/assets/swing-master-ea.jpg"
import gridTraderImage from "@/assets/grid-trader-ea.jpg"
import trendRiderImage from "@/assets/trend-rider-ea.jpg"
import goldRushImage from "@/assets/gold-rush-ea.jpg"
import nightOwlImage from "@/assets/night-owl-ea.jpg"
import cryptoPulseImage from "@/assets/crypto-pulse-ea.jpg"

const expertAdvisors = [
  {
    id: "scalper-pro-ea",
    name: "Scalper Pro EA",
    shortDescription: "High-frequency scalping strategy with advanced risk management",
    description: "Scalper Pro EA is designed for traders who want to capitalize on small price movements throughout the day. This EA uses sophisticated algorithms to identify optimal entry and exit points in volatile markets.",
    features: [
      "High-frequency trading capabilities",
      "Advanced risk management system",
      "Real-time market analysis",
      "Multiple currency pair support",
      "Low drawdown strategy"
    ],
    image: scalperProImage,
    rating: 4.8,
    reviews: 127,
    price: "$149",
    tradingPairs: "EURUSD, GBPUSD, USDJPY",
    timeframes: "M1, M5",
    strategyType: "Scalping",
    minDeposit: "$500",
    avgMonthlyReturn: "12-18%",
    maxDrawdown: "8%"
  },
  {
    id: "swing-master-ea",
    name: "Swing Master EA",
    shortDescription: "Medium-term swing trading with trend following algorithms",
    description: "Swing Master EA captures medium-term market movements using advanced trend analysis. Perfect for traders who prefer less frequent but more substantial trades with higher profit potential.",
    features: [
      "Trend following algorithms",
      "Medium-term position holding",
      "Multiple timeframe analysis",
      "Automated stop-loss management",
      "Market volatility adaptation"
    ],
    image: swingMasterImage,
    rating: 4.6,
    reviews: 89,
    price: "$199",
    tradingPairs: "EURUSD, GBPUSD, AUDUSD, NZDUSD",
    timeframes: "H1, H4, D1",
    strategyType: "Swing Trading",
    minDeposit: "$1,000",
    avgMonthlyReturn: "8-15%",
    maxDrawdown: "12%"
  },
  {
    id: "grid-trader-ea",
    name: "Grid Trader EA",
    shortDescription: "Grid trading system with intelligent position management",
    description: "Grid Trader EA implements a sophisticated grid trading strategy that places orders at predetermined intervals. It includes intelligent recovery mechanisms and position sizing algorithms.",
    features: [
      "Intelligent grid placement",
      "Recovery mechanism",
      "Dynamic lot sizing",
      "Profit target optimization",
      "Risk control parameters"
    ],
    image: gridTraderImage,
    rating: 4.4,
    reviews: 156,
    price: "$179",
    tradingPairs: "EURUSD, GBPUSD",
    timeframes: "M15, M30, H1",
    strategyType: "Grid Trading",
    minDeposit: "$2,000",
    avgMonthlyReturn: "5-12%",
    maxDrawdown: "15%"
  },
  {
    id: "trend-rider-ea",
    name: "Trend Rider EA",
    shortDescription: "Long-term trend following with momentum indicators",
    description: "Trend Rider EA is built for capturing long-term market trends using a combination of momentum indicators and price action analysis. Ideal for patient traders seeking consistent returns.",
    features: [
      "Long-term trend identification",
      "Momentum-based entries",
      "Trailing stop mechanisms",
      "Multi-currency optimization",
      "Low maintenance trading"
    ],
    image: trendRiderImage,
    rating: 4.7,
    reviews: 203,
    price: "$229",
    tradingPairs: "EURUSD, GBPUSD, USDJPY, AUDUSD",
    timeframes: "H4, D1, W1",
    strategyType: "Trend Following",
    minDeposit: "$1,500",
    avgMonthlyReturn: "10-20%",
    maxDrawdown: "10%"
  },
  {
    id: "gold-rush-ea",
    name: "Gold Rush EA",
    shortDescription: "Specialized gold trading with precious metals expertise",
    description: "Gold Rush EA is specifically designed for trading gold (XAUUSD) and other precious metals. It incorporates unique algorithms that understand the specific characteristics of precious metals markets.",
    features: [
      "Gold market specialization",
      "Precious metals optimization",
      "News event filtering",
      "Market session awareness",
      "Volatility-based sizing"
    ],
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 94,
    price: "$189"
  },
  {
    id: "night-owl-ea",
    name: "Night Owl EA",
    shortDescription: "Asian session specialist for overnight trading",
    description: "Night Owl EA is optimized for the Asian trading session, taking advantage of lower volatility and specific market patterns that occur during overnight hours in Western markets.",
    features: [
      "Asian session optimization",
      "Low volatility strategies",
      "Overnight position management",
      "Time-based filtering",
      "Spread-aware trading"
    ],
    image: nightOwlImage,
    rating: 4.3,
    reviews: 67,
    price: "$159",
    tradingPairs: "USDJPY, AUDJPY, NZDJPY",
    timeframes: "M5, M15, M30",
    strategyType: "Session Trading",
    minDeposit: "$800",
    avgMonthlyReturn: "6-12%",
    maxDrawdown: "10%"
  },
  {
    id: "crypto-pulse-ea",
    name: "Crypto Pulse EA",
    shortDescription: "Cryptocurrency trading with volatility-based algorithms",
    description: "Crypto Pulse EA is designed specifically for cryptocurrency markets, handling the unique volatility and 24/7 nature of digital asset trading with advanced risk management.",
    features: [
      "Cryptocurrency optimization",
      "24/7 trading capability",
      "Volatility adaptation",
      "Multi-coin support",
      "DeFi market awareness"
    ],
    image: cryptoPulseImage,
    rating: 4.9,
    reviews: 312,
    price: "$249",
    tradingPairs: "BTCUSD, ETHUSD, ADAUSD",
    timeframes: "M5, M15, H1",
    strategyType: "Crypto Trading",
    minDeposit: "$1,500",
    avgMonthlyReturn: "20-35%",
    maxDrawdown: "25%"
  }
]

interface EADetailModalProps {
  ea: typeof expertAdvisors[0]
  isOpen: boolean
  onClose: () => void
}

function EADetailModal({ ea, isOpen, onClose }: EADetailModalProps) {
  const handleSubscriptionPayment = () => {
    // Redirect to subscription checkout
    console.log("Redirecting to subscription checkout for", ea.name)
  }

  const handleOneTimePayment = () => {
    // Redirect to one-time payment checkout
    console.log("Redirecting to one-time payment checkout for", ea.name)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{ea.name}</DialogTitle>
          <DialogDescription className="text-lg">
            {ea.shortDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <img 
                src={ea.image} 
                alt={ea.name}
                className="max-w-full max-h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(ea.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                  />
                ))}
                <span className="ml-2 font-medium">{ea.rating}</span>
              </div>
              <span className="text-muted-foreground">({ea.reviews} reviews)</span>
              <Badge variant="secondary" className="ml-auto">{ea.price}</Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{ea.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                {ea.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Trading Pairs</div>
                      <div className="text-muted-foreground">{ea.tradingPairs || 'Various'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Timeframes</div>
                      <div className="text-muted-foreground">{ea.timeframes || 'Multiple'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Strategy</div>
                      <div className="text-muted-foreground">{ea.strategyType || 'Trading'}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Min. Deposit</div>
                      <div className="text-muted-foreground">{ea.minDeposit || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <div>
                      <div className="font-medium">Monthly Return</div>
                      <div className="text-success">{ea.avgMonthlyReturn || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-warning" />
                    <div>
                      <div className="font-medium">Max Drawdown</div>
                      <div className="text-warning">{ea.maxDrawdown || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Choose Your Payment Option</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Subscription Plan
                </CardTitle>
                <CardDescription>Monthly access with all updates</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold">$29<span className="text-lg text-muted-foreground">/mo</span></div>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-success rounded-full" />
                    Continuous updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-success rounded-full" />
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-success rounded-full" />
                    Performance monitoring
                  </li>
                </ul>
                <Button 
                  className="w-full hover-scale" 
                  onClick={handleSubscriptionPayment}
                >
                  Subscribe Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" />
                  One-Time Purchase
                </CardTitle>
                <CardDescription>Lifetime license with current version</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold">{ea.price}<span className="text-lg text-muted-foreground"> once</span></div>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Lifetime license
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Current version access
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Basic support included
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full hover-scale" 
                  onClick={handleOneTimePayment}
                >
                  Buy Once
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ProductsPage() {
  const [selectedEA, setSelectedEA] = useState<typeof expertAdvisors[0] | null>(null)

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Products Grid */}
        <section className="py-8">
          <div className="container">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Expert Advisors</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional automated trading solutions for every trading style and market condition.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertAdvisors.map((ea, index) => (
                <Card 
                  key={ea.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={ea.image} 
                        alt={ea.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {ea.name}
                    </CardTitle>
                    <CardDescription>{ea.shortDescription}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(ea.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{ea.rating}</span>
                      <span className="text-sm text-muted-foreground">({ea.reviews})</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Pairs:</span> {ea.tradingPairs?.split(',')[0] || 'Various'}+
                      </div>
                      <div>
                        <span className="font-medium">Strategy:</span> {ea.strategyType || 'Trading'}
                      </div>
                      <div>
                        <span className="font-medium">Return:</span> <span className="text-success">{ea.avgMonthlyReturn || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Min Deposit:</span> {ea.minDeposit || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{ea.price}</span>
                      <Button 
                        className="hover-scale" 
                        onClick={() => setSelectedEA(ea)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* EA Detail Modal */}
        {selectedEA && (
          <EADetailModal 
            ea={selectedEA} 
            isOpen={!!selectedEA} 
            onClose={() => setSelectedEA(null)} 
          />
        )}
      </div>
    </Layout>
  )
}