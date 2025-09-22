import { Header } from "./header"
import { Footer } from "./footer" 
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { TradingBackground } from "@/components/ui/trading-background"
import { CandlestickBackground } from "@/components/ui/candlestick-background"

interface EnhancedLayoutProps {
  children: React.ReactNode
}

export function EnhancedLayout({ children }: EnhancedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Multi-layered Animated Backgrounds */}
      <TradingBackground variant="purple-waves" intensity="medium" />
      <AnimatedBackground variant="neural" className="opacity-30" />
      <FloatingBackground elementCount={20} variant="bubbles" className="opacity-40" />
      <CandlestickBackground variant="trading" intensity="medium" />
      
      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        <main className="flex-1 relative">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}