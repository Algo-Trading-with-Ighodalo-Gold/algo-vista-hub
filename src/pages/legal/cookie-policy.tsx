import { Link } from "react-router-dom"
import { ArrowLeft, Cookie, Settings, BarChart3, Target, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CookiePolicyPage() {
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
              <Cookie className="h-3 w-3 mr-1" />
              Privacy & Cookies
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground">
              How we use cookies and similar technologies to enhance your experience
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
            
            {/* Cookie Preferences */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cookie Preferences
                </CardTitle>
                <CardDescription>
                  Manage your cookie preferences. Essential cookies cannot be disabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  
                  <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-success" />
                        <Label className="font-medium">Essential Cookies</Label>
                        <Badge variant="secondary" className="ml-auto">Required</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Necessary for basic site functionality, security, and license validation.
                      </p>
                    </div>
                    <Switch checked disabled />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <Label className="font-medium">Analytics Cookies</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how you use our platform to improve performance.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-accent" />
                        <Label className="font-medium">Marketing Cookies</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Used to personalize ads and measure marketing campaign effectiveness.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                </div>
                
                <div className="flex gap-3">
                  <Button size="sm">Save Preferences</Button>
                  <Button variant="outline" size="sm">Accept All</Button>
                  <Button variant="ghost" size="sm">Reject Optional</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle>What Are Cookies?</CardTitle>
                  <CardDescription>
                    Understanding cookies and how they work on our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Cookies are small text files stored on your device when you visit our website. 
                    They help us provide you with a better, faster, and more secure experience by 
                    remembering your preferences and enabling essential functionality.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Session Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Temporary cookies that expire when you close your browser. 
                        Used for authentication and maintaining your session.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Persistent Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Remain on your device for a specified period. 
                        Used to remember your preferences and settings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-success" />
                    Essential Cookies
                  </CardTitle>
                  <CardDescription>
                    Required cookies that cannot be disabled for basic functionality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Authentication Cookies</h4>
                          <Badge variant="secondary">supabase-auth-token</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Maintains your login session and user authentication state.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 30 days • 
                          <span className="font-medium ml-2">Domain:</span> algotrading.com
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Security Cookies</h4>
                          <Badge variant="secondary">csrf-token</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Protects against cross-site request forgery attacks.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> Session • 
                          <span className="font-medium ml-2">Domain:</span> algotrading.com
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">License Validation</h4>
                          <Badge variant="secondary">license-status</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Caches license validation status to reduce server requests.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 24 hours • 
                          <span className="font-medium ml-2">Domain:</span> algotrading.com
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Analytics Cookies
                  </CardTitle>
                  <CardDescription>
                    Help us understand usage patterns and improve our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Google Analytics</h4>
                          <Badge variant="outline">_ga, _ga_*</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Tracks website usage, page views, and user interactions to help us improve the platform.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 2 years • 
                          <span className="font-medium ml-2">Provider:</span> Google
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Performance Monitoring</h4>
                          <Badge variant="outline">perf-data</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Monitors platform performance, load times, and error rates.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 7 days • 
                          <span className="font-medium ml-2">Domain:</span> algotrading.com
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Marketing Cookies
                  </CardTitle>
                  <CardDescription>
                    Used for personalized advertising and marketing campaigns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Social Media Pixels</h4>
                          <Badge variant="outline">fb_pixel, tw_pixel</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Track conversions and enable retargeting on social media platforms.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 180 days • 
                          <span className="font-medium ml-2">Providers:</span> Facebook, Twitter
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Ad Campaign Tracking</h4>
                          <Badge variant="outline">utm_source, campaign_id</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Measures the effectiveness of our advertising campaigns.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expires:</span> 30 days • 
                          <span className="font-medium ml-2">Domain:</span> algotrading.com
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Managing Your Cookies</CardTitle>
                  <CardDescription>
                    How to control cookies through your browser and our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Browser Settings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You can control cookies through your browser settings. Note that disabling 
                      essential cookies may impact platform functionality.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Chrome</h4>
                        <p className="text-sm text-muted-foreground">
                          Settings → Privacy and security → Cookies and other site data
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Firefox</h4>
                        <p className="text-sm text-muted-foreground">
                          Preferences → Privacy & Security → Cookies and Site Data
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Safari</h4>
                        <p className="text-sm text-muted-foreground">
                          Preferences → Privacy → Manage Website Data
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Edge</h4>
                        <p className="text-sm text-muted-foreground">
                          Settings → Site permissions → Cookies and stored data
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Platform Controls</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use the cookie preference panel at the top of this page</li>
                      <li>• Access cookie settings through your account dashboard</li>
                      <li>• Contact support for assistance with cookie management</li>
                      <li>• Review and update preferences periodically</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Important:</strong> Some features may not work properly if you disable cookies. 
                      License validation and authentication require essential cookies to function.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Updates</CardTitle>
                  <CardDescription>
                    Questions about cookies or policy updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Privacy Questions</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: privacy@algotrading.com<br />
                        Response within 30 days
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Technical Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: support@algotrading.com<br />
                        Cookie-related technical issues
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      We may update this Cookie Policy periodically. Material changes will be 
                      communicated through email or platform notifications. Continued use of our 
                      services constitutes acceptance of the updated policy.
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