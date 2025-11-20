import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { validateRegistrationForm } from '@/lib/validation'
import { UserAPI } from '@/lib/api'
import { ErrorHandler } from '@/lib/error-handler'
import { log } from '@/lib/logger'
import { security } from '@/lib/security'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Validate input data
      const validation = validateRegistrationForm({
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        password,
        confirmPassword: password
      })

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        toast({
          title: "Validation Failed",
          description: firstError,
          variant: "destructive",
        })
        return { error: { message: firstError } }
      }

      // Check rate limiting
      if (!security.checkRateLimit(email)) {
        toast({
          title: "Too Many Requests",
          description: "Please wait before trying again.",
          variant: "destructive",
        })
        return { error: { message: "Rate limit exceeded" } }
      }

      const redirectUrl = `${window.location.origin}/`
      
      const { data, error } = await supabase.auth.signUp({
        email: security.sanitizeInput(email),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName ? security.sanitizeInput(firstName) : undefined,
            last_name: lastName ? security.sanitizeInput(lastName) : undefined
          }
        }
      })

      if (error) {
        log.error('Signup failed', { email, error: error.message })
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // Create user profile
        if (data.user) {
          const profileResult = await UserAPI.createProfile(data.user.id, {
            first_name: firstName || '',
            last_name: lastName || ''
          })
          
          if (!profileResult.success) {
            log.error('Failed to create user profile', { userId: data.user.id, error: profileResult.error })
          }
        }

        log.userAction('User registered', data.user?.id, { email })
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        })
      }

      return { error }
    } catch (error: any) {
      log.error('Signup error', { email, error: error.message })
      const errorResponse = ErrorHandler.handle(error)
      toast({
        title: "Signup Failed", 
        description: errorResponse.error,
        variant: "destructive",
      })
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Check if account is locked
      if (security.isAccountLocked(email)) {
        toast({
          title: "Account Locked",
          description: "Too many failed attempts. Please try again later.",
          variant: "destructive",
        })
        return { error: { message: "Account locked" } }
      }

      // Check rate limiting
      if (!security.checkRateLimit(email)) {
        toast({
          title: "Too Many Requests",
          description: "Please wait before trying again.",
          variant: "destructive",
        })
        return { error: { message: "Rate limit exceeded" } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: security.sanitizeInput(email),
        password,
      })

      if (error) {
        // Record failed login attempt
        security.recordLoginAttempt(email, false)
        log.error('Login failed', { email, error: error.message })
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // Record successful login
        security.recordLoginAttempt(email, true)
        log.userAction('User logged in', data.user?.id, { email })
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        })
      }

      return { error }
    } catch (error: any) {
      log.error('Login error', { email, error: error.message })
      const errorResponse = ErrorHandler.handle(error)
      toast({
        title: "Login Failed",
        description: errorResponse.error,
        variant: "destructive",
      })
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Logged out",
          description: "You've been successfully logged out.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        })
      }

      return { error }
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}