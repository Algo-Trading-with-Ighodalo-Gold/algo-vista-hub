import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface FloatingIconProps {
  icon: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  delay?: number
}

export function FloatingIcon({ icon, className, size = 'md', delay = 0 }: FloatingIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base', 
    lg: 'w-16 h-16 text-lg'
  }

  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center animate-float-complex hover-glow cursor-pointer transition-all duration-300 hover:scale-110",
        sizeClasses[size],
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {icon}
    </div>
  )
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 2000, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span className={cn("tabular-nums", className)}>
      {count}
    </span>
  )
}

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <button
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Hover effect background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
        style={{
          transform: `translateX(${position.x * 2}px)`,
        }}
      />
      
      {/* Button content */}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  )
}

interface GlowingOrbProps {
  className?: string
  size?: number
  color?: 'primary' | 'accent' | 'success'
}

export function GlowingOrb({ className, size = 100, color = 'primary' }: GlowingOrbProps) {
  const colorClasses = {
    primary: 'bg-primary/20 shadow-primary/50',
    accent: 'bg-accent/20 shadow-accent/50', 
    success: 'bg-success/20 shadow-success/50'
  }

  return (
    <div
      className={cn(
        "absolute rounded-full blur-xl animate-pulse-slow pointer-events-none",
        colorClasses[color],
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: `0 0 ${size}px currentColor`,
      }}
    />
  )
}