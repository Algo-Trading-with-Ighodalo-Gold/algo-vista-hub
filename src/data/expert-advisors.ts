// Import EA images
import scalperProImage from "@/assets/scalper-pro-ea.jpg"
import swingMasterImage from "@/assets/swing-master-ea.jpg"
import gridTraderImage from "@/assets/grid-trader-ea.jpg"
import trendRiderImage from "@/assets/trend-rider-ea.jpg"
import goldRushImage from "@/assets/gold-rush-ea.jpg"
import nightOwlImage from "@/assets/night-owl-ea.jpg"
import cryptoPulseImage from "@/assets/crypto-pulse-ea.jpg"

export const expertAdvisors = [
  {
    id: "scalper-pro-ea",
    name: "Scalper Pro EA",
    shortDescription: "High-frequency scalping strategy with advanced risk management",
    description: "Scalper Pro EA is designed for traders who want to capitalize on small price movements throughout the day. This EA uses sophisticated algorithms to identify optimal entry and exit points in volatile markets.",
    features: [
      "High-frequency trading capabilities",
      "Advanced risk management system",
      "Real-time market analysis",
      "Multiple currency pair support",
      "Low drawdown strategy"
    ],
    image: scalperProImage,
    rating: 4.8,
    reviews: 127,
    price: "$149",
    tradingPairs: "EURUSD, GBPUSD, USDJPY",
    timeframes: "M1, M5",
    strategyType: "Scalping",
    minDeposit: "$500",
    avgMonthlyReturn: "12-18%",
    maxDrawdown: "8%",
    performance: "+234.5%",
    tags: ["EURUSD", "Scalping", "High Frequency"]
  },
  {
    id: "swing-master-ea",
    name: "Swing Master EA",
    shortDescription: "Medium-term swing trading with trend following algorithms",
    description: "Swing Master EA captures medium-term market movements using advanced trend analysis. Perfect for traders who prefer less frequent but more substantial trades with higher profit potential.",
    features: [
      "Trend following algorithms",
      "Medium-term position holding",
      "Multiple timeframe analysis",
      "Automated stop-loss management",
      "Market volatility adaptation"
    ],
    image: swingMasterImage,
    rating: 4.6,
    reviews: 89,
    price: "$199",
    tradingPairs: "EURUSD, GBPUSD, AUDUSD, NZDUSD",
    timeframes: "H1, H4, D1",
    strategyType: "Swing Trading",
    minDeposit: "$1,000",
    avgMonthlyReturn: "8-15%",
    maxDrawdown: "12%",
    performance: "+186.2%",
    tags: ["Multi-Pair", "Swing Trading", "Medium Risk"]
  },
  {
    id: "grid-trader-ea",
    name: "Grid Trader EA",
    shortDescription: "Grid trading system with intelligent position management",
    description: "Grid Trader EA implements a sophisticated grid trading strategy that places orders at predetermined intervals. It includes intelligent recovery mechanisms and position sizing algorithms.",
    features: [
      "Intelligent grid placement",
      "Recovery mechanism",
      "Dynamic lot sizing",
      "Profit target optimization",
      "Risk control parameters"
    ],
    image: gridTraderImage,
    rating: 4.4,
    reviews: 156,
    price: "$179",
    tradingPairs: "EURUSD, GBPUSD",
    timeframes: "M15, M30, H1",
    strategyType: "Grid Trading",
    minDeposit: "$2,000",
    avgMonthlyReturn: "5-12%",
    maxDrawdown: "15%",
    performance: "+145.8%",
    tags: ["Grid Trading", "Low Risk", "Recovery System"]
  },
  {
    id: "trend-rider-ea",
    name: "Trend Rider EA",
    shortDescription: "Long-term trend following with momentum indicators",
    description: "Trend Rider EA is built for capturing long-term market trends using a combination of momentum indicators and price action analysis. Ideal for patient traders seeking consistent returns.",
    features: [
      "Long-term trend identification",
      "Momentum-based entries",
      "Trailing stop mechanisms",
      "Multi-currency optimization",
      "Low maintenance trading"
    ],
    image: trendRiderImage,
    rating: 4.7,
    reviews: 203,
    price: "$229",
    tradingPairs: "EURUSD, GBPUSD, USDJPY, AUDUSD",
    timeframes: "H4, D1, W1",
    strategyType: "Trend Following",
    minDeposit: "$1,500",
    avgMonthlyReturn: "10-20%",
    maxDrawdown: "10%",
    performance: "+312.8%",
    tags: ["Long-term", "Trend Following", "High Performance"]
  },
  {
    id: "gold-rush-ea",
    name: "Gold Rush EA",
    shortDescription: "Specialized gold trading with precious metals expertise",
    description: "Gold Rush EA is specifically designed for trading gold (XAUUSD) and other precious metals. It incorporates unique algorithms that understand the specific characteristics of precious metals markets.",
    features: [
      "Gold market specialization",
      "Precious metals optimization",
      "News event filtering",
      "Market session awareness",
      "Volatility-based sizing"
    ],
    image: goldRushImage,
    rating: 4.5,
    reviews: 94,
    price: "$189",
    tradingPairs: "XAUUSD, XAGUSD",
    timeframes: "M15, H1, H4",
    strategyType: "Commodity Trading",
    minDeposit: "$1,200",
    avgMonthlyReturn: "15-25%",
    maxDrawdown: "18%",
    performance: "+278.4%",
    tags: ["Gold", "Precious Metals", "Commodity"]
  },
  {
    id: "night-owl-ea",
    name: "Night Owl EA",
    shortDescription: "Asian session specialist for overnight trading",
    description: "Night Owl EA is optimized for the Asian trading session, taking advantage of lower volatility and specific market patterns that occur during overnight hours in Western markets.",
    features: [
      "Asian session optimization",
      "Low volatility strategies",
      "Overnight position management",
      "Time-based filtering",
      "Spread-aware trading"
    ],
    image: nightOwlImage,
    rating: 4.3,
    reviews: 67,
    price: "$159",
    tradingPairs: "USDJPY, AUDJPY, NZDJPY",
    timeframes: "M5, M15, M30",
    strategyType: "Session Trading",
    minDeposit: "$800",
    avgMonthlyReturn: "6-12%",
    maxDrawdown: "10%",
    performance: "+198.7%",
    tags: ["Asian Session", "Low Volatility", "Night Trading"]
  },
  {
    id: "crypto-pulse-ea",
    name: "Crypto Pulse EA",
    shortDescription: "Cryptocurrency trading with volatility-based algorithms",
    description: "Crypto Pulse EA is designed specifically for cryptocurrency markets, handling the unique volatility and 24/7 nature of digital asset trading with advanced risk management.",
    features: [
      "Cryptocurrency optimization",
      "24/7 trading capability",
      "Volatility adaptation",
      "Multi-coin support",
      "DeFi market awareness"
    ],
    image: cryptoPulseImage,
    rating: 4.9,
    reviews: 312,
    price: "$249",
    tradingPairs: "BTCUSD, ETHUSD, ADAUSD",
    timeframes: "M5, M15, H1",
    strategyType: "Crypto Trading",
    minDeposit: "$1,500",
    avgMonthlyReturn: "20-35%",
    maxDrawdown: "25%",
    performance: "+445.2%",
    tags: ["Crypto", "High Volatility", "24/7 Trading"]
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