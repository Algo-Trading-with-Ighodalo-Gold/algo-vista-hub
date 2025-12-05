import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { Users, ShoppingBag, CreditCard, TrendingUp, Activity, DollarSign, Package, Link as LinkIcon, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface AdminStats {
  total_users: number
  total_licenses: number
  active_licenses: number
  total_ea_products: number
  active_ea_products: number
  total_accounts: number
  active_accounts: number
  total_affiliates: number
  total_commission: number
  recent_users: Array<{
    id: string
    email: string
    created_at: string
    profile: {
      first_name: string | null
      last_name: string | null
    } | null
  }> | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_admin_stats')

      if (error) {
        console.error('Error fetching admin stats:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        toast({
          title: "Error",
          description: error.message || error.details || "Failed to load admin statistics. The function may not exist. Please run FIX_ALL_ADMIN_ISSUES.sql in Supabase.",
          variant: "destructive",
        })
          // Set default empty stats so UI doesn't break
          setStats({
            total_users: 0,
            total_licenses: 0,
            active_licenses: 0,
            total_ea_products: 0,
            active_ea_products: 0,
            total_accounts: 0,
            active_accounts: 0,
            total_affiliates: 0,
            total_commission: 0,
            recent_users: []
          })
        } else {
          // Check if data has error property (unauthorized)
          if (data && typeof data === 'object' && 'error' in data) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to view admin statistics",
              variant: "destructive",
            })
            setStats({
              total_users: 0,
              total_licenses: 0,
              active_licenses: 0,
              total_ea_products: 0,
              active_ea_products: 0,
              total_accounts: 0,
              active_accounts: 0,
              total_affiliates: 0,
              total_commission: 0,
              recent_users: []
            })
          } else {
            // Check if data is valid JSON object
            if (data && typeof data === 'object') {
              setStats(data as AdminStats)
            } else {
              console.error('Invalid data format:', data)
              toast({
                title: "Error",
                description: "Received invalid data format from server",
                variant: "destructive",
              })
              setStats({
                total_users: 0,
                total_licenses: 0,
                active_licenses: 0,
                total_ea_products: 0,
                active_ea_products: 0,
                total_accounts: 0,
                active_accounts: 0,
                total_affiliates: 0,
                total_commission: 0,
                recent_users: []
              })
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching admin stats:', error)
        console.error('Error stack:', error.stack)
        toast({
          title: "Error",
          description: error.message || error.toString() || "Failed to load admin statistics. Please check browser console.",
          variant: "destructive",
        })
        // Set default empty stats
        setStats({
          total_users: 0,
          total_licenses: 0,
          active_licenses: 0,
          total_ea_products: 0,
          active_ea_products: 0,
          total_accounts: 0,
          active_accounts: 0,
          total_affiliates: 0,
          total_commission: 0,
          recent_users: []
        })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      description: "Registered users",
      color: "text-blue-500"
    },
    {
      title: "Active Licenses",
      value: stats?.active_licenses || 0,
      icon: ShoppingBag,
      description: `of ${stats?.total_licenses || 0} total`,
      color: "text-green-500"
    },
    {
      title: "EA Products",
      value: stats?.active_ea_products || 0,
      icon: Package,
      description: `of ${stats?.total_ea_products || 0} total`,
      color: "text-purple-500"
    },
    {
      title: "Connected Accounts",
      value: stats?.active_accounts || 0,
      icon: Activity,
      description: `of ${stats?.total_accounts || 0} total`,
      color: "text-orange-500"
    },
    {
      title: "Affiliates",
      value: stats?.total_affiliates || 0,
      icon: LinkIcon,
      description: "Active affiliates",
      color: "text-pink-500"
    },
    {
      title: "Total Commission",
      value: `$${(stats?.total_commission || 0).toFixed(2)}`,
      icon: DollarSign,
      description: "Earned by affiliates",
      color: "text-yellow-500"
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your platform statistics and recent activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLoading(true)
            fetchStats()
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats?.recent_users && stats.recent_users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_users.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.profile?.first_name} {user.profile?.last_name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




