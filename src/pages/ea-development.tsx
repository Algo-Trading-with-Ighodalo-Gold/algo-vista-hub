import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, FileText, CheckCircle, Clock, Shield, Zap, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EADevelopmentPage() {
  const navigate = useNavigate()

  const handleStartProject = () => {
    navigate('/dashboard/ea-development')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Custom Development
              </Badge>
              <Badge variant="outline">Expert Advisors</Badge>
              <Badge variant="outline">Trading Bots</Badge>
            </div>
            
            <h1 className="font-bold tracking-tight text-hero">
              Professional EA Development
            </h1>
            
            <p className="mt-6 text-body leading-7 text-muted-foreground max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Transform your trading strategy into a profitable automated system. Our expert developers create custom Expert Advisors tailored to your specific requirements with proven results.
            </p>

            <div className="pt-8">
              <Button size="lg" onClick={handleStartProject} className="hover-scale">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our EA Development?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine years of trading experience with cutting-edge programming expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Strategy Analysis</h3>
                <p className="text-muted-foreground">
                  We thoroughly analyze your trading strategy and optimize it for automation, ensuring maximum profitability and minimal risk.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Development</h3>
                <p className="text-muted-foreground">
                  Most projects are completed within 1-4 weeks with regular updates and milestone reviews to ensure your satisfaction.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-scale">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Full Support</h3>
                <p className="text-muted-foreground">
                  Ongoing support, updates, and optimization to ensure your EA continues to perform at its best in changing markets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Development Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven 4-step process that ensures your EA meets your exact requirements
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Strategy Review",
                description: "We analyze your trading strategy and identify optimization opportunities"
              },
              {
                step: "02", 
                title: "Development",
                description: "Our experts code your EA using best practices and robust architecture"
              },
              {
                step: "03",
                title: "Testing",
                description: "Rigorous backtesting and forward testing to ensure reliability"
              },
              {
                step: "04",
                title: "Delivery",
                description: "Complete EA with documentation, installation guide, and ongoing support"
              }
            ].map((item) => (
              <Card key={item.step} className="relative">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-lg font-medium">EAs Developed</div>
              <div className="text-sm text-muted-foreground">Custom Expert Advisors created for clients worldwide</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="text-lg font-medium">Client Satisfaction</div>
              <div className="text-sm text-muted-foreground">Clients are satisfied with our development service</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2 Weeks</div>
              <div className="text-lg font-medium">Average Delivery</div>
              <div className="text-sm text-muted-foreground">Most projects completed within this timeframe</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Automate Your Trading?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of successful traders who have automated their strategies with our custom EA development service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleStartProject} className="hover-scale">
                <Users className="mr-2 h-5 w-5" />
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}