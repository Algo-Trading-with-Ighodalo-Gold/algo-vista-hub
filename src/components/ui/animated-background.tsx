import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  variant?: 'gradient-wave' | 'mesh' | 'particles' | 'neural' | 'geometric'
  className?: string
}

export function AnimatedBackground({ 
  variant = 'gradient-wave', 
  className 
}: AnimatedBackgroundProps) {
  
  const renderVariant = () => {
    switch (variant) {
      case 'gradient-wave':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-wave animate-gradient-wave" />
          </div>
        )
      
      case 'mesh':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-mesh animate-mesh-move" />
          </div>
        )
      
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full animate-particle-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${15 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        )
      
      case 'neural':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="hsl(var(--primary) / 0.1)" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--primary) / 0.05)" strokeWidth="1" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="hsl(var(--primary) / 0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural-pattern)" className="animate-neural-pulse" />
            </svg>
          </div>
        )
      
      case 'geometric':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute border border-primary/10 animate-geometric-rotate",
                  i % 3 === 0 ? "w-20 h-20" : i % 3 === 1 ? "w-16 h-16 rounded-full" : "w-12 h-12 rotate-45"
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${20 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none -z-10 opacity-70",
      className
    )}>
      {renderVariant()}
    </div>
  )
}