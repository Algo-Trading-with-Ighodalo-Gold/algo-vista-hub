import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}