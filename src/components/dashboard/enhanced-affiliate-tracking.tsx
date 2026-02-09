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

interface ReferredUser {
  user_id: string
  first_name: string | null
  last_name: string | null
  created_at: string
}

interface ReferralCommission {
  id: string
  referred_user_id: string
  transaction_id: string | null
  product_name: string | null
  purchase_amount: number
  commission_rate: number
  commission_amount: number
  status: string
  created_at: string
}

interface AffiliateStats {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  totalReferredUsers: number
  totalSales: number
  totalCommissions: number
  pendingCommissions: number
  recentClicks: ReferralClick[]
  referredUsers: ReferredUser[]
  commissions: ReferralCommission[]
}

export function EnhancedAffiliateTracking({ affiliate, loading }: EnhancedAffiliateTrackingProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    totalReferredUsers: 0,
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    recentClicks: [],
    referredUsers: [],
    commissions: []
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
      // Fetch referral clicks
      const { data: clicks, error: clicksError } = await supabase
        .from('referral_clicks')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('clicked_at', { ascending: false })
        .limit(10)

      if (clicksError) throw clicksError

      // Fetch referred users (profiles where referred_by = user.id)
      const { data: referredUsers, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, created_at')
        .eq('referred_by', user.id)
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error('Error fetching referred users:', usersError)
        // Continue even if this fails
      }

      // Fetch referral commissions (purchases made by referred users)
      const { data: commissions, error: commissionsError } = await supabase
        .from('referral_commissions')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (commissionsError) {
        console.error('Error fetching commissions:', commissionsError)
        // Continue even if this fails
      }

      const totalClicks = clicks?.length || 0
      const totalConversions = clicks?.filter(click => click.converted).length || 0
      const totalReferredUsers = referredUsers?.length || 0
      const totalSales = commissions?.length || 0
      const totalCommissions = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0
      const pendingCommissions = commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0
      
      setStats({
        totalClicks,
        totalConversions,
        totalEarnings: affiliate?.commission_earned || 0,
        totalReferredUsers,
        totalSales,
        totalCommissions,
        pendingCommissions,
        recentClicks: clicks || [],
        referredUsers: referredUsers || [],
        commissions: commissions || []
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Referred Users</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {statsLoading ? '...' : stats.totalReferredUsers}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Total Sales</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {statsLoading ? '...' : stats.totalSales}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Purchases made</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Total Earnings</span>
                </div>
                <div className="text-2xl font-bold text-accent">
                  ₦{(stats.totalCommissions || affiliate?.commission_earned || 0).toFixed(2)}
                </div>
                {stats.pendingCommissions > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ₦{stats.pendingCommissions.toFixed(2)} pending
                  </p>
                )}
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

            {/* Commissions/Purchases */}
            {stats.commissions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Purchases & Commissions ({stats.commissions.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.commissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between text-xs p-3 bg-muted rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{commission.product_name || 'Product Purchase'}</div>
                        <div className="text-muted-foreground mt-1">
                          Purchase: ₦{commission.purchase_amount?.toFixed(2) || '0.00'} • 
                          Commission: {commission.commission_rate}% = ₦{commission.commission_amount?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Badge 
                          variant={
                            commission.status === 'paid' ? 'default' : 
                            commission.status === 'approved' ? 'secondary' : 
                            'outline'
                          }
                          className="text-xs mb-1"
                        >
                          {commission.status}
                        </Badge>
                        <div className="text-muted-foreground text-xs mt-1">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referred Users */}
            {stats.referredUsers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Referred Users ({stats.referredUsers.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stats.referredUsers.map((referredUser) => {
                    const hasPurchase = stats.commissions.some(c => c.referred_user_id === referredUser.user_id);
                    return (
                      <div key={referredUser.user_id} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <span>
                            {referredUser.first_name || referredUser.last_name 
                              ? `${referredUser.first_name || ''} ${referredUser.last_name || ''}`.trim()
                              : `User ${referredUser.user_id.substring(0, 8)}`
                            }
                          </span>
                          {hasPurchase && (
                            <Badge variant="outline" className="text-xs">Purchased</Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(referredUser.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentClicks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Referral Clicks</h4>
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