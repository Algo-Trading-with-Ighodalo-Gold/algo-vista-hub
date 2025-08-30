import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Products", href: "/products/ea-titanx" },
  { name: "EA Development", href: "/development" },
  { name: "Affiliates", href: "/affiliate-program" },
  { name: "Pricing", href: "/pricing" },
  { name: "Support", href: "/support" },
]

export function Header() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">AlgoTrading</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === item.href
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">AlgoTrading</span>
                </div>
                <nav className="flex flex-col space-y-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium transition-colors hover:text-accent ${
                        location.pathname === item.href
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="flex flex-col space-y-2 pt-4">
                    {user ? (
                      <>
                        <Button variant="ghost" asChild>
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            Dashboard
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}>
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" asChild>
                          <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}