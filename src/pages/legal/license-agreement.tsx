import { Link } from "react-router-dom"
import { ArrowLeft, FileText, Key, Monitor, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LicenseAgreementPage() {
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
              <Key className="h-3 w-3 mr-1" />
              Software License
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Expert Advisor License Agreement</h1>
            <p className="text-lg text-muted-foreground">
              End User License Agreement for AlgoTrading Expert Advisor Software
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Version 2.1 • Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            
            <Alert className="mb-8">
              <Key className="h-4 w-4" />
              <AlertDescription>
                <strong>License Key Required:</strong> This software requires a valid license key 
                tied to your MT5 account. Each license includes hardware fingerprint validation for security.
              </AlertDescription>
            </Alert>

            <div className="grid gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    License Grant & Scope
                  </CardTitle>
                  <CardDescription>
                    What this license allows you to do with our Expert Advisor software.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Permitted Uses
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Install and run EA on one (1) MT5 account per license</li>
                      <li>• Use EA for personal or commercial trading purposes</li>
                      <li>• Run EA on multiple devices with the same MT5 account</li>
                      <li>• Access software updates during active subscription</li>
                      <li>• Use performance monitoring and analytics features</li>
                      <li>• Receive technical support during subscription period</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Restrictions & Prohibitions
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• No sharing of license keys with other individuals</li>
                      <li>• No installation on multiple MT5 accounts with one license</li>
                      <li>• No reverse engineering, decompilation, or disassembly</li>
                      <li>• No modification, adaptation, or creation of derivative works</li>
                      <li>• No redistribution, sublicensing, or commercial resale</li>
                      <li>• No circumvention of license validation or security measures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Hardware & Account Binding
                  </CardTitle>
                  <CardDescription>
                    How licenses are secured and validated on your trading setup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Hardware Fingerprinting</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      For security purposes, each license is bound to your computer's hardware fingerprint. 
                      This prevents unauthorized use while allowing you to trade on your designated setup.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• License automatically binds to first activation computer</li>
                      <li>• Hardware changes may require license reset (contact support)</li>
                      <li>• VPS transfers allowed with proper notification</li>
                      <li>• Backup computers can be authorized for redundancy</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">MT5 Account Binding</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Each license is tied to a specific MT5 account number for security and compliance.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• One license = One MT5 account number</li>
                      <li>• Account transfers available based on subscription plan</li>
                      <li>• Demo and live accounts require separate licenses</li>
                      <li>• Temporary account changes allowed for testing</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">License Transfer Allowances</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-primary">Starter Plan</p>
                        <p className="text-muted-foreground">1 transfer/month</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary">Pro Plan</p>
                        <p className="text-muted-foreground">3 transfers/month</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary">Elite Plan</p>
                        <p className="text-muted-foreground">Unlimited transfers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Renewal Terms</CardTitle>
                  <CardDescription>
                    How your license subscription works and renewal policies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Active Subscription Required</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• EA software requires active subscription to function</li>
                      <li>• License validation occurs every 24 hours</li>
                      <li>• Expired licenses disable EA trading functionality</li>
                      <li>• Grace period of 7 days for payment processing delays</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Renewal & Cancellation</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Automatic renewal unless cancelled 24 hours before billing</li>
                      <li>• Pro-rated refunds not available for partial periods</li>
                      <li>• Cancelled subscriptions remain active until period end</li>
                      <li>• Reactivation restores full functionality immediately</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intellectual Property</CardTitle>
                  <CardDescription>
                    Ownership and protection of software intellectual property.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Our Rights</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• All software code and algorithms are proprietary</li>
                        <li>• Trademarks and brand names are protected</li>
                        <li>• Documentation and educational materials are copyrighted</li>
                        <li>• Trading strategies and methodologies are trade secrets</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Your Rights</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Limited license to use software as intended</li>
                        <li>• Access to updates and improvements</li>
                        <li>• Technical support and documentation</li>
                        <li>• Performance data from your trading activity</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Any attempt to reverse engineer, decompile, or extract proprietary 
                      algorithms will result in immediate license termination and legal action.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support & Maintenance</CardTitle>
                  <CardDescription>
                    What support and maintenance is included with your license.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Included Support</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Technical support via email and live chat</li>
                      <li>• Installation and configuration assistance</li>
                      <li>• Bug fixes and security updates</li>
                      <li>• Performance optimization guidance</li>
                      <li>• Access to knowledge base and documentation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Response Times</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Starter Plan</p>
                        <p className="text-sm text-muted-foreground">48 hours</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">24 hours</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Elite Plan</p>
                        <p className="text-sm text-muted-foreground">12 hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Termination & Violations</CardTitle>
                  <CardDescription>
                    Conditions under which this license may be terminated.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Automatic Termination</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Non-payment of subscription fees</li>
                      <li>• Violation of license terms or restrictions</li>
                      <li>• Attempt to circumvent security measures</li>
                      <li>• Sharing or redistributing software</li>
                      <li>• Fraudulent or illegal use of software</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Effect of Termination</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Immediate loss of software functionality</li>
                      <li>• No refund for unused subscription period</li>
                      <li>• Requirement to delete all software files</li>
                      <li>• Loss of access to support and updates</li>
                    </ul>
                  </div>
                  
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <p className="text-sm font-medium">Violation Consequences</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      License violations may result in permanent ban from our platform 
                      and legal action to protect our intellectual property rights.
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