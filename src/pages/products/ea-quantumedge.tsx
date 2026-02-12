import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, Download, Shield, TrendingUp, Users, CheckCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const equityData = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 10420 },
  { month: 'Mar', value: 10890 },
  { month: 'Apr', value: 11250 },
  { month: 'May', value: 11680 },
  { month: 'Jun', value: 12100 },
  { month: 'Jul', value: 12580 },
  { month: 'Aug', value: 12920 },
  { month: 'Sep', value: 13350 },
  { month: 'Oct', value: 13800 },
  { month: 'Nov', value: 14200 },
  { month: 'Dec', value: 14650 }
]

const reviews = [
  {
    name: "Alexander Petrov",
    rating: 5,
    date: "2024-01-18",
    comment: "QuantumEdge's mean reversion strategy is brilliant. The news filter saved me from major losses during NFP releases. Consistent monthly gains!"
  },
  {
    name: "Lisa Chang", 
    rating: 4,
    date: "2024-01-12",
    comment: "Excellent EA for ranging markets. The reversal signals are very accurate. Only wish it performed better during strong trends."
  },
  {
    name: "Robert Martinez",
    rating: 5,
    date: "2024-01-08",
    comment: "Been running this for 6 months with steady profits. The risk management is conservative but effective. Great for stable growth."
  },
  {
    name: "Jennifer Kim",
    rating: 4,
    date: "2024-01-03",
    comment: "QuantumEdge delivers as promised. The news filter integration is a game-changer for avoiding volatile periods."
  },
  {
    name: "Thomas Mueller",
    rating: 5,
    date: "2023-12-25",
    comment: "Perfect for my conservative trading style. Steady returns without the stress of high-risk strategies. Highly recommended!"
  }
]

const faqs = [
  {
    question: "How does the news filter work?",
    answer: "QuantumEdge integrates with economic calendar APIs to automatically detect high-impact news events. The EA stops trading 15 minutes before and after major announcements to avoid excessive volatility and slippage."
  },
  {
    question: "What currency pairs does it trade?",
    answer: "QuantumEdge is optimized for GBPUSD and AUDUSD pairs, where mean reversion strategies tend to be most effective. It can also work on EURUSD with adjusted settings."
  },
  {
    question: "Is this suitable for small accounts?",
    answer: "Yes, QuantumEdge is designed for conservative growth and works well with accounts as small as $1,000. The recommended lot size is 0.01 per $500 of balance."
  },
  {
    question: "How often does it place trades?",
    answer: "QuantumEdge typically places 2-5 trades per week, focusing on quality over quantity. It waits for clear mean reversion setups with favorable risk/reward ratios."
  },
  {
    question: "Can I customize the risk settings?",
    answer: "Absolutely! The EA includes adjustable risk parameters including lot size, stop loss, take profit, and news filter sensitivity to match your risk tolerance."
  }
]

export default function EAQuantumEdgePage() {
  const navigate = useNavigate()
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubscribe = () => {
    navigate('/payment', { state: { product: 'EA QuantumEdge', plan: 'Monthly', price: 29 } })
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">EA QuantumEdge</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Strategy
                </Badge>
                <Badge variant="outline">Mean Reversion</Badge>
                <Badge variant="outline">News Filter</Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                EA QuantumEdge
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                Advanced mean-reversion strategy with intelligent news filters and conservative risk management. Designed for GBPUSD and AUDUSD with steady, consistent growth.
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
                <Badge variant="secondary" className="text-success">+146% Profit</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-sm font-medium text-primary mb-2">One-Time Purchase</div>
                    <div className="text-3xl font-bold">$249<span className="text-lg text-muted-foreground line-through ml-2">$349</span></div>
                    <div className="text-sm text-muted-foreground mt-1">Lifetime license • No monthly fees</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Monthly Subscription</div>
                    <div className="text-2xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></div>
                    <div className="text-sm text-muted-foreground mt-1">Cancel anytime • Full access included</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 hover-scale" onClick={() => navigate('/payment', { state: { product: 'EA QuantumEdge', plan: 'Lifetime', price: 249 } })}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Now - $249
                  </Button>
                  <Button size="lg" variant="outline" className="hover-scale" onClick={handleSubscribe}>
                    Subscribe
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Button size="lg" variant="outline" className="flex-1 hover-scale">
                    <Download className="h-4 w-4 mr-2" />
                    Demo Version
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <Card className="p-6">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg">Steady Growth Curve</CardTitle>
                  <CardDescription>Conservative Strategy Results</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={equityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 animate-fade-in">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Description</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      <p>EA QuantumEdge employs a sophisticated mean-reversion strategy that capitalizes on price extremes and market corrections. This expert advisor has been designed for traders seeking consistent, low-risk returns with minimal drawdown exposure.</p>
                      
                      <h4>Key Features</h4>
                      <ul>
                        <li>Advanced mean-reversion algorithm with multi-timeframe confirmation</li>
                        <li>Integrated news filter to avoid high-impact economic events</li>
                        <li>Conservative risk management with adjustable parameters</li>
                        <li>Optimized for ranging and sideways markets</li>
                        <li>Real-time market sentiment analysis</li>
                        <li>Compatible with ECN and standard brokers</li>
                      </ul>
                      
                      <h4>Trading Strategy</h4>
                      <p>QuantumEdge identifies overbought and oversold conditions using proprietary oscillators combined with support/resistance levels. The strategy excels in ranging markets and provides steady growth through high-probability reversal trades with controlled risk exposure.</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Performance Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Return</span>
                        <span className="font-medium text-success">+146.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Drawdown</span>
                        <span className="font-medium">-4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">68.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Factor</span>
                        <span className="font-medium">1.89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span className="font-medium">2.12</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Account binding security
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Hardware fingerprinting
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Encrypted license system
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Regular updates included
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={equityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">1,248</div>
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">68.7%</div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">$28.50</div>
                          <div className="text-sm text-muted-foreground">Avg Win</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-destructive">-$15.20</div>
                          <div className="text-sm text-muted-foreground">Avg Loss</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Risk Level</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Recommended Balance</span>
                        <span className="font-medium">$1,000+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Timeframes</span>
                        <span className="font-medium">H1, H4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trading Hours</span>
                        <span className="font-medium">London/NY</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden hover-scale group cursor-pointer">
                    <div className="aspect-video bg-gradient-subtle group-hover:scale-105 transition-transform duration-300" />
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">Screenshot {i}</h3>
                      <p className="text-sm text-muted-foreground">EA QuantumEdge interface and settings</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <span className="text-xl font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {reviews.map((review, index) => (
                    <Card key={index} className="hover-scale">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{review.name}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Get answers to common questions about EA QuantumEdge</p>
          </div>
          
          <div className="max-w-3xl mx-auto animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Start with QuantumEdge?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join conservative traders achieving steady, consistent profits with EA QuantumEdge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale" onClick={handleSubscribe}>
              Subscribe
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale">
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}