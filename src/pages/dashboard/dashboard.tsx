import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { SubscriptionStatus } from '@/components/dashboard/subscription-status'
import { ProductsLicenses } from '@/components/dashboard/products-licenses'
import { AffiliateTracking } from '@/components/dashboard/affiliate-tracking'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { subscriptions, licenses, affiliate, profile, loading, error } = useDashboardData()

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

  const displayName = profile?.first_name || user?.user_metadata?.first_name || 'Trader'

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
              Manage your Expert Advisors, subscriptions, and affiliate earnings
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
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
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Email:</span> {user?.email}
              </div>
              {profile?.first_name && (
                <div className="text-sm">
                  <span className="font-medium">Name:</span> {profile.first_name} {profile.last_name}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <SubscriptionStatus subscriptions={subscriptions} loading={loading} />

          {/* Affiliate Tracking */}
          <AffiliateTracking affiliate={affiliate} loading={loading} />
        </div>

        {/* Products & Licenses */}
        <div className="mb-8">
          <ProductsLicenses licenses={licenses} loading={loading} />
        </div>
      </div>
    </div>
  )
}