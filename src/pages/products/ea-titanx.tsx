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
  { month: 'Feb', value: 10850 },
  { month: 'Mar', value: 11200 },
  { month: 'Apr', value: 12100 },
  { month: 'May', value: 11800 },
  { month: 'Jun', value: 13400 },
  { month: 'Jul', value: 14200 },
  { month: 'Aug', value: 15600 },
  { month: 'Sep', value: 16800 },
  { month: 'Oct', value: 17900 },
  { month: 'Nov', value: 19200 },
  { month: 'Dec', value: 20400 }
]

const reviews = [
  {
    name: "Michael Chen",
    rating: 5,
    date: "2024-01-15",
    comment: "Incredible performance! TitanX has been consistently profitable for 8 months now. The AI-powered entry signals are spot on."
  },
  {
    name: "Sarah Johnson", 
    rating: 5,
    date: "2024-01-10",
    comment: "Best EA I've ever used. The risk management is excellent and the drawdowns are minimal. Highly recommended!"
  },
  {
    name: "David Rodriguez",
    rating: 4,
    date: "2024-01-05",
    comment: "Great EA with solid returns. Setup was easy and support team is very responsive. Only minor issue is it can be aggressive during news events."
  },
  {
    name: "Emma Thompson",
    rating: 5,
    date: "2023-12-28",
    comment: "TitanX transformed my trading completely. The AI analysis is sophisticated and the results speak for themselves."
  },
  {
    name: "James Wilson",
    rating: 4,
    date: "2023-12-20",
    comment: "Solid performance and well-documented. The backtest results match live trading quite well. Worth the investment."
  }
]

const faqs = [
  {
    question: "How do I activate EA TitanX?",
    answer: "After purchase, you'll receive a license key via email. Simply load the EA on your MT5 platform and enter the license key when prompted. The EA will then bind to your account number."
  },
  {
    question: "What are the minimum system requirements?",
    answer: "EA TitanX requires MetaTrader 5, a VPS with at least 1GB RAM, and a stable internet connection. We recommend running on ECN accounts for best results."
  },
  {
    question: "Can I use this on multiple accounts?",
    answer: "The license depends on your selected plan. Single account license works on one MT5 account, while the 3-account license allows use on up to 3 different MT5 accounts."
  },
  {
    question: "What's the recommended lot size?",
    answer: "We recommend starting with 0.01 lots per $1000 of account balance. The EA has built-in money management, but you can adjust risk settings in the inputs."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the EA's performance, contact our support team for a full refund."
  }
]

export default function EATitanXPage() {
  const navigate = useNavigate()
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubscribe = () => {
    navigate('/payment', { state: { product: 'EA TitanX', plan: 'Monthly', price: 29 } })
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
            <span className="text-foreground">EA TitanX</span>
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
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">5-Year Backtest</Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                EA TitanX
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                AI-powered scalping EA with advanced machine learning algorithms and 5-year proven backtest results. Designed for EURUSD scalping with superior risk management.
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
                <Badge variant="secondary" className="text-success">+285% Profit</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-sm font-medium text-primary mb-2">One-Time Purchase</div>
                    <div className="text-3xl font-bold">$299<span className="text-lg text-muted-foreground line-through ml-2">$399</span></div>
                    <div className="text-sm text-muted-foreground mt-1">Lifetime license • No monthly fees</div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Monthly Subscription</div>
                    <div className="text-2xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></div>
                    <div className="text-sm text-muted-foreground mt-1">Cancel anytime • Full access included</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 hover-scale" onClick={() => navigate('/payment', { state: { product: 'EA TitanX', plan: 'Lifetime', price: 299 } })}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Now - $299
                  </Button>
                  <Button size="lg" variant="outline" className="hover-scale" onClick={handleSubscribe}>
                    Subscribe $29/mo
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
                  <CardTitle className="text-lg">5-Year Equity Curve</CardTitle>
                  <CardDescription>Backtest Results (2019-2024)</CardDescription>
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
                      <p>EA TitanX represents the pinnacle of algorithmic trading technology, combining advanced artificial intelligence with proven scalping strategies. This expert advisor has been meticulously developed and backtested over 5 years of historical data, demonstrating consistent profitability across various market conditions.</p>
                      
                      <h4>Key Features</h4>
                      <ul>
                        <li>Advanced AI-powered entry and exit signals</li>
                        <li>Dynamic risk management with adjustable parameters</li>
                        <li>News filter integration to avoid high-impact events</li>
                        <li>Multi-timeframe analysis for precise entries</li>
                        <li>Built-in money management system</li>
                        <li>ECN/Zero spread broker compatibility</li>
                      </ul>
                      
                      <h4>Trading Strategy</h4>
                      <p>TitanX employs a sophisticated scalping strategy that identifies micro-trends in the EURUSD market. The AI engine analyzes multiple technical indicators, price action patterns, and market microstructure to generate high-probability trading signals with minimal drawdown.</p>
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
                        <span className="font-medium text-success">+285.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Drawdown</span>
                        <span className="font-medium">-8.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">73.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Factor</span>
                        <span className="font-medium">2.41</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span className="font-medium">1.85</span>
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
                          <div className="text-2xl font-bold text-success">2,847</div>
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">73.2%</div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">$35.20</div>
                          <div className="text-sm text-muted-foreground">Avg Win</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-destructive">-$14.80</div>
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
                        <Badge variant="secondary">Medium</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Recommended Balance</span>
                        <span className="font-medium">$5,000+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Timeframes</span>
                        <span className="font-medium">M1, M5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trading Hours</span>
                        <span className="font-medium">24/5</span>
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
                      <p className="text-sm text-muted-foreground">EA TitanX interface and settings</p>
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
            <p className="text-lg text-muted-foreground">Get answers to common questions about EA TitanX</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading with TitanX?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders using EA TitanX. Start your journey to consistent profits today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale" onClick={handleSubscribe}>
              Subscribe to EA TitanX
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