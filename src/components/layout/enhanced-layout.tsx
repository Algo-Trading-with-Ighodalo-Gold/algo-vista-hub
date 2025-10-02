import { Header } from "./header"
import { Footer } from "./footer" 
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { TradingBackground } from "@/components/ui/trading-background"
import { CandlestickBackground } from "@/components/ui/candlestick-background"
import { TradingChartBackground } from "@/components/ui/trading-chart-background"
import { LiveChatBot } from "@/components/ui/live-chat-bot"

interface EnhancedLayoutProps {
  children: React.ReactNode
}

export function EnhancedLayout({ children }: EnhancedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Multi-layered Animated Backgrounds */}
      <TradingChartBackground intensity="low" className="opacity-20" />
      <TradingBackground variant="purple-waves" intensity="low" />
      <AnimatedBackground variant="neural" className="opacity-15" />
      <FloatingBackground elementCount={15} variant="bubbles" className="opacity-20" />
      <CandlestickBackground variant="trading" intensity="low" />
      
      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        <main className="flex-1 relative">
          {children}
        </main>
        <Footer />
      </div>
      
      {/* Live Chat Bot */}
      <LiveChatBot />
    </div>
  )
}