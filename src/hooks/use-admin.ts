import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/integrations/supabase/client'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
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
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  return { isAdmin, loading }
}




