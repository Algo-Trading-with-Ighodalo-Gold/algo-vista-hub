import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { 
  LayoutDashboard, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft,
  BarChart3,
  Trophy,
  FileCode,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Profile",
    href: "/dashboard/profile", 
    icon: User
  },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3
  },
  {
    title: "EA Development",
    href: "/dashboard/ea-development",
    icon: FileCode
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

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

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
              <h2 className="font-bold text-lg">Dashboard</h2>
              <p className="text-xs text-muted-foreground">Trading Hub</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item, index) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
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
        </nav>

        {/* User Info */}
        <div className="mt-auto space-y-4">
          {!collapsed && (
            <Card className="p-3 bg-background/50 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || 'Trader'}
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