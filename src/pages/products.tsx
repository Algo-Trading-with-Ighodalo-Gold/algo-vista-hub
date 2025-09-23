import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, TrendingUp, Shield, Clock, ArrowRight, BarChart3, Target, DollarSign, Timer } from "lucide-react"
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

export default function ProductsPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleViewDetails = (ea: typeof expertAdvisors[0]) => {
    navigate(`/products/${ea.id}`)
  }

  return (
    <div className="min-h-screen relative">
      <CandlestickBackground variant="products" intensity="medium" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-hero font-bold tracking-tight animate-fade-in">
              Expert Advisors
            </h1>
            <p className="mt-4 text-body leading-6 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Professional automated trading solutions designed for every trading style and market condition. 
              Choose from our collection of proven, backtested Expert Advisors to automate your trading strategy.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Secure & Licensed</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>Proven Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-success" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-title font-bold tracking-tight mb-3">Choose Your Trading Strategy</h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Each Expert Advisor is carefully crafted and backtested to deliver consistent performance across different market conditions.
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
                    <span className="text-xs text-muted-foreground">({ea.reviews} reviews)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Pairs: {ea.tradingPairs?.split(',')[0] || 'Various'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">TF: {ea.timeframes?.split(',')[0] || 'Multiple'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">{ea.strategyType || 'Trading'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-success" />
                      <span className="text-success font-medium">{ea.avgMonthlyReturn || 'N/A'}</span>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full hover-scale" 
                      onClick={() => handleViewDetails(ea)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground">
                        Min. Deposit: {ea.minDeposit || 'Contact us'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Trading?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey with professional algorithmic trading. Choose an Expert Advisor that matches your trading style and risk tolerance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleViewDetails(expertAdvisors[1])}>
              Start with Most Popular
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/support">Get Expert Advice</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}