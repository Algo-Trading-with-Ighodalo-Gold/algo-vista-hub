import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, DollarSign, Users, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Affiliate {
  id: string
  user_id: string
  referral_code: string
  commission_earned: number
  payout_status: string
  created_at: string
  updated_at: string
}

interface AffiliateTrackingProps {
  affiliate: Affiliate | null
  loading: boolean
}

export function AffiliateTracking({ affiliate, loading }: AffiliateTrackingProps) {
  const { toast } = useToast()

  const handleCopyReferralCode = () => {
    if (affiliate?.referral_code) {
      navigator.clipboard.writeText(affiliate.referral_code)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Affiliate Program
          </CardTitle>
          <CardDescription>Track your referrals and commissions</CardDescription>
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
          Affiliate Program
        </CardTitle>
        <CardDescription>Track your referrals and commissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!affiliate ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Join our affiliate program</p>
            <Button variant="default">Become an Affiliate</Button>
          </div>
        ) : (
          <div className="space-y-4">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Earned</span>
                </div>
                <div className="text-lg font-bold text-success">
                  ${(affiliate.commission_earned || 0).toFixed(2)}
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant={affiliate.payout_status === 'paid' ? 'default' : 'secondary'}>
                  {affiliate.payout_status || 'pending'}
                </Badge>
              </div>
            </div>

            {/* Share Links */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Your Link</label>
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}?ref=${affiliate.referral_code}`}
                  readOnly 
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?ref=${affiliate.referral_code}`)
                    toast({
                      title: "Copied!",
                      description: "Referral link copied to clipboard",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="default" size="sm">
                View Analytics
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