import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { Users, ShoppingBag, CreditCard, TrendingUp, Activity, DollarSign, Package, Link as LinkIcon, RefreshCw, MapPin, FileText, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

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

interface RevenueData {
  month: string
  revenue: number
}

interface UserGrowthData {
  month: string
  users: number
  cumulative: number
}

interface GeographicData {
  country: string
  users: number
}

interface ProjectInquiry {
  id: string
  name: string
  email: string
  strategy: string
  status: string
  created_at: string
  budget: string | null
  timeline: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([])
  const [geographicData, setGeographicData] = useState<GeographicData[]>([])
  const [projectInquiries, setProjectInquiries] = useState<ProjectInquiry[]>([])
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
              // Fetch chart data
              fetchChartData()
              // Fetch project inquiries
              fetchProjectInquiries()
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

  const fetchChartData = async () => {
    try {
      // Fetch revenue data (last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      const { data: licenses } = await supabase
        .from("licenses")
        .select("created_at, ea_product_id")
        .gte("created_at", sixMonthsAgo.toISOString())

      // Group by month
      const revenueByMonth: { [key: string]: number } = {}
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      
      licenses?.forEach(license => {
        const date = new Date(license.created_at)
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        if (!revenueByMonth[monthKey]) {
          revenueByMonth[monthKey] = 0
        }
        // Default price - would need to fetch actual product prices
        revenueByMonth[monthKey] += 299
      })

      const revenueChartData: RevenueData[] = Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => {
          const dateA = new Date(a.month)
          const dateB = new Date(b.month)
          return dateA.getTime() - dateB.getTime()
        })

      setRevenueData(revenueChartData)

      // Fetch user growth data
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString())
        .order("created_at", { ascending: true })

      const usersByMonth: { [key: string]: number } = {}
      profiles?.forEach(profile => {
        const date = new Date(profile.created_at)
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        if (!usersByMonth[monthKey]) {
          usersByMonth[monthKey] = 0
        }
        usersByMonth[monthKey]++
      })

      let cumulative = 0
      const userGrowthChartData: UserGrowthData[] = Object.entries(usersByMonth)
        .map(([month, users]) => {
          cumulative += users
          return { month, users, cumulative }
        })
        .sort((a, b) => {
          const dateA = new Date(a.month)
          const dateB = new Date(b.month)
          return dateA.getTime() - dateB.getTime()
        })

      setUserGrowthData(userGrowthChartData)

      // Geographic distribution (placeholder - would need actual location data)
      setGeographicData([
        { country: "United States", users: 45 },
        { country: "United Kingdom", users: 23 },
        { country: "Canada", users: 18 },
        { country: "Australia", users: 12 },
        { country: "Germany", users: 8 },
        { country: "Other", users: 15 }
      ])
    } catch (error) {
      console.error("Error fetching chart data:", error)
    }
  }

  const fetchProjectInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("project_inquiries")
        .select("id, name, email, strategy, status, created_at, budget, timeline")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setProjectInquiries(data || [])
    } catch (error) {
      console.error("Error fetching project inquiries:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [toast])

  // Listen for project inquiry approval events and real-time updates
  useEffect(() => {
    const handleApproval = () => {
      fetchProjectInquiries()
    }
    
    window.addEventListener('projectInquiryApproved', handleApproval)
    
    // Set up real-time subscription for project_inquiries table
    const channel = supabase
      .channel('project_inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'project_inquiries'
        },
        (payload) => {
          console.log('Project inquiry updated:', payload)
          fetchProjectInquiries()
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener('projectInquiryApproved', handleApproval)
      supabase.removeChannel(channel)
    }
  }, [])

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

      {/* Project Inquiries Quick Stats */}
      {projectInquiries.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectInquiries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All project inquiries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {projectInquiries.filter(i => i.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {projectInquiries.filter(i => i.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Approved projects</p>
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth Chart</CardTitle>
            <CardDescription>New users and cumulative growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="users" fill="hsl(var(--primary))" name="New Users" />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Cumulative"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
      {stats?.recent_users && stats.recent_users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
              {stats.recent_users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.profile?.first_name} {user.profile?.last_name}
                    </p>
                  </div>
                    <p className="text-sm text-muted-foreground ml-4 flex-shrink-0">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Project Inquiries
            </CardTitle>
            <CardDescription>Latest EA development project requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectInquiries.length > 0 ? (
                projectInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        {inquiry.status === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : inquiry.status === "pending" ? (
                          <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                        <p className="font-medium truncate">{inquiry.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {inquiry.strategy.substring(0, 30)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={inquiry.status === "approved" ? "default" : inquiry.status === "pending" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {inquiry.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No project inquiries yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>User distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographicData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(item.users / Math.max(...geographicData.map(d => d.users))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{item.users}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




