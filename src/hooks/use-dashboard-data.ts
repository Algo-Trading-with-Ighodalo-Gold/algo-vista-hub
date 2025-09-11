import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

type Subscription = Tables<'subscriptions'>
type License = Tables<'licenses'>
type Profile = Tables<'profiles'>
type AffiliateApplication = Tables<'affiliate_applications'>
type ReferralClick = Tables<'referral_clicks'>

interface Affiliate {
  id: string
  user_id: string
  referral_code: string
  commission_earned: number
  payout_status: string
  created_at: string
  updated_at: string
}

interface EADevelopment {
  id: string
  user_id: string
  strategy_name: string
  requirements: string
  status: string
  created_at: string
  updated_at: string
}

interface DashboardData {
  subscriptions: Subscription[]
  licenses: License[]
  affiliate: Affiliate | null
  profile: Profile | null
  eaDevelopmentRequests: EADevelopment[]
  affiliateApplications: AffiliateApplication[]
  referralClicks: ReferralClick[]
  loading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    subscriptions: [],
    licenses: [],
    affiliate: null,
    profile: null,
    eaDevelopmentRequests: [],
    affiliateApplications: [],
    referralClicks: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }))
      return
    }

    async function fetchDashboardData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch all data in parallel
        const [
          subscriptionsResult, 
          profileResult, 
          affiliateResult,
          eaDevelopmentResult,
          affiliateApplicationsResult,
          referralClicksResult
        ] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('affiliates')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('ea_development')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('affiliate_applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('referral_clicks')
            .select('*')
            .eq('referrer_user_id', user.id)
            .order('clicked_at', { ascending: false })
            .limit(50)
        ])

        if (subscriptionsResult.error && subscriptionsResult.error.code !== 'PGRST116') {
          throw subscriptionsResult.error
        }

        const subscriptions = subscriptionsResult.data || []

        // Fetch licenses for all subscriptions
        let licenses: License[] = []
        if (subscriptions.length > 0) {
          const subscriptionIds = subscriptions.map(sub => sub.id)
          const licensesResult = await supabase
            .from('licenses')
            .select('*')
            .in('subscription_id', subscriptionIds)

          if (licensesResult.error) {
            throw licensesResult.error
          }
          licenses = licensesResult.data || []
        }

        setData({
          subscriptions,
          licenses,
          affiliate: affiliateResult.data || null,
          profile: profileResult.data || null,
          eaDevelopmentRequests: eaDevelopmentResult.data || [],
          affiliateApplications: affiliateApplicationsResult.data || [],
          referralClicks: referralClicksResult.data || [],
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
        }))
      }
    }

    fetchDashboardData()
  }, [user])

  return data
}