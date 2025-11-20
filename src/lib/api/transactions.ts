import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

export type Transaction = {
  id: string
  date: string
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  type: 'purchase' | 'subscription' | 'earning' | 'refund'
  stripe_payment_intent_id?: string
  ea_product_name?: string
  license_key?: string
}

export type TransactionSummary = {
  totalSpent: number
  totalEarnings: number
  transactionCount: number
  averageTransaction: number
  monthlySpent: number
  pendingEarnings: number
}

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    // Get licenses (purchases)
    const { data: licenses, error: licensesError } = await supabase
      .from('licenses')
      .select(`
        id,
        created_at,
        ea_product_name,
        license_key,
        stripe_customer_id,
        stripe_subscription_id
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (licensesError) throw licensesError

    // Get subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        created_at,
        plan,
        status,
        payment_method
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (subscriptionsError) throw subscriptionsError

    // Get affiliate earnings
    const { data: affiliates, error: affiliatesError } = await supabase
      .from('affiliates')
      .select(`
        commission_earned,
        payout_status,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (affiliatesError) throw affiliatesError

    // Transform data into transactions
    const transactions: Transaction[] = []

    // Add license purchases
    licenses?.forEach(license => {
      transactions.push({
        id: license.id,
        date: license.created_at,
        amount: 29900, // Default EA price in cents
        description: `${license.ea_product_name || 'Expert Advisor'} License`,
        status: 'completed',
        type: 'purchase',
        ea_product_name: license.ea_product_name || undefined,
        license_key: license.license_key
      })
    })

    // Add subscriptions
    subscriptions?.forEach(subscription => {
      const amount = subscription.plan === 'premium' ? 14900 : 
                    subscription.plan === 'basic' ? 9900 : 19900
      
      transactions.push({
        id: subscription.id,
        date: subscription.created_at || new Date().toISOString(),
        amount,
        description: `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Subscription`,
        status: subscription.status === 'active' ? 'completed' : 'pending',
        type: 'subscription'
      })
    })

    // Add affiliate earnings
    affiliates?.forEach(affiliate => {
      if (affiliate.commission_earned > 0) {
        transactions.push({
          id: `affiliate-${affiliate.created_at}`,
          date: affiliate.updated_at,
          amount: affiliate.commission_earned * 100, // Convert to cents
          description: 'Affiliate Commission',
          status: affiliate.payout_status === 'paid' ? 'completed' : 'pending',
          type: 'earning'
        })
      }
    })

    // Sort by date descending
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export const getTransactionSummary = async (userId: string): Promise<TransactionSummary> => {
  try {
    const transactions = await getTransactions(userId)
    
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const totalSpent = transactions
      .filter(t => t.type === 'purchase' || t.type === 'subscription')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalEarnings = transactions
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthlySpent = transactions
      .filter(t => (t.type === 'purchase' || t.type === 'subscription') && 
                   new Date(t.date) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingEarnings = transactions
      .filter(t => t.type === 'earning' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalSpent,
      totalEarnings,
      transactionCount: transactions.length,
      averageTransaction: transactions.length > 0 ? totalSpent / transactions.length : 0,
      monthlySpent,
      pendingEarnings
    }
  } catch (error) {
    console.error('Error calculating transaction summary:', error)
    return {
      totalSpent: 0,
      totalEarnings: 0,
      transactionCount: 0,
      averageTransaction: 0,
      monthlySpent: 0,
      pendingEarnings: 0
    }
  }
}

export const formatCurrency = (amountInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amountInCents / 100)
}

export const exportTransactions = async (userId: string): Promise<string> => {
  const transactions = await getTransactions(userId)
  
  const csvContent = [
    ['Date', 'Description', 'Amount', 'Status', 'Type'].join(','),
    ...transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      formatCurrency(t.amount),
      t.status,
      t.type
    ].join(','))
  ].join('\n')
  
  return csvContent
}


