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

      {/* Meet the Team */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
        <div className="text-center">
          <h2 className="text-hero font-bold mb-4">Meet the Team</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Our dedicated team of experts brings together decades of experience in trading, 
            software development, and financial markets.
          </p>
        </div>

        {/* Team Image */}
        <div className="flex justify-center">
          <Card className="max-w-4xl overflow-hidden">
            <CardContent className="p-0">
              <img 
                src="/src/assets/meet-the-team.jpg" 
                alt="Meet the Team - Ighodalo Gold, Michael King, and Alabi Esther"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'block'
                }}
              />
              {/* Fallback content if image is not available */}
              <div className="hidden p-8 text-center bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <h3 className="text-2xl font-bold mb-6 text-yellow-300">Meet the Team</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
                      IG
                    </div>
                    <h4 className="font-bold text-lg">Ighodalo Gold</h4>
                    <p className="text-sm opacity-90">Expert EA Architect & Client Strategy Lead</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      MK
                    </div>
                    <h4 className="font-bold text-lg">Michael King</h4>
                    <p className="text-sm opacity-90">EA Performance Analyst & Growth Strategist</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
                      AE
                    </div>
                    <h4 className="font-bold text-lg">Alabi Esther</h4>
                    <p className="text-sm opacity-90">Web Developer & Automation Integrator</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Details */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Ighodalo Gold",
              role: "Expert EA Architect & Client Strategy Lead",
              description: "With over 5 years of experience in algorithmic trading, Ighodalo leads our EA development and client strategy initiatives.",
              expertise: ["EA Development", "Strategy Design", "Client Relations"]
            },
            {
              name: "Michael King", 
              role: "EA Performance Analyst & Growth Strategist",
              description: "Michael specializes in performance analysis and growth strategies, ensuring our EAs deliver consistent results.",
              expertise: ["Performance Analysis", "Risk Management", "Growth Strategy"]
            },
            {
              name: "Alabi Esther",
              role: "Web Developer & Automation Integrator", 
              description: "Esther handles our web development and automation integration, creating seamless user experiences.",
              expertise: ["Web Development", "Automation", "User Experience"]
            }
          ].map((member, index) => (
            <Card key={member.name} className="text-center hover:shadow-lg transition-shadow hover-scale">
              <CardHeader>
                <CardTitle className="text-heading">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-caption text-muted-foreground">
                  {member.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
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
      <section className="animate-fade-in [animation-delay:0.7s] opacity-0 [animation-fill-mode:forwards]">
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
      <section className="text-center space-y-6 animate-fade-in [animation-delay:0.9s] opacity-0 [animation-fill-mode:forwards]">
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