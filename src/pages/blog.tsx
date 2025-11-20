import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Mail,
  Bell,
  ExternalLink,
  FileText,
  Tag,
  Eye
} from 'lucide-react'

const blogCategories = [
  {
    title: "Trading Strategies",
    icon: TrendingUp,
    description: "In-depth analysis of proven trading strategies and market approaches",
    count: "25+ Articles",
    color: "text-green-600"
  },
  {
    title: "Risk Management", 
    icon: Shield,
    description: "Essential risk management techniques and portfolio protection",
    count: "18+ Articles",
    color: "text-red-600"
  },
  {
    title: "Market Analysis",
    icon: BarChart3,
    description: "Weekly market insights and technical analysis breakdowns",
    count: "40+ Articles",
    color: "text-blue-600"
  },
  {
    title: "Platform Guides",
    icon: Zap,
    description: "Step-by-step guides for EA installation and optimization",
    count: "15+ Articles",
    color: "text-purple-600"
  },
  {
    title: "Success Stories",
    icon: User,
    description: "Real trader experiences and case studies",
    count: "12+ Articles",
    color: "text-orange-600"
  },
  {
    title: "Technical Analysis",
    icon: FileText,
    description: "Advanced chart patterns and technical indicators",
    count: "30+ Articles",
    color: "text-indigo-600"
  }
]

const upcomingPosts = [
  {
    id: 1,
    title: "The Complete Guide to Scalping Strategies in 2024",
    excerpt: "Master the art of scalping with our comprehensive guide covering entry points, risk management, and profit optimization techniques.",
    category: "Trading Strategies",
    readTime: "12 min read",
    author: "Ighodalo O.",
    publishDate: "Coming Soon",
    tags: ["Scalping", "High Frequency", "Risk Management"],
    status: "upcoming"
  },
  {
    id: 2,
    title: "Risk Management: Protecting Your Capital in Volatile Markets",
    excerpt: "Learn essential risk management principles that every trader must know to protect their capital and ensure long-term success.",
    category: "Risk Management",
    readTime: "15 min read",
    author: "Dr. Emily Watson",
    publishDate: "Coming Soon",
    tags: ["Risk Management", "Capital Protection", "Volatility"],
    status: "upcoming"
  },
  {
    id: 3,
    title: "EA Performance Optimization: Maximizing Your Trading Results",
    excerpt: "Discover advanced techniques to optimize your Expert Advisor performance and achieve consistent profitable results.",
    category: "Platform Guides",
    readTime: "18 min read",
    author: "Sarah Chen",
    publishDate: "Coming Soon",
    tags: ["EA Optimization", "Performance", "Backtesting"],
    status: "upcoming"
  },
  {
    id: 4,
    title: "Market Analysis: EURUSD Weekly Outlook and Trading Opportunities",
    excerpt: "Detailed technical and fundamental analysis of EURUSD with actionable trading opportunities and risk assessment.",
    category: "Market Analysis",
    readTime: "10 min read",
    author: "Marcus Rodriguez",
    publishDate: "Coming Soon",
    tags: ["EURUSD", "Technical Analysis", "Fundamental Analysis"],
    status: "upcoming"
  }
]

const featuredTopics = [
  {
    title: "Algorithmic Trading Fundamentals",
    description: "Everything you need to know about automated trading systems",
    articles: "8 articles",
    icon: Zap
  },
  {
    title: "MetaTrader 5 Mastery",
    description: "Complete guide to MT5 platform and Expert Advisors",
    articles: "12 articles", 
    icon: BarChart3
  },
  {
    title: "Psychology of Trading",
    description: "Master the mental aspects of successful trading",
    articles: "6 articles",
    icon: User
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Trading Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest insights, strategies, and market analysis from our expert team. 
            Learn from real experiences and enhance your trading knowledge.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="max-w-4xl mx-auto mb-16 bg-gradient-primary/10 border-primary/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Blog Coming Soon!</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're preparing an extensive collection of trading articles, market analysis, 
              and educational content. Our expert team is working on comprehensive guides 
              that will help you become a better trader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:algotradingwithighodalo@gmail.com?subject=Blog Notifications', '_blank')}
                className="hover-scale"
              >
                <Bell className="h-4 w-4 mr-2" />
                Get Notified
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://t.me/Algotradingwithighodalo', '_blank')}
                className="hover-scale"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Telegram
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blog Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Content Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{category.title}</h4>
                      <Badge variant="outline" className="text-xs">{category.count}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Topics */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Featured Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <topic.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">{topic.articles}</Badge>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Posts Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Upcoming Articles Preview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {post.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.publishDate}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Tags:</h5>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <Eye className="h-4 w-4 mr-2" />
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
            <h3 className="text-2xl font-bold mb-4">Stay Informed</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and be the first to read our latest articles, 
              market analysis, and trading insights from our expert team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:algotradingwithighodalo@gmail.com?subject=Blog Newsletter Subscription', '_blank')}
                className="hover-scale"
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe to Blog
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

