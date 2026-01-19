import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowRight, Star, Shield, TrendingUp, BarChart3, Target, DollarSign, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CandlestickBackground } from "@/components/ui/candlestick-background"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/auth-context"
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

export default function ProductDetailPage() {
  const { eaId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ea, setEa] = useState<EaProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!eaId) {
        navigate("/products")
        return
      }
      setLoading(true)
      // Fetch from products table (linked to Cloudflare)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`product_code.eq.${eaId},id.eq.${eaId}`)
        .single()

      if (error || !data) {
        console.error("Failed to load EA product:", error)
        navigate("/products")
        return
      }

      setEa(data)
      setLoading(false)
    }

    fetchProduct()
  }, [eaId, navigate])

  if (loading || !ea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading EA details...</p>
      </div>
    )
  }

  const imageSrc = imageMap[ea.image_key || ""] || goldRushImage
  const rating = Number(ea.rating ?? 5)
  const features = ea.key_features ?? []
  const price = ((ea.price_cents ?? 0) / 100).toFixed(2)

  const handleSubscribe = () => {
    if (user) {
      navigate("/dashboard/checkout", {
        state: {
          productId: ea.id,
          productCode: ea.product_code,
          productName: ea.name,
          price: Number(price),
          features,
        },
      });
    } else {
      navigate("/auth/login", {
        state: { 
          from: `/products/${ea.product_code}`,
          redirectTo: "/dashboard/checkout",
          productData: {
            productId: ea.id,
            productCode: ea.product_code,
            productName: ea.name,
            price: Number(price),
            features,
          }
        },
      });
    }
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
                {ea.risk_level && <Badge variant="outline">{ea.risk_level}</Badge>}
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
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({ea.reviews ?? 0} reviews)</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full lg:w-auto hover-scale" 
                onClick={handleSubscribe}
              >
                Subscribe & Pay with Paystack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={imageSrc} 
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
                    {features.map((feature, index) => (
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
                        <div className="text-muted-foreground">{ea.trading_pairs}</div>
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
                        <div className="text-muted-foreground">{ea.strategy_type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Min. Deposit</div>
                        <div className="text-muted-foreground">{ea.min_deposit}</div>
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
                    <span className="font-medium text-success">{ea.avg_monthly_return}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium">{ea.max_drawdown}</span>
                  </div>
                  {ea.performance && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{ea.performance}</span>
                    </div>
                  )}
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
            Licenses start at {ea.price_label || `$${price}`} — automate your trading with {ea.name}.
          </p>
          <Button size="lg" className="hover-scale" onClick={handleSubscribe}>
            Subscribe & Pay with Paystack
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}