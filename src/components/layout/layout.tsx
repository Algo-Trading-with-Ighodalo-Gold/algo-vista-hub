import { Header } from "./header"
import { Footer } from "./footer"

interface BaseLayoutProps {
  children: React.ReactNode
}

function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export { BaseLayout as Layout }