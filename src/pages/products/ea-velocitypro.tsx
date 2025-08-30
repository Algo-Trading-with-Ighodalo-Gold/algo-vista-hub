import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Star, Download, Shield, TrendingUp, Users, CheckCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const equityData = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 10650 },
  { month: 'Mar', value: 11400 },
  { month: 'Apr', value: 12200 },
  { month: 'May', value: 11950 },
  { month: 'Jun', value: 13100 },
  { month: 'Jul', value: 14300 },
  { month: 'Aug', value: 15200 },
  { month: 'Sep', value: 16800 },
  { month: 'Oct', value: 17500 },
  { month: 'Nov', value: 18900 },
  { month: 'Dec', value: 19750 }
]

const reviews = [
  {
    name: "Marcus Johnson",
    rating: 5,
    date: "2024-01-20",
    comment: "VelocityPro captures trends perfectly! The momentum detection is incredibly accurate. Made 15% last month alone during the trending market."
  },
  {
    name: "Sofia Rodriguez", 
    rating: 4,
    date: "2024-01-14",
    comment: "Excellent for swing trading. The risk controls saved me multiple times during market reversals. Solid EA for trend followers."
  },
  {
    name: "Paul Anderson",
    rating: 5,
    date: "2024-01-09",
    comment: "The momentum algorithms are outstanding. VelocityPro caught every major trend this quarter. Best swing EA I've used."
  },
  {
    name: "Marie Dubois",
    rating: 4,
    date: "2024-01-04",
    comment: "Great performance in trending markets. The risk management features give me peace of mind for larger position sizes."
  },
  {
    name: "Kevin Zhang",
    rating: 5,
    date: "2023-12-30",
    comment: "VelocityPro's swing trading approach is perfect for my style. Catches big moves while avoiding choppy markets. Highly recommended!"
  }
]

const faqs = [
  {
    question: "What makes VelocityPro different from scalping EAs?",
    answer: "VelocityPro focuses on swing trading with larger price movements over days/weeks rather than quick scalps. It captures trending momentum with higher profit targets and longer holding periods for bigger gains per trade."
  },
  {
    question: "How does the momentum detection work?",
    answer: "The EA uses advanced momentum oscillators, trend strength indicators, and volume analysis to identify the start of significant price movements. It waits for confirmation across multiple timeframes before entering trades."
  },
  {
    question: "What are the risk control features?",
    answer: "VelocityPro includes dynamic stop losses that trail with momentum, maximum daily loss limits, correlation filters to avoid overexposure, and position sizing based on account volatility."
  },
  {
    question: "Which currency pairs work best?",
    answer: "VelocityPro is optimized for major trending pairs like GBPJPY, EURJPY, and USDCAD. These pairs typically show strong momentum moves that the EA can capitalize on effectively."
  },
  {
    question: "How long does it hold trades?",
    answer: "Trade duration varies from a few hours to several days depending on momentum strength. The EA uses trailing stops to maximize profits during strong trends and exit quickly when momentum weakens."
  }
]

export default function EAVelocityProPage() {
  const [selectedPlan, setSelectedPlan] = useState("single")
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  const getPlanPrice = () => {
    switch(selectedPlan) {
      case "single": return 99
      case "multi": return 199
      case "lifetime": return 499
      default: return 99
    }
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
            <span className="text-foreground">EA VelocityPro</span>
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
                <Badge variant="outline">Momentum</Badge>
                <Badge variant="outline">Swing Trading</Badge>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                EA VelocityPro
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                Momentum-driven swing EA with advanced risk controls and trend-following algorithms. Designed to capture large price movements in trending markets.
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
                <Badge variant="secondary" className="text-success">+197% Profit</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Plan</label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">1 Account - $99</SelectItem>
                      <SelectItem value="multi">3 Accounts - $199</SelectItem>
                      <SelectItem value="lifetime">Lifetime License - $499</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 hover-scale">
                    Buy Now - ${getPlanPrice()}
                  </Button>
                  <Button size="lg" variant="outline" className="hover-scale">
                    <Download className="h-4 w-4 mr-2" />
                    Demo Version
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <Card className="p-6">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg">Momentum Performance</CardTitle>
                  <CardDescription>Swing Trading Results</CardDescription>
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
                      <p>EA VelocityPro is a sophisticated momentum-driven trading system designed for swing traders who want to capture significant price movements in trending markets. This expert advisor combines advanced momentum detection with comprehensive risk management to deliver consistent long-term growth.</p>
                      
                      <h4>Key Features</h4>
                      <ul>
                        <li>Advanced momentum detection across multiple timeframes</li>
                        <li>Dynamic trailing stops with momentum-based adjustments</li>
                        <li>Comprehensive risk controls and position sizing</li>
                        <li>Trend strength analysis and confirmation filters</li>
                        <li>Correlation monitoring to avoid overexposure</li>
                        <li>Optimized for major trending currency pairs</li>
                      </ul>
                      
                      <h4>Trading Strategy</h4>
                      <p>VelocityPro identifies the beginning of significant momentum moves using proprietary algorithms that analyze trend strength, volume patterns, and market structure. The EA enters trades when multiple momentum indicators align and uses intelligent trailing stops to maximize profit potential during trending phases.</p>
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
                        <span className="font-medium text-success">+197.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Drawdown</span>
                        <span className="font-medium">-12.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">61.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Factor</span>
                        <span className="font-medium">2.63</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span className="font-medium">1.67</span>
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
                          <div className="text-2xl font-bold text-success">892</div>
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">61.4%</div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">$85.40</div>
                          <div className="text-sm text-muted-foreground">Avg Win</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-destructive">-$32.50</div>
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
                        <Badge variant="secondary">Medium-High</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Recommended Balance</span>
                        <span className="font-medium">$3,000+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Timeframes</span>
                        <span className="font-medium">H4, D1</span>
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
                      <p className="text-sm text-muted-foreground">EA VelocityPro interface and settings</p>
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
            <p className="text-lg text-muted-foreground">Get answers to common questions about EA VelocityPro</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Trade with VelocityPro?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join momentum traders capturing significant market moves with EA VelocityPro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale">
              Purchase EA VelocityPro - ${getPlanPrice()}
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