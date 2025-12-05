import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/integrations/supabase/client'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        // Use the is_admin() RPC function to avoid RLS recursion issues
        const { data, error } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        })

        if (error) {
          console.error('Error checking admin status:', error)
          // Fallback: try direct query if RPC fails
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('user_id', user.id)
              .single()
            
            if (!profileError && profileData) {
              setIsAdmin(profileData?.role === 'admin' || profileData?.role === 'worker')
            } else {
              setIsAdmin(false)
            }
          } catch (fallbackError) {
            console.error('Fallback admin check failed:', fallbackError)
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(data === true)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    if (!authLoading) {
      checkAdminStatus()
    }
  }, [user, authLoading])

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}




