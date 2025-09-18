import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"
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
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex relative overflow-hidden">
      {/* Dashboard-specific animated background */}
      <AnimatedBackground variant="geometric" className="opacity-30" />
      <FloatingBackground elementCount={8} variant="particles" className="opacity-40" />
      
      <DashboardSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-auto relative z-10">
        {/* Content Area */}
        <div className="p-6 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}