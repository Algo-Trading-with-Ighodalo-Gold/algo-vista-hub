import { StatsCard } from '@/components/ui/stats-card'
import { Package, DollarSign, Users, Activity } from 'lucide-react'
import { Tables } from '@/integrations/supabase/types'

type Subscription = Tables<'subscriptions'>
type License = Tables<'licenses'>
type Affiliate = Tables<'affiliates'>

interface DashboardStatsProps {
  subscriptions: Subscription[]
  licenses: License[]
  affiliate: Affiliate | null
  loading: boolean
}

export function DashboardStats({ subscriptions, licenses, affiliate, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const activeLicenses = licenses.filter(license => license.status === 'active')
  const totalEarned = affiliate?.commission_earned || 0
  
  // Calculate total MT5 accounts across all licenses
  const totalMT5Accounts = licenses.reduce((count, license) => {
    const mt5Accounts = Array.isArray(license.mt5_accounts) 
      ? license.mt5_accounts as string[]
      : []
    return count + mt5Accounts.length
  }, 0)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Active Subscriptions"
        value={activeSubscriptions.length.toString()}
        description="Currently active plans"
        icon={Package}
        trend={activeSubscriptions.length > 0 ? {
          value: 100,
          label: "of total",
          positive: true
        } : undefined}
      />
      
      <StatsCard
        title="Active Licenses"
        value={activeLicenses.length.toString()}
        description="Expert Advisor licenses"
        icon={Activity}
      />
      
      <StatsCard
        title="MT5 Accounts"
        value={totalMT5Accounts.toString()}
        description="Connected trading accounts"
        icon={Users}
      />
      
      <StatsCard
        title="Affiliate Earnings"
        value={`$${totalEarned.toFixed(2)}`}
        description="Total commissions earned"
        icon={DollarSign}
        trend={totalEarned > 0 ? {
          value: 100,
          label: "lifetime",
          positive: true
        } : undefined}
      />
    </div>
  )
}