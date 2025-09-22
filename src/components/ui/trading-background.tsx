import { cn } from '@/lib/utils'

interface TradingBackgroundProps {
  variant?: 'purple-waves' | 'trading-grid' | 'crypto-matrix' | 'neural-network'
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function TradingBackground({ 
  variant = 'purple-waves', 
  className,
  intensity = 'medium'
}: TradingBackgroundProps) {
  
  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'low': return 'opacity-30'
      case 'medium': return 'opacity-50'
      case 'high': return 'opacity-70'
      default: return 'opacity-50'
    }
  }

  const renderVariant = () => {
    switch (variant) {
      case 'purple-waves':
        return (
          <>
            {/* Animated gradient waves */}
            <div className="absolute inset-0 gradient-trading animate-gradient-wave" />
            
            {/* Floating orbs */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full gradient-secondary animate-pulse-slow shadow-trading"
                style={{
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 200 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              />
            ))}
            
            {/* Purple rays */}
            <div className="absolute inset-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-trading-ray"
                  style={{
                    width: '200%',
                    left: '-50%',
                    top: `${20 + i * 15}%`,
                    transform: `rotate(${i * 30}deg)`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </>
        )
      
      case 'trading-grid':
        return (
          <>
            {/* Trading grid pattern */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="trading-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.5" />
                    <rect x="5" y="5" width="1" height="1" fill="hsl(var(--primary) / 0.3)" className="animate-pulse-slow" />
                  </pattern>
                  <linearGradient id="trading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                    <stop offset="50%" stopColor="hsl(var(--accent) / 0.1)" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#trading-grid)" />
                <rect width="100%" height="100%" fill="url(#trading-gradient)" className="animate-trading-flow" />
              </svg>
            </div>
            
            {/* Trading indicators */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-trading-pulse shadow-glow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </>
        )
      
      case 'crypto-matrix':
        return (
          <>
            {/* Matrix-style background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />
            
            {/* Falling code effect */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-matrix-fall opacity-40"
                style={{
                  left: `${i * 5}%`,
                  fontSize: '12px',
                  color: 'hsl(var(--primary))',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} className="mb-2">
                    {Math.random().toString(36).substring(2, 5)}
                  </div>
                ))}
              </div>
            ))}
            
            {/* Glowing nodes */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full animate-glow-pulse shadow-trading"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </>
        )
      
      case 'neural-network':
        return (
          <>
            {/* Neural network background */}
            <div className="absolute inset-0">
              <svg className="w-full h-full">
                {Array.from({ length: 25 }).map((_, i) => {
                  const x = Math.random() * 100
                  const y = Math.random() * 100
                  return (
                    <g key={i}>
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="2"
                        fill="hsl(var(--primary) / 0.6)"
                        className="animate-neural-pulse"
                        style={{ animationDelay: `${Math.random() * 2}s` }}
                      />
                      {Array.from({ length: 3 }).map((_, j) => {
                        const targetX = Math.random() * 100
                        const targetY = Math.random() * 100
                        return (
                          <line
                            key={j}
                            x1={`${x}%`}
                            y1={`${y}%`}
                            x2={`${targetX}%`}
                            y2={`${targetY}%`}
                            stroke="hsl(var(--primary) / 0.2)"
                            strokeWidth="1"
                            className="animate-neural-connection"
                            style={{ animationDelay: `${Math.random() * 3}s` }}
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </svg>
            </div>
            
            {/* Data flow particles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-accent rounded-full animate-data-flow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none -z-10",
      getIntensityOpacity(),
      className
    )}>
      {renderVariant()}
    </div>
  )
}