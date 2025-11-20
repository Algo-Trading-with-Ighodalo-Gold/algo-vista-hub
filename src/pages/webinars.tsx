import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Mail, 
  Bell,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  ExternalLink,
  PlayCircle
} from 'lucide-react'

const upcomingWebinars = [
  {
    id: 1,
    title: "Advanced Risk Management Strategies",
    description: "Learn professional risk management techniques used by institutional traders.",
    date: "Coming Soon",
    time: "TBD",
    duration: "60 minutes",
    attendees: "500+",
    level: "Advanced",
    topics: ["Position Sizing", "Drawdown Control", "Portfolio Optimization"],
    instructor: "Dr. Emily Watson",
    status: "upcoming"
  },
  {
    id: 2,
    title: "EA Installation & Optimization Masterclass",
    description: "Complete guide to installing and optimizing Expert Advisors for maximum performance.",
    date: "Coming Soon",
    time: "TBD", 
    duration: "90 minutes",
    attendees: "750+",
    level: "Beginner",
    topics: ["Installation Process", "Parameter Optimization", "Performance Monitoring"],
    instructor: "Ighodalo O.",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Quantitative Analysis Fundamentals",
    description: "Introduction to quantitative methods in algorithmic trading and market analysis.",
    date: "Coming Soon",
    time: "TBD",
    duration: "75 minutes", 
    attendees: "300+",
    level: "Intermediate",
    topics: ["Statistical Analysis", "Backtesting", "Strategy Development"],
    instructor: "Sarah Chen",
    status: "upcoming"
  }
]

const webinarCategories = [
  {
    title: "Trading Strategies",
    icon: TrendingUp,
    description: "Learn proven trading strategies and market analysis techniques",
    count: "12+ Webinars"
  },
  {
    title: "Risk Management", 
    icon: Shield,
    description: "Master risk management and portfolio protection strategies",
    count: "8+ Webinars"
  },
  {
    title: "Technical Analysis",
    icon: BarChart3,
    description: "Advanced technical analysis and chart pattern recognition",
    count: "15+ Webinars"
  },
  {
    title: "Platform Training",
    icon: Zap,
    description: "Expert Advisor installation, configuration, and optimization",
    count: "10+ Webinars"
  }
]

export default function WebinarsPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Trading Webinars
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our expert-led webinars to enhance your trading knowledge and skills. 
            Learn from industry professionals and connect with fellow traders.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="max-w-4xl mx-auto mb-16 bg-gradient-primary/10 border-primary/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Webinars Coming Soon!</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're preparing an exciting lineup of educational webinars featuring our expert team. 
              Stay tuned for announcements about upcoming sessions covering trading strategies, 
              risk management, and platform optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:algotradingwithighodalo@gmail.com?subject=Webinar Notifications', '_blank')}
                className="hover-scale"
              >
                <Bell className="h-4 w-4 mr-2" />
                Get Notified
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://t.me/AlgotradingwithIghodalo', '_blank')}
                className="hover-scale"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Telegram
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webinar Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">What You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {webinarCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{category.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <Badge variant="outline" className="text-xs">{category.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Webinars Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Upcoming Sessions Preview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {webinar.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {webinar.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{webinar.title}</CardTitle>
                  <CardDescription>{webinar.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {webinar.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {webinar.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {webinar.attendees} expected attendees
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Instructor:</span> {webinar.instructor}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Topics Covered:</h5>
                    <div className="flex flex-wrap gap-1">
                      {webinar.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="max-w-2xl mx-auto bg-gradient-primary/5 border-primary/20">
          <CardContent className="pt-8 pb-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to know when we launch our webinar series. 
              Get exclusive access to expert insights and trading strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:algotradingwithighodalo@gmail.com?subject=Webinar Newsletter Subscription', '_blank')}
                className="hover-scale"
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe to Updates
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://t.me/Algotradingwithighodalo', '_blank')}
                className="hover-scale"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

