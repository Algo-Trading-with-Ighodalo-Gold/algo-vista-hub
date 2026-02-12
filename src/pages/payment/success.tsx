import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { paymentAPI } from "@/lib/api/payments"
import { supabase } from "@/integrations/supabase/client"

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [license, setLicense] = useState<any>(null)

  const reference = searchParams.get('reference') || searchParams.get('checkout_id') || searchParams.get('id')

  useEffect(() => {
    if (!reference) {
      toast({
        title: "Error",
        description: "No payment reference found",
        variant: "destructive"
      })
      navigate("/products")
      return
    }

    const verifyPayment = async () => {
      try {
        setVerifying(true)
        
        // Verify payment with Polar
        const transaction = await paymentAPI.verifyPolarCheckout(reference)
        
        if (['success', 'succeeded', 'completed'].includes(transaction.status)) {
          setPaymentData(transaction)
          
          // Wait a bit for webhook to process, then fetch license
          setTimeout(async () => {
            const { data: licenses } = await supabase
              .from('licenses')
              .select('*')
              .eq('user_id', user?.id)
              .order('created_at', { ascending: false })
              .limit(1)
            
            if (licenses && licenses.length > 0) {
              setLicense(licenses[0])
            }
          }, 2000)
        } else {
          toast({
            title: "Payment Not Completed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive"
          })
          navigate("/products")
        }
      } catch (error: any) {
        console.error("Payment verification error:", error)
        toast({
          title: "Verification Error",
          description: error.message || "Failed to verify payment. Please contact support.",
          variant: "destructive"
        })
      } finally {
        setVerifying(false)
      }
    }

    if (user && reference) {
      verifyPayment()
    }
  }, [reference, user, navigate, toast])

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Reference:</span>
                  <span className="font-mono">{paymentData.reference || paymentData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {paymentData.currency === 'USD' ? '$' : `${paymentData.currency} `}
                    {(paymentData.amount / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-success">Completed</span>
                </div>
              </div>
            )}

            {license ? (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Your License Key</h3>
                </div>
                <div className="p-3 bg-background rounded border font-mono text-sm break-all">
                  {license.license_key}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your license key has been sent to your email address. You can also find it in your dashboard.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">License Processing</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your license is being processed. You will receive an email with your license key shortly.
                  You can also check your dashboard for updates.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link to="/dashboard/licenses">
                  View Licenses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
