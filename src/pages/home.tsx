import { Link } from "react-router-dom"
import { ArrowRight, Shield, Users, TrendingUp, Star, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/ui/stats-card"

const features = [
  {
    icon: Shield,
    title: "Secure & Licensed",
    description: "Professional MT5 Expert Advisors with advanced security and licensing system"
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Backtested strategies with verified performance across multiple market conditions"
  },
  {
    icon: Users,
    title: "Expert Development",
    description: "Custom EA development by professional algorithmic trading specialists"
  }
]

const eaShowcase = [
  {
    id: 1,
    name: "Momentum Pro EA",
    description: "Advanced momentum-based trading strategy with dynamic risk management",
    rating: 4.8,
    reviews: 127,
    price: "$299",
    tags: ["EURUSD", "Scalping", "High Frequency"],
    performance: "+234.5%",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Grid Master EA",
    description: "Sophisticated grid trading system with intelligent position sizing",
    rating: 4.6,
    reviews: 89,
    price: "$399",
    tags: ["Multi-Pair", "Grid Trading", "Low Risk"],
    performance: "+186.2%",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Breakout Hunter EA",
    description: "High-precision breakout detection with smart entry and exit logic",
    rating: 4.9,
    reviews: 156,
    price: "$449",
    tags: ["GBPUSD", "Breakout", "Medium Risk"],
    performance: "+312.8%",
    image: "/placeholder.svg"
  }
]

const testimonials = [
  {
    name: "David Chen",
    role: "Professional Trader",
    content: "The EAs from AlgoTrading have transformed my trading. Consistent profits and excellent support.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "Hedge Fund Manager",
    content: "Professional-grade algorithms with transparent backtesting. Exactly what we needed.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Retail Trader",
    content: "Easy to use, well-documented, and profitable. The custom development service is outstanding.",
    rating: 5
  }
]

const stats = [
  {
    title: "Active Traders",
    value: "2,500+",
    description: "Worldwide",
    icon: Users,
    trend: { value: 12, label: "this month", positive: true }
  },
  {
    title: "Total Profit Generated",
    value: "$4.2M+",
    description: "Cumulative returns",
    icon: TrendingUp,
    trend: { value: 8, label: "this quarter", positive: true }
  },
  {
    title: "Success Rate",
    value: "94%",
    description: "Profitable months",
    icon: CheckCircle,
    trend: { value: 2, label: "vs last year", positive: true }
  },
  {
    title: "Expert Advisors",
    value: "15+",
    description: "Available strategies",
    icon: Download,
    trend: { value: 25, label: "new releases", positive: true }
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              🚀 New: Custom EA Development Available
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Professional{" "}
              <span className="text-gradient">Algorithmic Trading</span>{" "}
              Solutions
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              Automate your trading with secure, backtested Expert Advisors for MetaTrader 5. 
              Join thousands of traders generating consistent profits with our proven algorithms.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <Button size="lg" className="text-lg px-8 hover-scale" asChild>
                <Link to="/products">
                  Buy an EA <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 hover-scale" asChild>
                <Link to="/development">Request Custom EA</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              30-day money-back guarantee • Lifetime updates • 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Our Trading Solutions?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional-grade tools built by experts for serious traders
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Traders Worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join a growing community of successful algorithmic traders
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* EA Showcase */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured Expert Advisors
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Proven strategies ready for your portfolio
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                View All EAs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eaShowcase.map((ea) => (
              <Card key={ea.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-subtle" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{ea.name}</CardTitle>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium ml-1">{ea.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          ({ea.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-success">
                      {ea.performance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{ea.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ea.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{ea.price}</span>
                    <Button asChild>
                      <Link to={`/products/${ea.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Traders Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real results from real traders using our Expert Advisors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="text-sm italic mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Automate Your Trading?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of successful traders using our proven algorithmic trading solutions. 
            Start your journey to consistent profits today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/products">
                Browse EAs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/development">Get Custom EA</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}