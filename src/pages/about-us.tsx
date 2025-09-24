import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users,
  Target,
  Award,
  TrendingUp,
  Clock,
  Shield,
  Mail,
  ArrowRight
} from 'lucide-react'

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-6 animate-fade-in">
        <h1 className="text-display font-bold text-gradient">
          About Algo Trading with Ighodalo
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Empowering traders worldwide with cutting-edge algorithmic trading solutions. 
          We combine advanced technology with proven trading strategies to deliver consistent results.
        </p>
        <Badge variant="outline" className="text-caption">
          Trusted by 10,000+ Traders Worldwide
        </Badge>
      </section>

      {/* Our Story */}
      <section className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-hero font-bold">Our Story</h2>
            <p className="text-body text-muted-foreground">
              Founded in 2020 by experienced traders and software engineers, Algo Trading with Ighodalo 
              was born from a simple vision: to democratize advanced trading strategies through technology.
            </p>
            <p className="text-body text-muted-foreground">
              After years of manual trading and witnessing the potential of algorithmic solutions, 
              our team decided to create Expert Advisors (EAs) that could perform consistently 
              in various market conditions while managing risk effectively.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              4+ Years Experience
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              85% Win Rate
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Risk Management Focus
            </Badge>
          </div>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body text-muted-foreground">
              To provide retail traders with institutional-grade algorithmic trading tools 
              that are accessible, reliable, and profitable.
            </p>
            <ul className="space-y-2 text-caption">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                Eliminate emotional trading decisions
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                Provide 24/7 market monitoring
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                Maximize profit while minimizing risk
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                Deliver consistent performance
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Values */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <div className="text-center">
          <h2 className="text-hero font-bold mb-4">Our Core Values</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do, from product development to customer support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Transparency",
              description: "Open communication about performance, risks, and strategies"
            },
            {
              icon: Award,
              title: "Excellence",
              description: "Continuous improvement and innovation in our trading solutions"
            },
            {
              icon: Users,
              title: "Community",
              description: "Building a supportive network of successful algorithmic traders"
            },
            {
              icon: TrendingUp,
              title: "Results",
              description: "Focus on delivering measurable and consistent trading outcomes"
            }
          ].map((value, index) => (
            <Card key={value.title} className="text-center hover:shadow-lg transition-shadow hover-scale">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-heading">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-caption text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">10,000+</div>
                <p className="text-caption opacity-90">Active Users</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">$50M+</div>
                <p className="text-caption opacity-90">Assets Under Management</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">85%</div>
                <p className="text-caption opacity-90">Average Win Rate</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">24/7</div>
                <p className="text-caption opacity-90">Customer Support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-hero font-bold">Ready to Start Your Journey?</h2>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Join thousands of traders who have transformed their trading with our algorithmic solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="hover-scale">
            <Mail className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
          <Button variant="outline" size="lg" className="hover-scale">
            View Our Products
          </Button>
        </div>
      </section>
    </div>
  )
}