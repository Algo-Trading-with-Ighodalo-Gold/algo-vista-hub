// Import EA images
import goldRushImage from "@/assets/gold-rush-ea.jpg"
import trendRiderImage from "@/assets/trend-rider-ea.jpg"
import gridTraderImage from "@/assets/grid-trader-ea.jpg"

export const expertAdvisors = [
  {
    id: "ighodalo-gold-milker-ea",
    name: "Ighodalo Gold Milker EA",
    shortDescription: "Precision-engineered swing/trend hybrid EA built exclusively for XAUUSD.",
    description:
      "Ighodalo Gold Milker EA is a precision-engineered trading robot built specifically for XAUUSD. It identifies high-probability swing zones, volatility expansions, and retracements on gold with advanced confirmation filters.",
    features: [
      "Gold-optimized algorithm with smart volatility detection",
      "Trailing stop & break-even automation with daily risk controls",
      "Trend + momentum multi-layer confirmation",
      "Anti-overtrading safety engine and multiple risk modes",
      "Session awareness tuned for London & NY trading",
      "Daily risk management and multiple risk modes",
      "Works best during London & NY sessions"
    ],
    image: goldRushImage,
    rating: 4.9,
    reviews: 182,
    price: "$349",
    priceAmount: 349,
    tradingPairs: "XAUUSD",
    timeframes: "M15, H1",
    strategyType: "Swing / Trend Hybrid",
    minDeposit: "$300 - $1,000",
    avgMonthlyReturn: "10 - 20%",
    maxDrawdown: "8 - 12%",
    performance: "+268%",
    tags: ["Gold", "Swing", "Medium Risk"]
  },
  {
    id: "belema-sfp-ea",
    name: "Belema SFP EA",
    shortDescription: "Smart Fractal Pattern (SFP) + liquidity sweep sniper EA for reversals.",
    description:
      "Belema SFP EA uses Smart Fractal Patterns and liquidity sweep detection to catch high-accuracy reversal entries. Built for traders who want sniper entries with tight stop-losses and strong reward potential.",
    features: [
      "Smart Fractal Pattern (SFP) detection",
      "Liquidity sweep identification and breaker block confirmation",
      "High R:R setups (1:3 - 1:8)",
      "News protection, spread filters, and tight stop-loss structure",
      "Suitable for indices, forex & gold",
      "Sniper entries with liquidity sweeps"
    ],
    image: trendRiderImage,
    rating: 4.8,
    reviews: 154,
    price: "$299",
    priceAmount: 299,
    tradingPairs: "EURUSD, GBPUSD, XAUUSD, US30",
    timeframes: "M5 - M30",
    strategyType: "Reversal / Liquidity Grab",
    minDeposit: "$200+",
    avgMonthlyReturn: "12 - 25%",
    maxDrawdown: "6 - 10%",
    performance: "+312%",
    tags: ["Sniper Entries", "Liquidity Grab", "Medium-High Risk"]
  },
  {
    id: "bb-martingale-ea",
    name: "BB Martingale EA",
    shortDescription: "Controlled-risk Bollinger-based grid & martingale engine.",
    description:
      "BB Martingale EA is a controlled-risk Bollinger-based grid/martingale EA designed for assets with consistent retracement behavior. It uses volatility-based grid spacing and a safe martingale multiplier.",
    features: [
      "Dynamic, volatility-based grid spacing",
      "Smart martingale multiplier and Bollinger Band deviation logic",
      "Auto-recovery trades with trend-bias safety mode",
      "Drawdown protection systems"
    ],
    image: gridTraderImage,
    rating: 4.7,
    reviews: 138,
    price: "$329",
    priceAmount: 329,
    tradingPairs: "EURUSD, USDJPY",
    timeframes: "M5, M15",
    strategyType: "Grid + Martingale",
    minDeposit: "$300 - $1,500",
    avgMonthlyReturn: "15 - 30%",
    maxDrawdown: "12 - 20%",
    performance: "+354%",
    tags: ["Grid", "Martingale", "Medium-High Risk"]
  }
]

// Get featured EAs (top 3 by rating and performance)
export const getFeaturedEAs = () => {
  return expertAdvisors
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
}

// Get EA by ID
export const getEAById = (id: string) => {
  return expertAdvisors.find(ea => ea.id === id)
}