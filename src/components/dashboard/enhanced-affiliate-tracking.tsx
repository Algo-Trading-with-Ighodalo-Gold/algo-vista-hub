import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, DollarSign, Users, TrendingUp, MousePointer, Target } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth-context'

interface Affiliate {
  id: string
  user_id: string
  referral_code: string
  commission_earned: number
  payout_status: string
  created_at: string
  updated_at: string
}

interface ReferralClick {
  id: string
  referrer_user_id: string
  ip_address: string | null
  user_agent: string | null
  clicked_at: string
  converted: boolean | null
  conversion_date: string | null
  created_at: string
}

interface EnhancedAffiliateTrackingProps {
  affiliate: Affiliate | null
  loading: boolean
}

interface AffiliateStats {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  recentClicks: ReferralClick[]
}

export function EnhancedAffiliateTracking({ affiliate, loading }: EnhancedAffiliateTrackingProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    recentClicks: []
  })
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    if (user && affiliate) {
      fetchAffiliateStats()
    }
  }, [user, affiliate])

  const fetchAffiliateStats = async () => {
    if (!user) return
    
    setStatsLoading(true)
    try {
      const { data: clicks, error } = await supabase
        .from('referral_clicks')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('clicked_at', { ascending: false })
        .limit(10)

      if (error) throw error

      const totalClicks = clicks?.length || 0
      const totalConversions = clicks?.filter(click => click.converted).length || 0
      
      setStats({
        totalClicks,
        totalConversions,
        totalEarnings: affiliate?.commission_earned || 0,
        recentClicks: clicks || []
      })
    } catch (error) {
      console.error('Error fetching affiliate stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const generateReferralLink = () => {
    if (!affiliate?.referral_code) return ''
    return `${window.location.origin}?ref=${affiliate.referral_code}`
  }

  const handleCopyReferralCode = () => {
    if (affiliate?.referral_code) {
      navigator.clipboard.writeText(affiliate.referral_code)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
    }
  }

  const handleCopyReferralLink = () => {
    const link = generateReferralLink()
    if (link) {
      navigator.clipboard.writeText(link)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
    }
  }

  const handleBecomeAffiliate = async () => {
    if (!user) return

    try {
      const referralCode = `${user.id.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`
      
      const { error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          referral_code: referralCode,
          commission_earned: 0,
          payout_status: 'pending'
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "You've joined the affiliate program! Refresh the page to see your referral code.",
      })
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error joining affiliate program:', error)
      toast({
        title: "Error",
        description: "Failed to join affiliate program. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enhanced Affiliate Program
          </CardTitle>
          <CardDescription>Track your referrals, clicks, and commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Enhanced Affiliate Program
        </CardTitle>
        <CardDescription>Track your referrals, clicks, and commissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!affiliate ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Join our affiliate program and start earning commissions!</p>
            <Button variant="default" onClick={handleBecomeAffiliate}>
              Become an Affiliate
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointer className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Clicks</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {statsLoading ? '...' : stats.totalClicks}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Conversions</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {statsLoading ? '...' : stats.totalConversions}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Earnings</span>
                </div>
                <div className="text-2xl font-bold text-accent">
                  ${(affiliate.commission_earned || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Referral Code</label>
              <div className="flex gap-2">
                <Input 
                  value={affiliate.referral_code} 
                  readOnly 
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyReferralCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Referral Link</label>
              <div className="flex gap-2">
                <Input 
                  value={generateReferralLink()}
                  readOnly 
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyReferralLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Payout Status:</span>
                <Badge variant={affiliate.payout_status === 'paid' ? 'default' : 'secondary'}>
                  {affiliate.payout_status || 'pending'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={fetchAffiliateStats}>
                Refresh Stats
              </Button>
            </div>

            {/* Recent Activity */}
            {stats.recentClicks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Referral Activity</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stats.recentClicks.map((click) => (
                    <div key={click.id} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                      <span>Click from {click.ip_address || 'Unknown'}</span>
                      <div className="flex items-center gap-2">
                        {click.converted && <Badge variant="outline" className="text-xs">Converted</Badge>}
                        <span className="text-muted-foreground">
                          {new Date(click.clicked_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="default" size="sm">
                View Full Analytics
              </Button>
              <Button variant="outline" size="sm">
                Payout History
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}