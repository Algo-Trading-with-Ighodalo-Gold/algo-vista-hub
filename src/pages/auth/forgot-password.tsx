import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await resetPassword(email)
      
      if (!error) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <div className="w-full max-w-md">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-heading">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Click the link in your email to reset your password.</p>
                <p className="mt-2">
                  Don't see the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    try a different email address
                  </button>
                </p>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                Need help?{" "}
                <Link to="/support" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </div>
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
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full hover-scale" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending Reset Link...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <Button asChild variant="ghost" className="w-full">
                <Link to="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
              {" • "}
              <Link to="/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}