import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, TrendingUp, Shield, Clock, ArrowRight, BarChart3, Target, DollarSign, Timer } from "lucide-react"
import { CandlestickBackground } from "@/components/ui/candlestick-background"
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleReveal } from "@/components/ui/scroll-reveal"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

import goldRushImage from "@/assets/gold-rush-ea.jpg"
import trendRiderImage from "@/assets/trend-rider-ea.jpg"
import gridTraderImage from "@/assets/grid-trader-ea.jpg"

// Use products table (linked to Cloudflare)
type EaProduct = {
  id: string
  name: string
  product_code: string
  description?: string | null
  short_description?: string | null
  price_cents?: number | null
  version?: string | null
  is_active?: boolean | null
  key_features?: string[] | null
  trading_pairs?: string | null
  timeframes?: string | null
  strategy_type?: string | null
  min_deposit?: string | null
  avg_monthly_return?: string | null
  max_drawdown?: string | null
  performance?: string | null
  image_key?: string | null
  rating?: number | null
  reviews?: number | null
  created_at?: string | null
  updated_at?: string | null
}

const imageMap: Record<string, string> = {
  "gold-milker": goldRushImage,
  "belema-sfp": trendRiderImage,
  "bb-martingale": gridTraderImage,
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<EaProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      // Fetch from products table (linked to Cloudflare)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name")

      if (error) {
        console.error("Failed to load EA products:", error)
        setProducts([])
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const handleViewDetails = (ea: EaProduct) => {
    navigate(`/products/${ea.product_code}`)
  }

  const displayedProducts = loading ? [] : products

  return (
    <div className="min-h-screen relative">
      <CandlestickBackground variant="products" intensity="medium" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-hero">
              Expert Advisors
            </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p className="mt-6 text-body leading-7 text-muted-foreground max-w-2xl mx-auto">
              Professional automated trading solutions designed for every trading style and market condition. 
              Choose from our collection of proven, backtested Expert Advisors to automate your trading strategy.
            </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-body text-muted-foreground">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="text-title">Choose Your Trading Strategy</h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p className="mt-4 text-body text-muted-foreground max-w-2xl mx-auto">
              Each Expert Advisor is carefully crafted and backtested to deliver consistent performance across different market conditions.
            </p>
            </ScrollReveal>
          </div>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading real-time products...</p>
          ) : (
          <StaggerContainer className="responsive-grid-3 gap-8">
            {displayedProducts.map((ea, index) => {
              const imageSrc = imageMap[ea.image_key || ""] || goldRushImage
              const ratingValue = Number(ea.rating ?? 5)
              const tradingPairsDisplay = ea.trading_pairs?.split(",")[0]?.trim() || "Various"
              const timeframeDisplay = ea.timeframes?.split(",")[0]?.trim() || "Multiple"

              return (
              <StaggerItem key={ea.id} direction={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'up' : 'right'}>
                <Card className="group card-hover">
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-gradient-subtle rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={imageSrc} 
                      alt={ea.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardTitle className="text-heading group-hover:text-primary transition-colors">
                    {ea.name}
                  </CardTitle>
                  <CardDescription className="text-body">{ea.short_description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(ratingValue) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{ratingValue.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({ea.reviews ?? 0} reviews)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Pairs: {tradingPairsDisplay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">TF: {timeframeDisplay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">{ea.strategy_type || 'Trading'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-success" />
                      <span className="text-success font-medium">{ea.avg_monthly_return || 'N/A'}</span>
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
                        Min. Deposit: {ea.min_deposit || 'Contact us'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </StaggerItem>
            )})}
          </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-title mb-4">Ready to Automate Your Trading?</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey with professional algorithmic trading. Choose an Expert Advisor that matches your trading style and risk tolerance.
          </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-hover" 
              disabled={!displayedProducts.length}
              onClick={() => displayedProducts[0] && handleViewDetails(displayedProducts[0])}
            >
              Start with Most Popular
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="btn-hover" asChild>
              <a href="/support">Get Expert Advice              </a>
            </Button>
          </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}