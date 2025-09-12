import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FloatingCursorProps {
  className?: string
}

export function FloatingCursor({ className }: FloatingCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed pointer-events-none z-50 w-6 h-6 rounded-full border-2 border-primary/50 bg-primary/10 backdrop-blur-sm transition-all duration-150 ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50",
        className
      )}
      style={{
        left: position.x - 12,
        top: position.y - 12,
      }}
    >
      <div className="absolute inset-1 rounded-full bg-primary/20 animate-pulse" />
    </div>
  )
}