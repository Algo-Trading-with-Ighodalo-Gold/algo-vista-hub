import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: "Reset Link Sent!",
        description: "Check your email for password reset instructions.",
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <div className="w-full max-w-md">
          <Card className="animate-fade-in text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to:
                <br />
                <strong className="text-foreground">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Click the link in the email to reset your password. If you don't see the email, 
                  check your spam folder.
                </p>
                <p>
                  The reset link will expire in 1 hour for security reasons.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail("")
                  }}
                  variant="outline" 
                  className="w-full hover-scale"
                >
                  Try Different Email
                </Button>
                <Button asChild className="w-full hover-scale">
                  <Link to="/auth/login">
                    Back to Login
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Still having trouble?{" "}
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
        <div className="mb-6 animate-fade-in">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>

        <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
            <CardDescription>
              No worries! Enter your email address and we'll send you instructions to reset your password.
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
                  placeholder="Enter your registered email"
                  autoFocus
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

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
          <div className="space-y-2">
            <p>
              For security reasons, password reset links expire after 1 hour.
            </p>
            <p>
              Need help?{" "}
              <Link to="/support" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}