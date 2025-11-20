import { Briefcase, MapPin, Clock, ArrowRight, Users, Zap, Heart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal"

const jobOpenings = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our trading platform infrastructure"
  },
  {
    title: "Quantitative Analyst",
    department: "Research",
    location: "Remote",
    type: "Full-time",
    description: "Develop and optimize trading algorithms"
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create intuitive user experiences for traders"
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    description: "Help traders succeed with our platform"
  }
]

const benefits = [
  { icon: Zap, title: "Flexible Hours", description: "Work when you're most productive" },
  { icon: Users, title: "Remote First", description: "Work from anywhere in the world" },
  { icon: TrendingUp, title: "Growth Opportunities", description: "Advance your career with us" },
  { icon: Heart, title: "Health Benefits", description: "Comprehensive health coverage" }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <Briefcase className="h-16 w-16 text-primary mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">Join Our Team</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                Build the future of algorithmic trading with a passionate team
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Open Positions</h2>
          </ScrollReveal>

          <StaggerContainer className="space-y-6">
            {jobOpenings.map((job, index) => (
              <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{job.department}</CardDescription>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <Badge variant="outline" className="gap-2">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </Badge>
                      <Badge variant="outline" className="gap-2">
                        <Clock className="h-3 w-3" /> {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <Button variant="outline" className="gap-2">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Why Join Us</h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index} direction="up">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-2xl text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold mb-4">Don't See a Role That Fits?</h2>
            <p className="text-muted-foreground mb-8">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="gap-2">
              Send General Application <ArrowRight className="h-4 w-4" />
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}








