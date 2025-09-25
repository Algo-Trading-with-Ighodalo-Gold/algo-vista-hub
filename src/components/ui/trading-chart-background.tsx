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

    // Generate candlestick data
    const candleCount = intensity === 'low' ? 25 : intensity === 'medium' ? 40 : 60
    const candleWidth = canvas.width / (candleCount + 10)
    const candles = Array.from({ length: candleCount }, (_, i) => {
      const x = (i + 5) * candleWidth
      const high = Math.random() * canvas.height * 0.3 + canvas.height * 0.2
      const low = high + Math.random() * canvas.height * 0.4 + 50
      const open = high + Math.random() * (low - high)
      const close = high + Math.random() * (low - high)
      
      return {
        x,
        open,
        high,
        low,
        close,
        bullish: close > open,
        volume: Math.random() * 0.3 + 0.1
      }
    })

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Grid lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      
      // Horizontal grid lines
      for (let i = 0; i < 20; i++) {
        const y = (i / 19) * canvas.height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Vertical grid lines
      for (let i = 0; i < 30; i++) {
        const x = (i / 29) * canvas.width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Trend lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.6
      
      // Main trend line
      ctx.beginPath()
      for (let i = 0; i < canvas.width; i += 20) {
        const y = canvas.height * 0.3 + Math.sin((i + time * 50) * 0.01) * 100
        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }
      ctx.stroke()

      // Secondary trend line
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)'
      ctx.beginPath()
      for (let i = 0; i < canvas.width; i += 25) {
        const y = canvas.height * 0.6 + Math.sin((i + time * 30) * 0.008) * 80
        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }
      ctx.stroke()

      // Candlesticks
      candles.forEach((candle, index) => {
        const bodyHeight = Math.abs(candle.close - candle.open)
        const bodyTop = Math.min(candle.close, candle.open)
        const wickColor = candle.bullish ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        const bodyColor = candle.bullish ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'
        
        ctx.globalAlpha = intensity === 'low' ? 0.4 : intensity === 'medium' ? 0.6 : 0.8
        
        // Wick
        ctx.strokeStyle = wickColor
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(candle.x, candle.high)
        ctx.lineTo(candle.x, candle.low)
        ctx.stroke()
        
        // Body
        ctx.fillStyle = bodyColor
        if (candle.bullish) {
          ctx.strokeStyle = bodyColor
          ctx.lineWidth = 1
          ctx.strokeRect(candle.x - candleWidth * 0.3, bodyTop, candleWidth * 0.6, bodyHeight)
        } else {
          ctx.fillRect(candle.x - candleWidth * 0.3, bodyTop, candleWidth * 0.6, bodyHeight)
        }
        
        // Volume bars at bottom
        const volumeHeight = candle.volume * 50
        const volumeY = canvas.height - volumeHeight - 20
        ctx.fillStyle = `rgba(34, 197, 94, ${0.2 + candle.volume * 0.3})`
        ctx.fillRect(candle.x - candleWidth * 0.2, volumeY, candleWidth * 0.4, volumeHeight)
      })

      // Floating particles
      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'
      ctx.globalAlpha = 0.7
      for (let i = 0; i < 8; i++) {
        const x = (time * 20 + i * 150) % (canvas.width + 100)
        const y = 80 + Math.sin(time * 0.008 + i) * 40
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      time += 1
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