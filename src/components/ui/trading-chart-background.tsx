import { useEffect, useRef } from 'react'

interface TradingChartBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function TradingChartBackground({ 
  className = '', 
  intensity = 'medium' 
}: TradingChartBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Trading data points
    const lines = Array.from({ length: intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8 }, (_, i) => ({
      points: Array.from({ length: 50 }, (_, j) => ({
        x: (j / 49) * canvas.width,
        y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
        originalY: Math.random() * canvas.height * 0.8 + canvas.height * 0.1
      })),
      color: `hsl(${260 + i * 20}, 70%, ${60 + i * 5}%)`,
      speed: 0.5 + Math.random() * 0.5,
      amplitude: 20 + Math.random() * 40,
      offset: i * Math.PI / 4
    }))

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      lines.forEach((line, lineIndex) => {
        ctx.strokeStyle = line.color
        ctx.lineWidth = 1.5
        ctx.globalAlpha = intensity === 'low' ? 0.15 : intensity === 'medium' ? 0.25 : 0.35
        ctx.beginPath()

        line.points.forEach((point, i) => {
          // Animate the points
          const wave = Math.sin(time * line.speed + line.offset + i * 0.1) * line.amplitude
          point.y = point.originalY + wave

          if (i === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })

        ctx.stroke()

        // Add some floating particles
        if (lineIndex === 0) {
          ctx.fillStyle = line.color
          ctx.globalAlpha = 0.6
          for (let i = 0; i < 5; i++) {
            const x = (time * 30 + i * 100) % (canvas.width + 100)
            const y = 100 + Math.sin(time * 0.01 + i) * 50
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      time += 0.005
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}