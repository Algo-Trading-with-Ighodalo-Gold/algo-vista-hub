import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/integrations/supabase/client"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have a valid session (user clicked email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // No session means user didn't come from email link
        navigate('/auth/forgot-password', { replace: true })
      }
    }
    checkSession()
  }, [navigate])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getPasswordStrength = () => {
    const requirements = [
      { regex: /.{8,}/, weight: 20 },
      { regex: /[A-Z]/, weight: 20 },
      { regex: /[a-z]/, weight: 20 },
      { regex: /\d/, weight: 20 },
      { regex: /[^A-Za-z0-9]/, weight: 20 }
    ]
    
    const passed = requirements.filter(req => req.regex.test(formData.password))
    return passed.reduce((sum, req) => sum + req.weight, 0)
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    if (strength < 40) return { label: "Weak", color: "bg-destructive" }
    if (strength < 80) return { label: "Medium", color: "bg-warning" }
    return { label: "Strong", color: "bg-success" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return
    }

    if (getPasswordStrength() < 60) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await updatePassword(formData.password)

      if (!error) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login', { replace: true })
        }, 3000)
      }
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const strengthInfo = getPasswordStrengthLabel()

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <div className="w-full max-w-md">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-heading">Password Reset Successful!</CardTitle>
              <CardDescription>
                Your password has been successfully updated. Redirecting to login...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/auth/login')}
                className="w-full"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-heading">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="Enter your new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength</span>
                      <span className={`font-medium ${
                        strengthInfo.color === 'bg-destructive' ? 'text-destructive' :
                        strengthInfo.color === 'bg-warning' ? 'text-warning' :
                        'text-success'
                      }`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className={`h-2 rounded-full transition-all ${strengthInfo.color}`}
                        style={{ width: `${getPasswordStrength()}%` }}
                      />
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Password must contain:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li className={formData.password.length >= 8 ? 'text-success' : ''}>
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-success' : ''}>
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'text-success' : ''}>
                          One lowercase letter
                        </li>
                        <li className={/\d/.test(formData.password) ? 'text-success' : ''}>
                          One number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-success' : ''}>
                          One special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Confirm your new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full hover-scale" 
                disabled={isLoading || formData.password !== formData.confirmPassword || getPasswordStrength() < 60}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating Password...
                  </div>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






