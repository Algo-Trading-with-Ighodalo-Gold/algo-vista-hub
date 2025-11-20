import { CheckCircle, AlertCircle, Clock, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal"

const systemStatus = [
  {
    service: "API Service",
    status: "operational",
    uptime: "99.99%",
    response: "45ms"
  },
  {
    service: "Payment Gateway",
    status: "operational",
    uptime: "99.98%",
    response: "120ms"
  },
  {
    service: "Database",
    status: "operational",
    uptime: "99.99%",
    response: "15ms"
  },
  {
    service: "License Server",
    status: "operational",
    uptime: "99.97%",
    response: "65ms"
  }
]

export default function StatusPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <Activity className="h-16 w-16 text-primary mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">System Status</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground">
                Real-time status of all Algo Trading with Ighodalo services
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <Card className="border-green-500/50 bg-green-500/5 mb-12">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle>All Systems Operational</CardTitle>
                  <CardDescription>Last updated: Just now</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <ScrollReveal direction="up">
            <h2 className="text-2xl font-bold mb-8">Service Status</h2>
          </ScrollReveal>

          <StaggerContainer className="space-y-4">
            {systemStatus.map((item, index) => (
              <StaggerItem key={index} direction="up">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.service}</CardTitle>
                        <CardDescription>Avg response time: {item.response}</CardDescription>
                      </div>
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" /> Operational
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium">{item.uptime}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
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

