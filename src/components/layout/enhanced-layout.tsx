import { Header } from "./header"
import { Footer } from "./footer"
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"

interface EnhancedLayoutProps {
  children: React.ReactNode
}

export function EnhancedLayout({ children }: EnhancedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Backgrounds */}
      <AnimatedBackground variant="gradient-wave" />
      <FloatingBackground elementCount={15} variant="bubbles" />
      
      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}