import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, Shield, TrendingUp, BarChart3, Target, DollarSign, Timer, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CandlestickBackground } from "@/components/ui/candlestick-background"

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
    description: "Scalper Pro EA is designed for traders who want to capitalize on small price movements throughout the day. This EA uses sophisticated algorithms to identify optimal entry and exit points in volatile markets, combining multiple technical indicators with advanced risk management systems to deliver consistent results.",
    features: [
      "High-frequency trading capabilities with microsecond precision",
      "Advanced AI-powered risk management system",
      "Real-time market analysis and pattern recognition",
      "Multiple currency pair support with dynamic optimization",
      "Ultra-low drawdown strategy with built-in protection",
      "ECN/Zero spread broker compatibility",
      "News filter integration to avoid high-impact events",
      "Multi-timeframe confirmation system"
    ],
    image: scalperProImage,
    rating: 4.8,
    reviews: 127,
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
    description: "Swing Master EA captures medium-term market movements using advanced trend analysis and momentum indicators. Perfect for traders who prefer less frequent but more substantial trades with higher profit potential and lower time commitment.",
    features: [
      "Advanced trend following algorithms with machine learning",
      "Medium-term position holding for optimal profit capture",
      "Multiple timeframe analysis for precise market timing",
      "Automated trailing stop-loss management system",
      "Dynamic market volatility adaptation",
      "Smart position sizing based on market conditions",
      "Built-in drawdown protection mechanisms",
      "Compatible with major currency pairs and commodities"
    ],
    image: swingMasterImage,
    rating: 4.6,
    reviews: 89,
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
    description: "Grid Trader EA implements a sophisticated grid trading strategy that places orders at predetermined intervals. It includes intelligent recovery mechanisms, dynamic position sizing algorithms, and advanced risk management to maximize profitability while minimizing exposure.",
    features: [
      "Intelligent grid placement with dynamic spacing",
      "Advanced recovery mechanism for adverse markets",
      "Dynamic lot sizing based on account equity",
      "Profit target optimization using machine learning",
      "Multi-layer risk control parameters",
      "Adaptive grid adjustment based on volatility",
      "Built-in equity protection systems",
      "Customizable risk-reward ratios"
    ],
    image: gridTraderImage,
    rating: 4.4,
    reviews: 156,
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
    description: "Trend Rider EA is built for capturing long-term market trends using a combination of momentum indicators, price action analysis, and machine learning algorithms. Ideal for patient traders seeking consistent returns with minimal daily monitoring requirements.",
    features: [
      "Long-term trend identification with AI enhancement",
      "Momentum-based entry signals with confirmation",
      "Advanced trailing stop mechanisms",
      "Multi-currency portfolio optimization",
      "Low maintenance automated trading",
      "Adaptive position sizing based on trend strength",
      "Built-in market regime detection",
      "Risk-adjusted return optimization"
    ],
    image: trendRiderImage,
    rating: 4.7,
    reviews: 203,
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
    description: "Gold Rush EA is specifically designed for trading gold (XAUUSD) and other precious metals. It incorporates unique algorithms that understand the specific characteristics of precious metals markets, including their relationship with economic events, currency fluctuations, and market sentiment.",
    features: [
      "Gold market specialization with metal-specific algorithms",
      "Precious metals portfolio optimization",
      "Advanced news event filtering and analysis",
      "Market session awareness for optimal timing",
      "Volatility-based position sizing",
      "Economic calendar integration",
      "Central bank policy impact analysis",
      "Multi-metal correlation analysis"
    ],
    image: goldRushImage,
    rating: 4.5,
    reviews: 94,
    tradingPairs: "XAUUSD, XAGUSD, XPDUSD",
    timeframes: "M15, H1, H4",
    strategyType: "Precious Metals",
    minDeposit: "$2,500",
    avgMonthlyReturn: "15-25%",
    maxDrawdown: "18%"
  },
  {
    id: "night-owl-ea",
    name: "Night Owl EA",
    shortDescription: "Asian session specialist for overnight trading",
    description: "Night Owl EA is optimized for the Asian trading session, taking advantage of lower volatility and specific market patterns that occur during overnight hours in Western markets. Perfect for traders who want to capitalize on Asian market dynamics.",
    features: [
      "Asian session optimization with time-based filters",
      "Low volatility trading strategies",
      "Overnight position management with safety protocols",
      "Time-based filtering for optimal market conditions",
      "Spread-aware trading with cost optimization",
      "Session-specific risk management",
      "Carry trade integration for additional profits",
      "Cross-market correlation analysis"
    ],
    image: nightOwlImage,
    rating: 4.3,
    reviews: 67,
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
    description: "Crypto Pulse EA is designed specifically for cryptocurrency markets, handling the unique volatility and 24/7 nature of digital asset trading. It incorporates advanced risk management, sentiment analysis, and blockchain-specific indicators to navigate the crypto landscape successfully.",
    features: [
      "Cryptocurrency market optimization with DeFi integration",
      "24/7 trading capability with continuous monitoring",
      "Advanced volatility adaptation algorithms",
      "Multi-coin portfolio management and correlation",
      "DeFi market awareness and yield optimization",
      "Sentiment analysis from social media and news",
      "On-chain data integration for better signals",
      "Risk management tailored for crypto volatility"
    ],
    image: cryptoPulseImage,
    rating: 4.9,
    reviews: 312,
    tradingPairs: "BTCUSD, ETHUSD, ADAUSD",
    timeframes: "M5, M15, H1",
    strategyType: "Crypto Trading",
    minDeposit: "$1,500",
    avgMonthlyReturn: "20-35%",
    maxDrawdown: "25%"
  }
]

export default function ProductDetailPage() {
  const { eaId } = useParams()
  const navigate = useNavigate()
  const [ea, setEa] = useState<typeof expertAdvisors[0] | null>(null)

  useEffect(() => {
    const foundEa = expertAdvisors.find(advisor => advisor.id === eaId)
    if (foundEa) {
      setEa(foundEa)
    } else {
      navigate('/products')
    }
    window.scrollTo(0, 0)
  }, [eaId, navigate])

  if (!ea) {
    return null
  }

  const handleSubscribe = () => {
    navigate(`/products/${ea.id}/plans`)
  }

  return (
    <div className="min-h-screen relative">
      <CandlestickBackground variant="products" intensity="low" />
      
      {/* Breadcrumb */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{ea.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Strategy
                </Badge>
                <Badge variant="outline">AI-Powered</Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight">
                {ea.name}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ea.description}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(ea.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="font-medium">{ea.rating}</span>
                  <span className="text-muted-foreground">({ea.reviews} reviews)</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full lg:w-auto hover-scale" 
                onClick={handleSubscribe}
              >
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={ea.image} 
                  alt={ea.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ea.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trading Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Trading Pairs</div>
                        <div className="text-muted-foreground">{ea.tradingPairs}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Timeframes</div>
                        <div className="text-muted-foreground">{ea.timeframes}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Strategy</div>
                        <div className="text-muted-foreground">{ea.strategyType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Min. Deposit</div>
                        <div className="text-muted-foreground">{ea.minDeposit}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Return</span>
                    <span className="font-medium text-success">{ea.avgMonthlyReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium">{ea.maxDrawdown}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the subscription plan that fits your trading needs and start automating your success with {ea.name}.
          </p>
          <Button size="lg" className="hover-scale" onClick={handleSubscribe}>
            View Subscription Plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}