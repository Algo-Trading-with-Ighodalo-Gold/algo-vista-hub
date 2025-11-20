import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Award, 
  TrendingUp, 
  Code, 
  BarChart3, 
  Shield,
  Mail,
  Linkedin,
  Twitter,
  Github,
  ExternalLink
} from 'lucide-react'

const teamMembers = [
  {
    id: 1,
    name: "Ighodalo O.",
    role: "Founder & Lead Developer",
    bio: "Algorithmic trading expert with 8+ years of experience in forex markets. Specializes in high-frequency trading strategies and risk management systems.",
    image: "/api/placeholder/200/200",
    skills: ["Algorithm Development", "Risk Management", "Market Analysis", "Python", "MQL5"],
    experience: "8+ Years",
    achievements: ["$4.2M+ Generated Returns", "94% Success Rate", "2,500+ Active Traders"],
    social: {
      email: "algotradingwithighodalo@gmail.com",
      linkedin: "https://linkedin.com/in/ighodalo",
      twitter: "https://twitter.com/ALG0_TRADING"
    }
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Senior Quantitative Analyst",
    bio: "PhD in Financial Mathematics with expertise in statistical arbitrage and machine learning applications in trading.",
    image: "/api/placeholder/200/200",
    skills: ["Quantitative Analysis", "Machine Learning", "Statistical Modeling", "R", "Python"],
    experience: "6+ Years",
    achievements: ["Published Researcher", "Risk Model Architect", "Backtesting Expert"],
    social: {
      email: "sarah@algotradingwithighodalo.com",
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen"
    }
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    role: "Lead Software Engineer",
    bio: "Full-stack developer specializing in trading platforms and real-time data processing systems.",
    image: "/api/placeholder/200/200",
    skills: ["Full-Stack Development", "Real-time Systems", "Database Design", "TypeScript", "Node.js"],
    experience: "7+ Years",
    achievements: ["Platform Architect", "Performance Optimizer", "Security Specialist"],
    social: {
      email: "marcus@algotradingwithighodalo.com",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      github: "https://github.com/marcusrodriguez"
    }
  },
  {
    id: 4,
    name: "Dr. Emily Watson",
    role: "Risk Management Director",
    bio: "Former investment banker with expertise in portfolio risk assessment and regulatory compliance.",
    image: "/api/placeholder/200/200",
    skills: ["Risk Assessment", "Portfolio Management", "Compliance", "Financial Modeling", "Regulatory"],
    experience: "10+ Years",
    achievements: ["CFA Charterholder", "Risk Management Expert", "Compliance Leader"],
    social: {
      email: "emily@algotradingwithighodalo.com",
      linkedin: "https://linkedin.com/in/emilywatson"
    }
  },
  {
    id: 5,
    name: "Alex Kim",
    role: "Customer Success Manager",
    bio: "Dedicated to ensuring trader success through comprehensive support and educational resources.",
    image: "/api/placeholder/200/200",
    skills: ["Customer Support", "Training", "Documentation", "Community Management", "Analytics"],
    experience: "5+ Years",
    achievements: ["Customer Satisfaction Leader", "Training Specialist", "Community Builder"],
    social: {
      email: "alex@algotradingwithighodalo.com",
      linkedin: "https://linkedin.com/in/alexkim"
    }
  },
  {
    id: 6,
    name: "David Thompson",
    role: "DevOps Engineer",
    bio: "Infrastructure specialist ensuring 99.9% uptime for our trading systems and platforms.",
    image: "/api/placeholder/200/200",
    skills: ["DevOps", "Cloud Infrastructure", "Monitoring", "Security", "Automation"],
    experience: "6+ Years",
    achievements: ["99.9% Uptime", "Security Expert", "Automation Specialist"],
    social: {
      email: "david@algotradingwithighodalo.com",
      linkedin: "https://linkedin.com/in/davidthompson",
      github: "https://github.com/davidthompson"
    }
  }
]

const stats = [
  { label: "Team Members", value: "6", icon: Users },
  { label: "Combined Experience", value: "42+ Years", icon: Award },
  { label: "Active Traders", value: "2,500+", icon: TrendingUp },
  { label: "Success Rate", value: "94%", icon: BarChart3 }
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our diverse team of experts combines decades of experience in algorithmic trading, 
            quantitative analysis, and software development to deliver cutting-edge solutions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.role}
                </CardDescription>
                <Badge variant="outline" className="w-fit mx-auto">
                  {member.experience}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
                
                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Key Achievements
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {member.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-2 pt-2">
                  {member.social.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`mailto:${member.social.email}`, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  )}
                  {member.social.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.social.linkedin, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Linkedin className="h-3 w-3" />
                    </Button>
                  )}
                  {member.social.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.social.twitter, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Twitter className="h-3 w-3" />
                    </Button>
                  )}
                  {member.social.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.social.github, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Github className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Work With Us?</h3>
              <p className="text-muted-foreground mb-6">
                Join our team of experts and help shape the future of algorithmic trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open('mailto:algotradingwithighodalo@gmail.com', '_blank')}
                  className="hover-scale"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/careers', '_blank')}
                  className="hover-scale"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Careers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

