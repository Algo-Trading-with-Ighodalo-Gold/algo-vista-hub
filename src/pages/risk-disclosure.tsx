import { AlertTriangle, Shield, TrendingDown, DollarSign, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal"

const risks = [
  {
    icon: TrendingDown,
    title: "Market Risk",
    description: "Financial markets are volatile and unpredictable. Past performance does not guarantee future results."
  },
  {
    icon: DollarSign,
    title: "Capital Risk",
    description: "Trading involves substantial risk of loss. Only trade with capital you can afford to lose."
  },
  {
    icon: Shield,
    title: "Technical Risk",
    description: "System failures, connectivity issues, and software bugs may affect trading performance."
  },
  {
    icon: Info,
    title: "Regulatory Risk",
    description: "Changes in financial regulations may impact trading activities and strategies."
  }
]

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">Risk Disclosure</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                Important information about trading risks you should be aware of
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-6 w-6" />
                Important Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Trading involves substantial risk of loss and is not suitable for all investors. 
                Past performance is not indicative of future results. You should carefully consider 
                whether trading is suitable for you in light of your circumstances, knowledge, 
                and financial resources.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Risks */}
      <section className="py-20">
        <div className="container">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Key Risks</h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {risks.map((risk, index) => (
              <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card className="h-full">
                  <CardHeader>
                    <risk.icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>{risk.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{risk.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>General Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The information on this platform is for educational purposes only and should not 
                be considered financial advice. Expert Advisors are automated trading systems that 
                execute trades based on predefined algorithms.
              </p>
              <p>
                We do not guarantee the performance or profitability of any trading strategy. 
                Results may vary based on market conditions, broker spreads, and other factors.
              </p>
              <p>
                By using our services, you acknowledge that you understand the risks involved 
                in trading and accept full responsibility for your trading decisions and results.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

