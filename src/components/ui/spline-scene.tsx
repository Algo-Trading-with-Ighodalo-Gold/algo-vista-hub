'use client'

import { Suspense, lazy, useRef, useEffect, useState } from 'react'
import type { Application } from '@splinetool/runtime'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineSceneComponent({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<Application | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const onLoad = (spline: Application) => {
    splineRef.current = spline
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      setMousePosition({ x, y })

      // Try to rotate the camera or scene objects
      if (splineRef.current) {
        try {
          // Access the camera if available
          const camera = splineRef.current.findObjectByName('Camera') || 
                        splineRef.current.findObjectByName('Main Camera')
          
          if (camera) {
            camera.rotation.x = y * 0.3
            camera.rotation.y = x * 0.3
          } else {
            // Try to rotate the root scene
            const scene = splineRef.current.findObjectByName('Scene')
            if (scene) {
              scene.rotation.x = y * 0.3
              scene.rotation.y = x * 0.3
            }
          }
        } catch (error) {
          // If direct manipulation doesn't work, Spline's built-in controls will handle it
          console.log('Using Spline built-in controls')
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => {
        container.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * 5}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <Spline
        scene={scene}
        onLoad={onLoad}
        className="w-full h-full"
      />
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <SplineSceneComponent scene={scene} className={className} />
    </Suspense>
  )
}
