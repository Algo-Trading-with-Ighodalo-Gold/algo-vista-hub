import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

type Subscription = Tables<'subscriptions'>
type License = Tables<'licenses'>
type Affiliate = Tables<'affiliates'>
type Profile = Tables<'profiles'>

interface DashboardData {
  subscriptions: Subscription[]
  licenses: License[]
  affiliate: Affiliate | null
  profile: Profile | null
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
        const [subscriptionsResult, profileResult, affiliateResult] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('affiliates')
            .select('*')
            .eq('user_id', user.id)
            .single()
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