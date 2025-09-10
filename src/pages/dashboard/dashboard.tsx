import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { SubscriptionStatus } from '@/components/dashboard/subscription-status'
import { ProductsLicenses } from '@/components/dashboard/products-licenses'
import { EnhancedAffiliateTracking } from '@/components/dashboard/enhanced-affiliate-tracking'
import { EADevelopmentForm } from '@/components/dashboard/ea-development-form'
import { AffiliateApplicationForm } from '@/components/dashboard/affiliate-application-form'
import { User, Mail, Settings, Copy, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { 
    subscriptions, 
    licenses, 
    affiliate, 
    profile, 
    eaDevelopmentRequests,
    affiliateApplications,
    referralClicks,
    loading, 
    error 
  } = useDashboardData()
  const { toast } = useToast()

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
              <CardDescription>Failed to load your dashboard data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const displayName = 
    profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Trader'
      
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {displayName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your profile, subscriptions, and affiliate earnings
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="hover-scale">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <DashboardStats 
          subscriptions={subscriptions}
          licenses={licenses}
          affiliate={affiliate}
          loading={loading}
        />

        {/* Profile Card */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="animate-fade-in hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account and subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user?.email || '', 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {(profile?.first_name || profile?.last_name) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Subscription Status</span>
                </div>
                <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {profile?.subscription_status || 'Free'}
                </Badge>
              </div>
              
              {profile?.affiliate_code && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Affiliate Code</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-mono">
                      {profile.affiliate_code}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(profile.affiliate_code || '', 'Affiliate code')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Member since</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString()
                    : user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'Recently'
                  }
                </p>
              </div>
              
              <Button variant="outline" size="sm" className="w-full hover-scale">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <SubscriptionStatus subscriptions={subscriptions} loading={loading} />

          {/* Enhanced Affiliate Tracking */}
          <EnhancedAffiliateTracking affiliate={affiliate} loading={loading} />
        </div>

        {/* EAS Section */}
        <div className="mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Expert Advisor Systems (EAS)</CardTitle>
              <CardDescription>Your EA configurations and settings</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.eas_data && Object.keys(profile.eas_data).length > 0 ? (
                <div className="space-y-2">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto border">
                    {JSON.stringify(profile.eas_data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  EAS details will appear here once you configure your Expert Advisors.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products & Licenses */}
        <div className="mb-8">
          <ProductsLicenses licenses={licenses} loading={loading} />
        </div>

        {/* Forms Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <EADevelopmentForm />
          <AffiliateApplicationForm />
        </div>
      </div>
    </div>
  )
}