import { Link } from "react-router-dom"
import { ArrowLeft, FileText, AlertTriangle, Shield, CreditCard, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <section className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4">
              <FileText className="h-3 w-3 mr-1" />
              Legal Agreement
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Legal terms and conditions for using our algorithmic trading platform
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> By using our services, you agree to these terms. 
                Trading involves substantial risk and is not suitable for all investors.
              </AlertDescription>
            </Alert>

            <div className="grid gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Service Agreement
                  </CardTitle>
                  <CardDescription>
                    These terms govern your use of our Expert Advisor software and platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Acceptance of Terms</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      By accessing our platform, purchasing our products, or using our services, 
                      you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• You must be at least 18 years old to use our services</li>
                      <li>• You must have the legal capacity to enter into binding agreements</li>
                      <li>• You are responsible for compliance with local trading regulations</li>
                      <li>• You acknowledge the risks associated with algorithmic trading</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    License & Usage Rights
                  </CardTitle>
                  <CardDescription>
                    Your rights and restrictions when using our Expert Advisor software.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Software License</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We grant you a limited, non-exclusive, non-transferable license to use our 
                      Expert Advisor software subject to these terms:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• One license per MT5 account number</li>
                      <li>• License is tied to your hardware fingerprint for security</li>
                      <li>• No reverse engineering, decompiling, or modification</li>
                      <li>• No redistribution or sharing of software files</li>
                      <li>• License expires based on your subscription plan</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Permitted Use</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Personal or commercial trading on licensed accounts</li>
                      <li>• Running EA on VPS or personal computer</li>
                      <li>• Accessing updates and support during subscription period</li>
                      <li>• Using performance analytics and monitoring tools</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Prohibited Activities</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Sharing license keys or software files</li>
                      <li>• Attempting to bypass license validation</li>
                      <li>• Using the software for illegal activities</li>
                      <li>• Exploiting vulnerabilities or bugs for profit</li>
                      <li>• Creating derivative works or competing products</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment & Billing
                  </CardTitle>
                  <CardDescription>
                    Terms related to payments, subscriptions, and refunds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Subscription Plans</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Monthly and annual subscription options available</li>
                      <li>• Automatic renewal unless cancelled before billing date</li>
                      <li>• Pro-rated charges for plan upgrades</li>
                      <li>• Access continues until end of current billing period</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Payment Processing</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Secure payment processing through Stripe</li>
                      <li>• All prices are in USD unless otherwise specified</li>
                      <li>• You are responsible for all applicable taxes</li>
                      <li>• Failed payments may result in service suspension</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Refund Policy</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 30-day money-back guarantee on first purchase</li>
                      <li>• Refunds processed within 5-10 business days</li>
                      <li>• No refunds for partial months or cancellations</li>
                      <li>• Custom development work has separate refund terms</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Risk Disclosure
                  </CardTitle>
                  <CardDescription>
                    Important information about trading risks and disclaimers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>High Risk Warning:</strong> Trading foreign exchange and CFDs involves 
                      substantial risk and may result in loss of invested capital.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Trading Risks</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Past performance is not indicative of future results</li>
                      <li>• Algorithmic trading can amplify both gains and losses</li>
                      <li>• Market conditions can change rapidly</li>
                      <li>• Technical failures may impact trading performance</li>
                      <li>• You may lose more than your initial investment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">No Investment Advice</h3>
                    <p className="text-sm text-muted-foreground">
                      Our software and services do not constitute investment advice. 
                      We do not provide recommendations about whether to buy, sell, or hold 
                      any financial instruments. You are solely responsible for your trading decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                  <CardDescription>
                    Important limitations on our liability and your remedies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Disclaimer of Warranties</p>
                    <p className="text-sm text-muted-foreground">
                      Our software is provided "as is" without warranties of any kind. 
                      We do not guarantee uninterrupted operation, error-free performance, 
                      or specific trading results.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Limitation of Damages</p>
                    <p className="text-sm text-muted-foreground">
                      Our liability is limited to the amount you paid for our services. 
                      We are not liable for any indirect, incidental, or consequential damages, 
                      including trading losses.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Legal</CardTitle>
                  <CardDescription>
                    How to reach us and governing law information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Support Contact</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: support@algotrading.com<br />
                        Response time: Within 24 hours
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Legal Contact</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: legal@algotrading.com<br />
                        For terms and compliance matters
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                      These terms are governed by the laws of [Your Jurisdiction]. 
                      Any disputes will be resolved through binding arbitration. 
                      If any provision is deemed invalid, the remaining terms remain in effect.
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}