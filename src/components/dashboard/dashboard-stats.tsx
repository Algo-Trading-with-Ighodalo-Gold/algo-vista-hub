import { StatsCard } from '@/components/ui/stats-card'
import { Package, DollarSign, Users, Activity } from 'lucide-react'

interface Subscription {
  id: string
  user_id: string | null
  plan: string
  status: string | null
  start_date: string | null
  end_date: string | null
  payment_method: string | null
  created_at: string | null
}

interface License {
  id: string
  user_id: string
  license_key: string
  license_type: string
  status: string
  ea_product_id?: string
  ea_product_name?: string
  hardware_fingerprint?: string
  max_concurrent_sessions: number
  current_active_sessions: number
  stripe_subscription_id?: string
  stripe_customer_id?: string
  issued_at: string
  expires_at?: string
  last_validated_at?: string
  validation_count: number
  max_validations_per_hour: number
  last_hour_validations: number
  last_hour_reset: string
  created_at: string
  updated_at: string
}

interface Affiliate {
  id: string
  user_id: string
  referral_code: string
  commission_earned: number
  payout_status: string
  created_at: string
  updated_at: string
}

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
  
  // Calculate total active sessions across all licenses
  const totalActiveSessions = licenses.reduce((count, license) => {
    return count + (license.current_active_sessions || 0)
  }, 0)
  
  // Calculate total EA products licensed
  const uniqueEAs = new Set(licenses.map(license => license.ea_product_name || license.license_type).filter(Boolean))
  const totalEAProducts = uniqueEAs.size

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
        title="Active Sessions"
        value={totalActiveSessions.toString()}
        description="Current EA sessions running"
        icon={Users}
        trend={totalActiveSessions > 0 ? {
          value: Math.round((totalActiveSessions / Math.max(licenses.length, 1)) * 100),
          label: "session utilization",
          positive: true
        } : undefined}
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