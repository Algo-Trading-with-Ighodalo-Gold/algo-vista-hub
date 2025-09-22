import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { CandlestickBackground } from "@/components/ui/candlestick-background"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, ArrowLeft } from "lucide-react"

const pageTitle: { [key: string]: string } = {
  '/dashboard': 'Profile',
  '/dashboard/profile': 'Profile',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/ea-development': 'EA Development',
  '/dashboard/accounts': 'Connected Accounts',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/trading-rules': 'Trading Rules',
  '/dashboard/resources': 'Resources',
  '/dashboard/faq': 'FAQ',
  '/dashboard/affiliate': 'Affiliate Program'
}

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const currentTitle = pageTitle[location.pathname] || 'Dashboard'
  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex relative overflow-hidden">
      {/* Dashboard-specific animated background */}
      <AnimatedBackground variant="geometric" className="opacity-30" />
      <FloatingBackground elementCount={8} variant="particles" className="opacity-40" />
      <CandlestickBackground variant="dashboard" intensity="low" />
      
      <DashboardSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-auto relative z-10 flex flex-col">
        {/* Top Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Button>
              <h1 className="text-heading font-semibold text-foreground animate-fade-in">
                {currentTitle}
              </h1>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-scale">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user?.email} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}