import { useState } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FloatingBackground } from "@/components/ui/floating-background"
import { AnimatedBackground } from "@/components/ui/animated-background"

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        <div className="p-6 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}