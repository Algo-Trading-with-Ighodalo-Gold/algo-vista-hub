import { BookOpen, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleReveal } from "@/components/ui/scroll-reveal"

const guides = [
  {
    icon: FileText,
    title: "MT5 Setup Guide",
    description: "Complete setup and installation instructions",
    type: "PDF",
    pages: "15 pages",
    downloads: "2.5k"
  },
  {
    icon: FileText,
    title: "EA Installation Tutorial",
    description: "Step-by-step installation guide",
    type: "PDF",
    pages: "12 pages",
    downloads: "5.1k"
  },
  {
    icon: FileText,
    title: "Risk Management Guide",
    description: "Professional risk management strategies",
    type: "PDF",
    pages: "22 pages",
    downloads: "3.2k"
  },
  {
    icon: FileText,
    title: "Strategy Optimization",
    description: "How to optimize your trading strategy",
    type: "PDF",
    pages: "28 pages",
    downloads: "8.7k"
  }
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">Trading Guides</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                Expert guides to help you master algorithmic trading
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {guides.map((guide, index) => (
              <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <CardHeader>
                    <guide.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="outline">{guide.pages}</Badge>
                      <span className="text-sm text-muted-foreground">{guide.downloads} downloads</span>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  )
}

