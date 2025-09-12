import { useState } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <DashboardSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}