import { ArrowRight, Target, Zap, Users, Trophy, TrendingUp, Rocket, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleReveal } from "@/components/ui/scroll-reveal"

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <Badge variant="secondary" className="mb-6">Our Journey</Badge>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">How It All Began</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                From a vision to empower traders to a thriving platform.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <StaggerContainer>
              <StaggerItem direction="right">
                <Card className="p-8 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                      <p className="text-muted-foreground">To democratize algorithmic trading.</p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>

              <StaggerItem direction="left">
                <Card className="p-8 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-xl bg-green-500/10">
                      <Zap className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
                      <p className="text-muted-foreground">To become the world's most trusted platform.</p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Our Impact</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ScaleReveal delay={0.1}>
              <Card className="text-center p-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">50,000+</h3>
                <p className="text-muted-foreground">Active Traders</p>
              </Card>
            </ScaleReveal>

            <ScaleReveal delay={0.2}>
              <Card className="text-center p-8">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">$2.5M+</h3>
                <p className="text-muted-foreground">Profits Generated</p>
              </Card>
            </ScaleReveal>

            <ScaleReveal delay={0.3}>
              <Card className="text-center p-8">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">98%</h3>
                <p className="text-muted-foreground">Success Rate</p>
              </Card>
            </ScaleReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
