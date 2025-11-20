import { Newspaper, Download, Calendar, FileText, Image as ImageIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal"

const pressReleases = [
  {
    date: "2024-03-15",
    title: "Algo Trading with Ighodalo Launches Revolutionary AI-Powered Trading Platform",
    description: "New platform features advanced machine learning algorithms"
  },
  {
    date: "2024-02-10",
    title: "Platform Reaches 50,000 Active Users Milestone",
    description: "Community grows rapidly as traders embrace algorithmic trading"
  },
  {
    date: "2024-01-05",
    title: "Partnership with MetaQuotes Software",
    description: "Strategic partnership enhances platform capabilities"
  }
]

export default function PressPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">Press & Media</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                Stay updated with our latest news, press releases, and media resources
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Press Releases</h2>
          </ScrollReveal>

          <StaggerContainer className="space-y-6">
            {pressReleases.map((release, index) => (
              <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{release.title}</CardTitle>
                        <CardDescription>{release.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="gap-2">
                        <Calendar className="h-3 w-3" /> {release.date}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">Read More</Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Media Kit</h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Brand Guidelines", desc: "Download" },
              { icon: ImageIcon, title: "Logo Assets", desc: "Download" },
              { icon: FileText, title: "Company Overview", desc: "Download" }
            ].map((item, index) => (
              <StaggerItem key={index} direction="up">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> {item.desc}
                  </Button>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container max-w-2xl text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-muted-foreground mb-8">
              For press inquiries, please contact our media team
            </p>
            <Button size="lg" className="gap-2">
              <Mail className="h-4 w-4" /> press@algotradingwithighodalo.com
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

