import { Link } from "react-router-dom"
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPolicyPage() {
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
              <Shield className="h-3 w-3 mr-1" />
              Legal Document
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              How we collect, use, and protect your personal information
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
            <div className="grid gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Information We Collect
                  </CardTitle>
                  <CardDescription>
                    We collect information you provide directly to us and automatically when you use our services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Account information (name, email, password)</li>
                      <li>• Profile information (trading preferences, experience level)</li>
                      <li>• Payment information (processed securely through Stripe)</li>
                      <li>• Communication data (support tickets, feedback)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Technical Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Device information (hardware fingerprint for license validation)</li>
                      <li>• Usage data (EA performance, trading statistics)</li>
                      <li>• Log files (error reports, system diagnostics)</li>
                      <li>• Cookies and similar technologies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    How We Use Your Information
                  </CardTitle>
                  <CardDescription>
                    We use your information to provide, maintain, and improve our services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Service Provision</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• License validation and management</li>
                        <li>• EA software delivery and updates</li>
                        <li>• Customer support and communication</li>
                        <li>• Performance monitoring and optimization</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Business Operations</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Payment processing and billing</li>
                        <li>• Fraud prevention and security</li>
                        <li>• Analytics and service improvement</li>
                        <li>• Legal compliance and protection</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Data Protection & Security
                  </CardTitle>
                  <CardDescription>
                    We implement industry-standard security measures to protect your data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Security Measures</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• End-to-end encryption for sensitive data</li>
                        <li>• Secure cloud infrastructure (Supabase)</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Data Retention</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Account data: Stored while account is active</li>
                        <li>• License data: Retained for 7 years</li>
                        <li>• Support tickets: Deleted after 3 years</li>
                        <li>• Analytics data: Anonymized after 2 years</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rights & Choices</CardTitle>
                  <CardDescription>
                    You have control over your personal information and how we use it.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Data Rights</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Access your personal data</li>
                        <li>• Correct inaccurate information</li>
                        <li>• Delete your account and data</li>
                        <li>• Export your data (portability)</li>
                        <li>• Opt-out of marketing communications</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Cookie Control</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Essential cookies (required for service)</li>
                        <li>• Analytics cookies (can be disabled)</li>
                        <li>• Marketing cookies (opt-in only)</li>
                        <li>• Third-party cookies (limited and controlled)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Us
                  </CardTitle>
                  <CardDescription>
                    Questions about this Privacy Policy? We're here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about this Privacy Policy or our data practices, 
                      please contact us using the information below:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">
                          privacy@algotrading.com
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-muted-foreground">
                          Within 30 days of your request
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Note:</strong> This Privacy Policy may be updated from time to time. 
                        We will notify you of any material changes by email or through our platform.
                      </p>
                    </div>
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