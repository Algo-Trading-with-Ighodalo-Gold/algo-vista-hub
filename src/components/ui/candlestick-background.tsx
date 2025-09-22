import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CandlestickProps {
  x: number
  y: number
  delay: number
  duration: number
  type?: 'bullish' | 'bearish'
}

interface CandlestickBackgroundProps {
  variant?: 'trading' | 'dashboard' | 'products' | 'minimal'
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

function Candlestick({ x, y, delay, duration, type = 'bullish' }: CandlestickProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const candleColor = type === 'bullish' ? 'text-green-400/30' : 'text-red-400/30'
  const wickColor = type === 'bullish' ? 'stroke-green-400/20' : 'stroke-red-400/20'

  return (
    <div
      className={cn(
        "absolute transition-all duration-1000 animate-float-complex",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}ms`
      }}
    >
      <svg width="16" height="40" viewBox="0 0 16 40" className="drop-shadow-sm">
        {/* Wick */}
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="38"
          strokeWidth="1"
          className={wickColor}
        />
        {/* Body */}
        <rect
          x="4"
          y={type === 'bullish' ? "12" : "16"}
          width="8"
          height="12"
          className={cn("fill-current", candleColor)}
          rx="1"
        />
      </svg>
    </div>
  )
}

function TradingChart({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        className="absolute inset-0"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Trend lines */}
        <path
          d="M50,400 Q200,350 400,320 T800,280"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.15"
          strokeWidth="2"
          className="animate-pulse"
        />
        <path
          d="M100,450 Q300,400 500,380 T900,340"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.1"
          strokeWidth="1"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
      
      {/* Floating indicators */}
      <div className="absolute top-10 left-10 flex items-center gap-2 opacity-30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Live</span>
      </div>
      
      <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-20">
        <span className="text-xs text-muted-foreground">MT5</span>
        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
      </div>
    </div>
  )
}

export function CandlestickBackground({ 
  variant = 'trading', 
  className,
  intensity = 'medium' 
}: CandlestickBackgroundProps) {
  const [candlesticks, setCandlesticks] = useState<CandlestickProps[]>([])

  useEffect(() => {
    const candleCount = {
      low: 8,
      medium: 12,
      high: 20
    }[intensity]

    const newCandlesticks = Array.from({ length: candleCount }, (_, i) => ({
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 3000,
      duration: 15 + Math.random() * 10,
      type: Math.random() > 0.5 ? 'bullish' : 'bearish' as 'bullish' | 'bearish'
    }))

    setCandlesticks(newCandlesticks)
  }, [intensity])

  const getVariantClasses = () => {
    switch (variant) {
      case 'dashboard':
        return "opacity-20"
      case 'products':
        return "opacity-25"
      case 'minimal':
        return "opacity-15"
      default:
        return "opacity-30"
    }
  }

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none -z-10",
      getVariantClasses(),
      className
    )}>
      {variant !== 'minimal' && <TradingChart />}
      
      {candlesticks.map((candle, index) => (
        <Candlestick
          key={index}
          {...candle}
        />
      ))}
      
      {/* Additional floating elements for enhanced effect */}
      {variant === 'trading' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/20 rounded-full animate-ping" 
               style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/20 rounded-full animate-ping" 
               style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-400/20 rounded-full animate-ping" 
               style={{ animationDelay: '6s' }} />
        </>
      )}
    </div>
  )
}