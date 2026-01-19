import { Link } from "react-router-dom"
import { XCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Your payment could not be processed. This could be due to:
              </p>
              <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1 max-w-md mx-auto">
                <li>Insufficient funds</li>
                <li>Card declined by your bank</li>
                <li>Network issues</li>
                <li>Payment timeout</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/support">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
