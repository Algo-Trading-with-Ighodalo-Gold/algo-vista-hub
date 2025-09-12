import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { SubscriptionStatus } from '@/components/dashboard/subscription-status'
import { ProductsLicenses } from '@/components/dashboard/products-licenses'
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function DashboardOverview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { 
    subscriptions, 
    licenses, 
    affiliate, 
    profile, 
    loading, 
    error 
  } = useDashboardData()

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="border-destructive animate-fade-in">
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
    )
  }

  const displayName = 
    profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Trader'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Your trading command center - manage everything from one place
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="hover-scale"
            onClick={() => navigate('/dashboard/ea-development')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Develop EA
          </Button>
          <Button 
            className="hover-scale gradient-primary"
            onClick={() => navigate('/products')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Browse EAs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <DashboardStats 
          subscriptions={subscriptions}
          licenses={licenses}
          affiliate={affiliate}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-all duration-300 hover-scale border-2 hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Affiliate Program
            </CardTitle>
            <CardDescription>Earn commissions by referring traders</CardDescription>
          </CardHeader>
          <CardContent>
            {affiliate ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Earned</span>
                  <Badge variant="secondary">${affiliate.commission_earned.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={affiliate.payout_status === 'paid' ? 'default' : 'outline'}>
                    {affiliate.payout_status}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover-scale"
                  onClick={() => navigate('/dashboard/affiliate')}
                >
                  View Details
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Join our affiliate program and start earning commissions today.
                </p>
                <Button 
                  size="sm" 
                  className="w-full hover-scale"
                  onClick={() => navigate('/dashboard/profile')}
                >
                  Become Affiliate
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <SubscriptionStatus subscriptions={subscriptions} loading={loading} />

        <Card className="hover:shadow-lg transition-all duration-300 hover-scale border-2 hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest account activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {licenses.length > 0 ? (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Latest License:</span>
                    <p className="text-muted-foreground truncate">
                      {licenses[0].ea_product_name || licenses[0].license_type}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Status:</span>
                    <Badge variant="secondary" className="ml-2">
                      {licenses[0].status}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity. Start by exploring our EAs.
                </p>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover-scale"
                onClick={() => navigate('/products')}
              >
                Browse Products
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products & Licenses */}
      <div className="animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
        <ProductsLicenses licenses={licenses} loading={loading} />
      </div>
    </div>
  )
}