import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  shape: 'circle' | 'square' | 'triangle' | 'diamond'
}

interface FloatingBackgroundProps {
  className?: string
  elementCount?: number
  variant?: 'geometric' | 'particles' | 'bubbles'
}

export function FloatingBackground({ 
  className, 
  elementCount = 15,
  variant = 'geometric' 
}: FloatingBackgroundProps) {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    const newElements: FloatingElement[] = []
    
    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        shape: ['circle', 'square', 'triangle', 'diamond'][Math.floor(Math.random() * 4)] as FloatingElement['shape']
      })
    }
    
    setElements(newElements)
  }, [elementCount])

  const getShapeClasses = (shape: FloatingElement['shape']) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-lg'
      case 'triangle':
        return 'clip-triangle'
      case 'diamond':
        return 'rotate-45 rounded-md'
      default:
        return 'rounded-full'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'particles':
        return 'bg-primary/5 border border-primary/10'
      case 'bubbles':
        return 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm'
      default:
        return 'bg-gradient-to-br from-primary/8 to-accent/8 border border-primary/15'
    }
  }

  return (
    <div className={cn(
      "fixed inset-0 overflow-hidden pointer-events-none -z-10",
      className
    )}>
      {elements.map((element) => (
        <div
          key={element.id}
          className={cn(
            "absolute animate-float-complex opacity-60",
            getShapeClasses(element.shape),
            getVariantClasses()
          )}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
      
      {/* Floating orbs with glow effect */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse-slow" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-3/4 w-40 h-40 bg-success/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
    </div>
  )
}

// Floating dots for subtle animation
export function FloatingDots({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float-dot"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}