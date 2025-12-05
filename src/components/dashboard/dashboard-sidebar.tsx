import { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useAdmin } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft,
  BarChart3,
  Trophy,
  FileCode,
  Users,
  Wallet,
  ScrollText,
  BookOpen,
  HelpCircle,
  Activity,
  Shield,
  Package,
  Link as LinkIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Profile",
    href: "/dashboard/profile", 
    icon: User
  },
  {
    title: "EA Development",
    href: "/dashboard/ea-development",
    icon: FileCode
  },
  {
    title: "Accounts",
    href: "/dashboard/accounts",
    icon: Activity
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Wallet
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: BookOpen
  },
  {
    title: "FAQ",
    href: "/dashboard/faq",
    icon: HelpCircle
  },
  {
    title: "Affiliate",
    href: "/dashboard/affiliate",
    icon: Users
  }
]

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const adminNavigationItems = [
  {
    title: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: Shield
  },
  {
    title: "EA Management",
    href: "/admin/ea-management",
    icon: Package
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Accounts",
    href: "/admin/accounts",
    icon: Activity
  },
  {
    title: "Affiliates",
    href: "/admin/affiliates",
    icon: LinkIcon
  }
]

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const { user, signOut } = useAuth()
  const { profile } = useDashboardData()
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Get display name from profile or user metadata
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Trader'

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={cn(
      "relative h-full bg-gradient-to-b from-primary/5 to-primary/10 border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-6 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent",
          collapsed && "rotate-180"
        )}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      <div className="flex flex-col h-full p-4">
        {/* Logo/Brand */}
        <div className={cn(
          "flex items-center gap-3 mb-8 animate-fade-in",
          collapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary-foreground" />
          </div>
           {!collapsed && (
             <div>
               <h2 className="font-bold text-lg">Algo Trading</h2>
               <p className="text-xs text-muted-foreground">with Ighodalo</p>
             </div>
           )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {/* Show regular navigation ONLY if NOT on admin route */}
          {!isAdminRoute ? (
            <>
              {navigationItems.map((item, index) => (
             <NavLink
               key={item.href}
               to={item.href}
               onClick={() => window.scrollTo(0, 0)}
               className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <item.icon className={cn(
                "h-4 w-4 flex-shrink-0",
                collapsed ? "h-5 w-5" : ""
              )} />
              {!collapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </NavLink>
              ))}
              
              {/* Admin Section - Show admin nav below regular nav when on regular routes */}
              {isAdmin && (
                <>
                  <Separator className="my-4" />
                  {!collapsed && (
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin
                    </div>
                  )}
                  {adminNavigationItems.map((item, index) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => window.scrollTo(0, 0)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-accent hover:text-accent-foreground",
                        collapsed && "justify-center"
                      )}
                      style={{ animationDelay: `${0.1 + (navigationItems.length + index) * 0.05}s` }}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        collapsed ? "h-5 w-5" : ""
                      )} />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  ))}
                </>
              )}
            </>
          ) : (
            /* Show ONLY admin navigation when on admin routes - NO regular nav items */
            isAdmin ? (
              <>
                {!collapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admin
                  </div>
                )}
                {adminNavigationItems.map((item, index) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => window.scrollTo(0, 0)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover-scale animate-fade-in opacity-0 [animation-fill-mode:forwards]",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 flex-shrink-0",
                      collapsed ? "h-5 w-5" : ""
                    )} />
                    {!collapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </NavLink>
                ))}
              </>
            ) : null
          )}
        </nav>

        {/* User Info */}
        <div className="mt-auto space-y-4">
          {!collapsed && (
            <Card className="p-3 bg-background/50 animate-fade-in">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {profile?.first_name ? profile.first_name.slice(0, 1).toUpperCase() : 'T'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {displayName}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Free Plan
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Settings & Logout */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={cn(
                "flex-1 justify-start gap-2 hover-scale",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && "Sign Out"}
            </Button>
            {!collapsed && (
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}