import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'
import type { License, SubscriptionTier, LicenseAccount } from '@/lib/accounts-utils'

type LicenseRow = Tables<'licenses'>
type SubscriptionTierRow = Tables<'subscription_tiers'>
type SubscriptionRow = Tables<'subscriptions'>

export interface EnrichedLicense extends LicenseRow {
  ea_product_name?: string | null
  connected_accounts: LicenseAccount[]
  connected_count: number
  max_allowed: number
  tier?: SubscriptionTierRow | null
  subscription?: SubscriptionRow | null
}

export interface AccountsData {
  licenses: EnrichedLicense[]
  tiers: Map<string, SubscriptionTierRow>
  subscriptions: SubscriptionRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAccountsData(): AccountsData {
  const { user } = useAuth()
  const [licenses, setLicenses] = useState<LicenseRow[]>([])
  const [tiers, setTiers] = useState<SubscriptionTierRow[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([])
  const [licenseAccounts, setLicenseAccounts] = useState<LicenseAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch licenses with product info
      // Try with relationship first, fallback to simple query if relationship fails
      let licensesData: any[] | null = null
      
      // Try products table first, fallback to ea_products
      const { data: licensesWithProducts, error: licensesWithProductsError } = await supabase
        .from('licenses')
        .select(`
          *,
          products:ea_product_id (
            id,
            name
          ),
          ea_products:ea_product_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (licensesWithProductsError) {
        // If relationship query fails, try without the relationship
        console.warn('Failed to fetch licenses with products, trying without relationship:', licensesWithProductsError)
        const { data: simpleLicenses, error: simpleError } = await supabase
          .from('licenses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (simpleError) {
          const errorMsg = simpleError.message || simpleError.code || 'Unknown error'
          throw new Error(`Failed to fetch licenses: ${errorMsg}`)
        }
        licensesData = simpleLicenses
      } else {
        licensesData = licensesWithProducts
      }

      const licensesList = (licensesData || []).map(license => {
        const product = (license as any).products || (license as any).ea_products
        return {
        ...license,
          ea_product_name: product?.name || license.ea_product_name
        }
      }) as LicenseRow[]

      setLicenses(licensesList)

      // Fetch subscription tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('is_active', true)

      if (tiersError && tiersError.code !== 'PGRST116') {
        console.warn('Error fetching tiers:', tiersError)
      }

      setTiers(tiersData || [])

      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (subscriptionsError && subscriptionsError.code !== 'PGRST116') {
        console.warn('Error fetching subscriptions:', subscriptionsError)
      }

      setSubscriptions(subscriptionsData || [])

      // Fetch license accounts for all user licenses
      const licenseIds = licensesList.map(l => l.id)
      if (licenseIds.length > 0) {
        const { data: accountsData, error: accountsError } = await supabase
          .from('license_accounts')
          .select('*')
          .in('license_id', licenseIds)
          .order('created_at', { ascending: false })

        // Handle table not found or RLS errors gracefully
        if (accountsError) {
          if (accountsError.code === 'PGRST116' || accountsError.code === '42P01') {
            // Table doesn't exist or no rows - this is okay, just set empty array
            console.info('license_accounts table not found or empty, continuing without accounts')
            setLicenseAccounts([])
          } else {
            // Other errors should be logged but not block the page
            console.warn('Error fetching license accounts:', accountsError)
            setLicenseAccounts([])
          }
        } else {
          // Transform account from bigint to number for frontend
          const transformedAccounts = (accountsData || []).map(acc => ({
            ...acc,
            account: typeof acc.account === 'string' ? parseInt(acc.account, 10) : Number(acc.account)
          })) as LicenseAccount[]

          setLicenseAccounts(transformedAccounts)
        }
      } else {
        setLicenseAccounts([])
      }
    } catch (err) {
      console.error('Error fetching accounts data:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : 'Failed to fetch data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  // Create enriched licenses with connected accounts and limits
  const enrichedLicenses = useMemo(() => {
    const tiersMap = new Map(tiers.map(t => [t.id, t]))
    const subscriptionsMap = new Map(subscriptions.map(s => [s.id, s]))
    const accountsMap = new Map<string, LicenseAccount[]>()

    // Group accounts by license_id
    licenseAccounts.forEach(acc => {
      const existing = accountsMap.get(acc.license_id) || []
      accountsMap.set(acc.license_id, [...existing, acc])
    })

    return licenses.map(license => {
      const connected = accountsMap.get(license.id) || []
      const tier = license.plan_id ? tiersMap.get(license.plan_id) : null
      
      // Find subscription by stripe_subscription_id if needed
      let subscription: SubscriptionRow | null = null
      if (license.stripe_subscription_id) {
        // Try to find by matching plan or stripe_subscription_id
        subscription = subscriptions.find(s => 
          s.plan === license.stripe_subscription_id || 
          s.id === license.stripe_subscription_id
        ) || null
      }

      // Calculate max_allowed
      let maxAllowed = 0 // 0 = unlimited
      if (license.max_concurrent_sessions != null && license.max_concurrent_sessions > 0) {
        maxAllowed = license.max_concurrent_sessions
      } else if (tier?.max_mt5_accounts != null && tier.max_mt5_accounts > 0) {
        maxAllowed = tier.max_mt5_accounts
      } else if (tier?.max_concurrent_sessions != null && tier.max_concurrent_sessions > 0) {
        maxAllowed = tier.max_concurrent_sessions
      }

      return {
        ...license,
        connected_accounts: connected,
        connected_count: connected.length,
        max_allowed: maxAllowed,
        tier,
        subscription
      } as EnrichedLicense
    })
  }, [licenses, tiers, subscriptions, licenseAccounts])

  const tiersMap = useMemo(() => {
    return new Map(tiers.map(t => [t.id, t]))
  }, [tiers])

  return {
    licenses: enrichedLicenses,
    tiers: tiersMap,
    subscriptions,
    loading,
    error,
    refetch: fetchData
  }
}



