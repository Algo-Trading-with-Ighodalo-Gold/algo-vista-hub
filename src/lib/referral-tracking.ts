/**
 * Referral Tracking Utility
 * Handles capturing and storing referral codes from URL parameters
 */

const REFERRAL_CODE_KEY = 'referral_code'
const REFERRAL_CODE_EXPIRY_DAYS = 30

/**
 * Get referral code from URL parameter (?ref=CODE)
 */
export function getReferralCodeFromURL(): string | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}

/**
 * Store referral code in localStorage
 */
export function storeReferralCode(code: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + REFERRAL_CODE_EXPIRY_DAYS)
    
    const data = {
      code,
      expiry: expiryDate.toISOString()
    }
    
    localStorage.setItem(REFERRAL_CODE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to store referral code:', error)
  }
}

/**
 * Get stored referral code from localStorage
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(REFERRAL_CODE_KEY)
    if (!stored) return null
    
    const data = JSON.parse(stored)
    const expiryDate = new Date(data.expiry)
    
    // Check if expired
    if (new Date() > expiryDate) {
      localStorage.removeItem(REFERRAL_CODE_KEY)
      return null
    }
    
    return data.code
  } catch (error) {
    console.error('Failed to get stored referral code:', error)
    return null
  }
}

/**
 * Clear stored referral code
 */
export function clearReferralCode(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(REFERRAL_CODE_KEY)
  } catch (error) {
    console.error('Failed to clear referral code:', error)
  }
}

/**
 * Initialize referral tracking - call this on app load
 * Captures referral code from URL and stores it
 */
export function initializeReferralTracking(): void {
  const urlCode = getReferralCodeFromURL()
  
  if (urlCode) {
    storeReferralCode(urlCode)
    
    // Track referral click in database
    trackReferralClick(urlCode).catch(error => {
      console.error('Failed to track referral click:', error)
    })
    
    // Clean up URL parameter (optional - keeps URL clean)
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href)
      url.searchParams.delete('ref')
      window.history.replaceState({}, '', url.toString())
    }
  }
}

/**
 * Track referral click in database
 */
async function trackReferralClick(referralCode: string): Promise<void> {
  try {
    const { supabase } = await import('@/integrations/supabase/client')
    
    const { error } = await supabase.rpc('track_referral_click', {
      referral_code_param: referralCode
    })
    
    if (error) {
      console.error('Error tracking referral click:', error)
    }
  } catch (error) {
    console.error('Failed to track referral click:', error)
  }
}

/**
 * Get referral code for signup (from URL or localStorage)
 */
export function getReferralCodeForSignup(): string | null {
  // First check URL (most recent)
  const urlCode = getReferralCodeFromURL()
  if (urlCode) {
    storeReferralCode(urlCode)
    return urlCode
  }
  
  // Then check localStorage
  return getStoredReferralCode()
}






