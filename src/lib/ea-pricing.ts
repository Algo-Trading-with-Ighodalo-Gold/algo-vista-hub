/**
 * EA plan pricing formula.
 * - Monthly: base price
 * - Quarterly: 15% off vs monthly (price for 3 months)
 * - Yearly: 25% off vs monthly (price for 12 months)
 * - Pro: +70% of Basic monthly
 * - Premium: +110% of Basic monthly
 */

export type PlanTier = "basic" | "pro" | "premium"
export type BillingTerm = "monthly" | "quarterly" | "yearly"

export const QUARTERLY_DISCOUNT = 0.15 // 15% off
export const YEARLY_DISCOUNT = 0.25 // 25% off
export const PRO_MULTIPLIER = 1.7 // +70% of Basic
export const PREMIUM_MULTIPLIER = 2.1 // +110% of Basic

/** Get monthly price for a tier (Basic monthly = base). */
export function getMonthlyPrice(baseMonthlyCents: number, tier: PlanTier): number {
  switch (tier) {
    case "basic":
      return baseMonthlyCents
    case "pro":
      return Math.round(baseMonthlyCents * PRO_MULTIPLIER)
    case "premium":
      return Math.round(baseMonthlyCents * PREMIUM_MULTIPLIER)
    default:
      return baseMonthlyCents
  }
}

/** Get price in cents for a plan (tier + term) from Basic monthly base. */
export function getPriceCents(
  baseMonthlyCents: number,
  tier: PlanTier,
  term: BillingTerm
): number {
  const monthly = getMonthlyPrice(baseMonthlyCents, tier)
  switch (term) {
    case "monthly":
      return monthly
    case "quarterly":
      return Math.round(monthly * 3 * (1 - QUARTERLY_DISCOUNT))
    case "yearly":
      return Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT))
    default:
      return monthly
  }
}

/** Get price in dollars for display. */
export function getPriceDollars(
  baseMonthlyCents: number,
  tier: PlanTier,
  term: BillingTerm
): number {
  return getPriceCents(baseMonthlyCents, tier, term) / 100
}
