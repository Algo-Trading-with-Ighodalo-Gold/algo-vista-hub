import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  AlertTriangle,
  Shield,
  CreditCard
} from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-6 animate-fade-in">
        <h1 className="text-display font-bold text-gradient">
          Refund Policy
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          We're committed to your satisfaction. Review our refund policy to understand 
          your options and our commitment to fair treatment.
        </p>
        <Badge variant="outline" className="text-caption">
          Last Updated: December 2024
        </Badge>
      </section>

      {/* Key Points */}
      <section className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Alert className="border-primary bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>7-Day Evaluation Period:</strong> We offer a 7-day evaluation period for all new subscribers. 
            If you're not satisfied within the first 7 days of your subscription, you can request a full refund.
          </AlertDescription>
        </Alert>
      </section>

      {/* Refund Eligibility */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <div className="text-center">
          <h2 className="text-hero font-bold mb-4">Refund Eligibility</h2>
          <p className="text-body text-muted-foreground">
            Understanding when refunds are available
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Eligible for Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-success mt-1" />
                <p className="text-caption">Request made within 7 days of initial subscription</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-success mt-1" />
                <p className="text-caption">Technical issues preventing EA functionality that cannot be resolved</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-success mt-1" />
                <p className="text-caption">Billing errors or duplicate charges</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-success mt-1" />
                <p className="text-caption">Subscription cancelled due to our service discontinuation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Not Eligible for Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-destructive mt-1" />
                <p className="text-caption">Request made after 7-day evaluation period</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-destructive mt-1" />
                <p className="text-caption">Trading losses or poor performance (algorithmic trading involves risk)</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-destructive mt-1" />
                <p className="text-caption">User error in EA configuration or account setup</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-destructive mt-1" />
                <p className="text-caption">Market conditions causing unfavorable results</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Refund Process */}
      <section className="space-y-8 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
        <div className="text-center">
          <h2 className="text-hero font-bold mb-4">How to Request a Refund</h2>
          <p className="text-body text-muted-foreground">
            Simple steps to request your refund
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Contact Support",
              description: "Email us at support@algotrading.com within 7 days of your subscription",
              icon: Mail
            },
            {
              step: "2", 
              title: "Provide Details",
              description: "Include your account email, subscription details, and reason for refund",
              icon: CreditCard
            },
            {
              step: "3",
              title: "Processing",
              description: "We'll review and process eligible refunds within 5-7 business days",
              icon: RefreshCw
            }
          ].map((item) => (
            <Card key={item.step} className="text-center hover:shadow-lg transition-shadow hover-scale">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-heading">Step {item.step}: {item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-caption text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="space-y-6 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-hero font-bold text-center">Important Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Processing Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-body text-muted-foreground">
                <strong>Credit Card Refunds:</strong> 5-7 business days
              </p>
              <p className="text-body text-muted-foreground">
                <strong>PayPal Refunds:</strong> 1-3 business days
              </p>
              <p className="text-body text-muted-foreground">
                <strong>Cryptocurrency Refunds:</strong> 1-2 business days (subject to network confirmation)
              </p>
              <p className="text-caption text-muted-foreground">
                Processing times may vary depending on your financial institution.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Partial Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-body text-muted-foreground">
                In some cases, we may offer partial refunds for:
              </p>
              <ul className="space-y-1 text-caption text-muted-foreground ml-4">
                <li>• Downgrading subscription tiers</li>
                <li>• Service interruptions beyond our control</li>
                <li>• Pro-rated refunds for annual subscribers</li>
              </ul>
              <p className="text-caption text-muted-foreground">
                Each case is reviewed individually.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dispute Resolution */}
      <section className="animate-fade-in [animation-delay:1s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-center">Dispute Resolution</CardTitle>
            <CardDescription className="text-center">
              We're committed to resolving any issues fairly and quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-body text-muted-foreground">
              If you're not satisfied with our refund decision, you can escalate your case to our 
              customer service manager. We'll review all disputes within 3 business days and work 
              towards a fair resolution.
            </p>
            <Button className="hover-scale">
              <Mail className="h-4 w-4 mr-2" />
              Contact Customer Service
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Contact CTA */}
      <section className="text-center space-y-6 animate-fade-in [animation-delay:1.2s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-hero font-bold">Need Help?</h2>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Have questions about our refund policy? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="hover-scale">
            <Mail className="h-4 w-4 mr-2" />
            Email Support
          </Button>
          <Button variant="outline" size="lg" className="hover-scale">
            View FAQ
          </Button>
        </div>
      </section>
    </div>
  )
}