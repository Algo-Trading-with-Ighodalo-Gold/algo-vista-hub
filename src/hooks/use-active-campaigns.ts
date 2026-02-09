import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface ActiveCampaign {
  id: string
  name: string
  promo_code: string | null
  discount_type: string
  discount_value: number
  product_ids: string[] | null
}

/**
 * Fetches active discount campaigns (RLS returns only active, in-date, under max redemptions).
 * Use this to show promo UI only when there are campaigns.
 */
export function useActiveCampaigns() {
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    supabase
      .from('discount_campaigns')
      .select('id, name, promo_code, discount_type, discount_value, product_ids')
      .then(({ data, error }) => {
        if (cancelled) return
        setLoading(false)
        if (error) {
          console.error('Failed to load campaigns:', error)
          setCampaigns([])
          return
        }
        setCampaigns((data as ActiveCampaign[]) || [])
      })
    return () => { cancelled = true }
  }, [])

  return { campaigns, loading }
}
