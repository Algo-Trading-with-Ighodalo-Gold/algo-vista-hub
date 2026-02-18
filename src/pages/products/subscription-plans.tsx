import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  type BillingInterval,
  type PricingFeature,
  type PricingPlan,
  type PlanLevel,
  PricingTable,
} from "@/components/ui/pricing-table"
import { CandlestickBackground } from "@/components/ui/candlestick-background"
import { supabase } from "@/integrations/supabase/client"
import { getPriceDollars, type PlanTier, type BillingTerm } from "@/lib/ea-pricing"

type Product = {
  id: string
  name: string
  product_code: string
  price_cents?: number | null
}

type PlanId = "basic" | "pro" | "premium"
type PlanPriceMap = Partial<Record<BillingInterval, number>>
type PlanIdMap = Partial<Record<BillingInterval, string>>

type EaPlanRow = {
  id: string
  ea_id: string
  tier: PlanId
  term: BillingInterval
  max_accounts: number
  price_cents: number
  is_active: boolean
}

// Base monthly price for Basic tier (cents). Fallback when no DB plans.
const FALLBACK_BASE_MONTHLY_CENTS = 2900 // $29

function getFallbackPrice(planId: PlanId, period: BillingInterval): number {
  return getPriceDollars(FALLBACK_BASE_MONTHLY_CENTS, planId as PlanTier, period as BillingTerm)
}

const planLabels: Record<PlanId, { name: string; maxAccounts: number; popular?: boolean; features: string[] }> = {
  basic: {
    name: "Basic",
    maxAccounts: 1,
    features: ["1 MT5 account", "Core EA updates", "Email support", "Setup guide"],
  },
  pro: {
    name: "Pro", 
    maxAccounts: 2,
    popular: true,
    features: ["2 MT5 accounts", "Priority support", "Strategy updates", "Performance insights"],
  },
  premium: {
    name: "Premium",
    maxAccounts: 3,
    features: ["3 MT5 accounts", "Fast support", "Advanced analytics", "All premium updates"],
  },
}

export default function SubscriptionPlansPage() {
  const { eaId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro")
  const [billingPeriod, setBillingPeriod] = useState<BillingInterval>("monthly")
  const [planPrices, setPlanPrices] = useState<Record<PlanId, PlanPriceMap>>({
    basic: {},
    pro: {},
    premium: {},
  })
  const [planIds, setPlanIds] = useState<Record<PlanId, PlanIdMap>>({
    basic: {},
    pro: {},
    premium: {},
  })
  const [baseMonthlyCents, setBaseMonthlyCents] = useState<number>(FALLBACK_BASE_MONTHLY_CENTS)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchProductAndPlans = async () => {
      if (!eaId) return navigate("/products")

      const { data, error } = await supabase
        .from("products")
        .select("id, name, product_code, price_cents")
        .or(`product_code.eq.${eaId},id.eq.${eaId}`)
        .single()

      if (error || !data) return navigate("/products")

      const productData = data as Product
      setProduct(productData)
      if (Number(productData.price_cents || 0) > 0) {
        setBaseMonthlyCents(Number(productData.price_cents))
      }

      const { data: dbPlans } = await (supabase as any)
        .from("ea_plans")
        .select("id, ea_id, tier, term, max_accounts, price_cents, is_active")
        .eq("ea_id", productData.id)
        .eq("is_active", true)

      if (Array.isArray(dbPlans) && dbPlans.length > 0) {
        const prices: Record<PlanId, PlanPriceMap> = { basic: {}, pro: {}, premium: {} }
        const ids: Record<PlanId, PlanIdMap> = { basic: {}, pro: {}, premium: {} }
        const basicMonthly = dbPlans.find((row: EaPlanRow) => row.tier === "basic" && row.term === "monthly")
        if (basicMonthly && Number(basicMonthly.price_cents || 0) > 0) {
          setBaseMonthlyCents(Number(basicMonthly.price_cents))
        }
        dbPlans.forEach((row: EaPlanRow) => {
          prices[row.tier][row.term] = Number((row.price_cents || 0) / 100)
          ids[row.tier][row.term] = row.id
        })
        setPlanPrices(prices)
        setPlanIds(ids)
      }
    }

    fetchProductAndPlans()
  }, [eaId, navigate])

  if (!product) return null

  const getPrice = (planId: PlanId, period: BillingInterval) =>
    planPrices[planId]?.[period] ?? getPriceDollars(baseMonthlyCents, planId as PlanTier, period as BillingTerm)

  const pricingPlans: PricingPlan[] = (["basic", "pro", "premium"] as PlanId[]).map((id) => ({
    name: planLabels[id].name,
    level: id,
    popular: !!planLabels[id].popular,
    price: {
      monthly: getPrice(id, "monthly"),
      quarterly: getPrice(id, "quarterly"),
      yearly: getPrice(id, "yearly"),
    },
  }))

  const pricingFeatures: PricingFeature[] = [
    { name: "Linked MT5 accounts", included: "basic" },
    { name: "Core EA updates", included: "basic" },
    { name: "Email support", included: "basic" },
    { name: "Priority support", included: "pro" },
    { name: "Performance insights", included: "pro" },
    { name: "Advanced analytics", included: "premium" },
    { name: "All premium strategy updates", included: "premium" },
  ]

  // Allow checkout even if explicit ea_plan row is missing (amount-based fallback path).
  const canContinue = true

  const handlePlanSelection = (plan = selectedPlan, period = billingPeriod) => {
    const selectedEaPlanId = planIds[plan]?.[period]
    navigate("/payment", {
      state: {
        eaId: product.id,
        eaPlanId: selectedEaPlanId || "",
        eaName: product.name,
        productCode: product.product_code,
        planId: plan,
        planName: planLabels[plan].name,
        maxAccounts: planLabels[plan].maxAccounts,
        billingPeriod: period,
        price: getPrice(plan, period),
        features: planLabels[plan].features,
        paymentMethod: "checkout",
      },
    })
  }

  return (
    <div className="min-h-screen relative">
      <CandlestickBackground variant="products" intensity="low" />
      
      <section className="py-6 border-b bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products/${product.product_code}`} className="hover:text-accent transition-colors">{product.name}</Link>
            <span>/</span>
            <span className="text-foreground">Plans</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-subtle border-b">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
                  <Star className="h-3 w-3 mr-1" />
              Choose Your Subscription Plan
                </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pick a plan before checkout. Your account limit is tied to the plan you choose.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <PricingTable
            plans={pricingPlans}
            features={pricingFeatures}
            defaultPlan={selectedPlan}
            defaultInterval={billingPeriod}
            onPlanSelect={(plan) => setSelectedPlan(plan as PlanId)}
            onIntervalChange={setBillingPeriod}
            onGetStarted={(plan, interval) => handlePlanSelection(plan as PlanId, interval)}
            getStartedDisabled={!canContinue}
          />
        </div>
      </section>
    </div>
  )
}