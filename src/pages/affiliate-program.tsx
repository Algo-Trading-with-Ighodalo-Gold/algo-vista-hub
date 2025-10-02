import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AffiliateProgramPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container relative py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              💰 High Converting Affiliate Program
            </Badge>
            <h1 className="text-hero font-bold tracking-tight animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Earn by Referring{" "}
              <span className="text-gradient">Traders</span>
            </h1>
            <p className="mt-6 text-body leading-7 text-muted-foreground max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              Join our exclusive affiliate program and earn up to 35% commission promoting premium Expert Advisors 
              to the algorithmic trading community. High converting products with proven results.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <Button size="lg" className="text-lg px-8 hover-scale" asChild>
                <Link to="/dashboard/affiliate">
                  Join Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 hover-scale" asChild>
                <Link to="/dashboard/affiliate">
                  View Commission Rates
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                Up to 35% Commission
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                60-Day Cookie Duration
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                Monthly Payouts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-title font-bold tracking-tight mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our affiliate program and start earning commissions today. Get access to detailed analytics, marketing materials, and competitive commission rates.
            </p>
            <Button size="lg" className="text-lg px-8 hover-scale" asChild>
              <Link to="/dashboard/affiliate">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}