import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { EnhancedAffiliateTracking } from '@/components/dashboard/enhanced-affiliate-tracking'
import { AffiliateApplicationForm } from '@/components/dashboard/affiliate-application-form'
import { 
  Users,
  DollarSign,
  Share,
  Copy,
  TrendingUp,
  UserPlus,
  Gift,
  Target
} from 'lucide-react'

export default function AffiliatePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { 
    affiliate, 
    profile, 
    loading,
    referralClicks 
  } = useDashboardData()

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

  const referralLink = profile?.affiliate_code 
    ? `https://algotradingwithighodalo.com/ref/${profile.affiliate_code}`
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Affiliate Program
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Earn commissions by referring new customers to our platform
        </p>
      </div>

      {/* Affiliate Status */}
      {affiliate ? (
        <>
          {/* Performance Overview */}
          <div className="grid gap-6 md:grid-cols-4 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${affiliate.commission_earned?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Referral Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {referralClicks?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total clicks</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {referralClicks?.length ? 
                    (((referralClicks.filter(click => click.converted).length) / referralClicks.length) * 100).toFixed(1)
                    : '0.0'
                  }%
                </div>
                <p className="text-xs text-muted-foreground">Click to sale</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payout Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={affiliate.payout_status === 'paid' ? 'default' : 'secondary'}>
                  {affiliate.payout_status || 'pending'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Current status</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          {referralLink && (
            <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5 text-primary" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>
                  Share this link to earn 30% commission on all referral sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    value={referralLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={() => copyToClipboard(referralLink, 'Referral link')}
                    className="hover-scale"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="hover-scale">
                    <Share className="h-4 w-4 mr-2" />
                    Share on Social
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">
                    <Gift className="h-4 w-4 mr-2" />
                    Generate Banner
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Tracking */}
          <div className="animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            <EnhancedAffiliateTracking affiliate={affiliate} loading={loading} />
          </div>

          {/* Commission Structure */}
          <Card className="animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Commission Structure
              </CardTitle>
              <CardDescription>
                Earn competitive commissions on every successful referral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">30%</h3>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Lifetime</h3>
                  <p className="text-sm text-muted-foreground">Cookie Duration</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Monthly</h3>
                  <p className="text-sm text-muted-foreground">Payout Schedule</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Application Form for Non-Affiliates */
        <div className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Join Our Affiliate Program
              </CardTitle>
              <CardDescription>
                Start earning 30% commission on every successful referral
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">High Commissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn 30% on every sale you refer
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Easy Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics and real-time reporting
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Marketing Materials</h3>
                  <p className="text-sm text-muted-foreground">
                    Banners, links, and promotional content
                  </p>
                </div>
              </div>

              <AffiliateApplicationForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}