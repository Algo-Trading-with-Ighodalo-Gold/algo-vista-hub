import { Link } from "react-router-dom"
import { ArrowRight, Shield, Users, TrendingUp, Star, Download, CheckCircle, MessageCircle, Code, Zap, Trophy, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/ui/stats-card"
import { FloatingIcon, GlowingOrb, MagneticButton } from "@/components/ui/interactive-elements"
import { FloatingDots } from "@/components/ui/floating-background"
import { getFeaturedEAs } from "@/data/expert-advisors"

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

// Get featured EAs from shared data
const eaShowcase = getFeaturedEAs()

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
            <h1 className="text-hero font-bold tracking-tight animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Professional{" "}
              <span className="text-gradient bg-gradient-trading">Algorithmic Trading</span>{" "}
              Solutions
            </h1>
            <p className="mt-4 text-body leading-6 text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              Automate your trading with secure, backtested Expert Advisors for MetaTrader 5. 
              Join thousands of traders generating consistent profits with our proven algorithms.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <MagneticButton>
                <Button size="lg" variant="premium" className="px-8" asChild>
                  <Link to="/auth/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="lg" variant="hero" className="px-8" asChild>
                  <Link to="/auth/login">
                    Sign In <Sparkles className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
            </div>
            <p className="mt-4 text-lg text-muted-foreground animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              30-day money-back guarantee • Lifetime updates • 24/7 support
            </p>
            <div className="mt-6 animate-fade-in [animation-delay:1s] opacity-0 [animation-fill-mode:forwards]">
              <Button variant="outline" size="sm" className="hover-scale" asChild>
                <a href="https://t.me/alg0tradingwithighodalo" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Our Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl animate-fade-in">
              Why Choose Our Trading Solutions?
            </h2>
            <p className="mt-3 text-base text-muted-foreground animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Professional-grade tools built by experts for serious traders
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover-scale transition-all duration-300 animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.4 + index * 0.2}s` }}>
                <CardHeader>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg gradient-trading transition-transform duration-300 hover:scale-110 shadow-glow">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg transition-colors duration-300 hover:text-primary">{feature.title}</CardTitle>
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
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl animate-fade-in">
              Trusted by Traders Worldwide
            </h2>
            <p className="mt-3 text-base text-muted-foreground animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Join a growing community of successful algorithmic traders
            </p>
            <div className="mt-6 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
              <Button variant="default" className="hover-scale" asChild>
                <a href="https://t.me/alg0tradingwithighodalo" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Our Telegram Community
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${0.4 + index * 0.15}s` }}>
                <StatsCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EA Showcase */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Featured Expert Advisors
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Proven strategies ready for your portfolio
              </p>
            </div>
            <Button variant="outline" className="hover-scale animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]" asChild>
              <Link to="/products">
                View All EAs <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eaShowcase.map((ea, index) => (
              <Card key={ea.id} className="overflow-hidden hover:shadow-xl hover-scale transition-all duration-500 animate-fade-in opacity-0 [animation-fill-mode:forwards] group gradient-border shadow-trading" style={{ animationDelay: `${0.4 + index * 0.2}s` }}>
                <div className="aspect-video bg-gradient-trading transition-all duration-300 group-hover:scale-105 overflow-hidden rounded-lg">
                  <img 
                    src={ea.image} 
                    alt={ea.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary">{ea.name}</CardTitle>
                      <div className="flex items-center mt-2">
                        <Star className="h-3 w-3 fill-warning text-warning transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-xs font-medium ml-1">{ea.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({ea.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-success transition-transform duration-300 group-hover:scale-105 gradient-success text-xs px-2 py-1">
                      {ea.performance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3 text-sm">{ea.shortDescription}</CardDescription>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ea.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{ea.price}</span>
                    <Button size="sm" className="hover-scale gradient-trading border-0 text-xs px-3 py-1" asChild>
                      <Link to={`/products/ea-${ea.id.replace('-ea', '')}`}>View Details</Link>
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
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl animate-fade-in">
              What Our Traders Say
            </h2>
            <p className="mt-3 text-base text-muted-foreground animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Real results from real traders using our Expert Advisors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full hover:shadow-lg hover-scale transition-all duration-300 animate-fade-in opacity-0 [animation-fill-mode:forwards] group" style={{ animationDelay: `${0.4 + index * 0.2}s` }}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning transition-transform duration-300 group-hover:scale-110" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <blockquote className="text-sm italic mb-4 transition-colors duration-300 group-hover:text-primary">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold transition-colors duration-300 group-hover:text-primary">{testimonial.name}</div>
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
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-3 animate-fade-in">
            Ready to Automate Your Trading?
          </h2>
          <p className="text-base opacity-90 max-w-2xl mx-auto mb-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            Join thousands of successful traders using our proven algorithmic trading solutions. 
            Start your journey to consistent profits today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
            <Button size="lg" variant="secondary" className="text-base px-6 hover-scale shadow-glow" asChild>
              <Link to="/products">
                Browse EAs <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-scale" asChild>
              <Link to="/ea-development">Get Custom EA</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}