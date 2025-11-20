/**
 * Utility functions for license and account management
 */

export interface License {
  id: string
  user_id: string
  product_id?: string
  licensed_to?: string
  expires_at?: string | null
  is_active?: boolean | null
  plan_id?: string | null
  stripe_subscription_id?: string | null
  max_concurrent_sessions?: number | null
  ea_product_name?: string | null
  status: string
  [key: string]: any
}

export interface SubscriptionTier {
  id: string
  name: string
  max_mt5_accounts?: number | null
  max_concurrent_sessions?: number | null
  [key: string]: any
}

export interface LicenseAccount {
  id: string
  license_id: string
  account: number
  account_name?: string | null
  broker?: string | null
  balance?: number | null
  status: string
  created_at: string
}

/**
 * Check if a license is currently active
 */
export function isLicenseActive(license: License): boolean {
  if (!license.is_active) {
    return false
  }

  if (license.expires_at) {
    const expiresAt = new Date(license.expires_at)
    return expiresAt > new Date()
  }

  return true
}

/**
 * Get the effective account limit for a license
 * Returns 0 if unlimited
 */
export function effectiveLimit(
  license: License,
  tierMap?: Map<string, SubscriptionTier>
): number {
  // Check license-level max_concurrent_sessions first
  if (license.max_concurrent_sessions != null && license.max_concurrent_sessions > 0) {
    return license.max_concurrent_sessions
  }

  // Check plan_id tier limits
  if (license.plan_id && tierMap) {
    const tier = tierMap.get(license.plan_id)
    if (tier?.max_mt5_accounts != null && tier.max_mt5_accounts > 0) {
      return tier.max_mt5_accounts
    }
    if (tier?.max_concurrent_sessions != null && tier.max_concurrent_sessions > 0) {
      return tier.max_concurrent_sessions
    }
  }

  // 0 means unlimited
  return 0
}

/**
 * Get the count of connected accounts for a license
 */
export function connectedCount(
  licenseId: string,
  accountsMap?: Map<string, LicenseAccount[]>
): number {
  if (!accountsMap) {
    return 0
  }

  const accounts = accountsMap.get(licenseId)
  return accounts?.length || 0
}

/**
 * Check if a license can accept more accounts
 */
export function canConnectAccount(
  license: License,
  connectedCount: number,
  tierMap?: Map<string, SubscriptionTier>
): boolean {
  if (!isLicenseActive(license)) {
    return false
  }

  const limit = effectiveLimit(license, tierMap)
  if (limit === 0) {
    return true // Unlimited
  }

  return connectedCount < limit
}

/**
 * Get license status badge variant
 */
export function getLicenseStatusVariant(status: string, isActive: boolean): "default" | "secondary" | "destructive" {
  if (!isActive) {
    return "destructive"
  }

  switch (status) {
    case 'active':
      return "default"
    case 'expired':
    case 'suspended':
    case 'revoked':
      return "destructive"
    default:
      return "secondary"
  }
}

/**
 * Format plan name for display
 */
export function formatPlanName(tier?: SubscriptionTier | null): string {
  if (!tier) {
    return "Individual"
  }

  const name = tier.name.toLowerCase()
  if (name.includes('basic')) return "Basic"
  if (name.includes('pro')) return "Pro"
  if (name.includes('elite')) return "Elite"
  if (name.includes('premium')) return "Premium"
  
  return tier.name
}








