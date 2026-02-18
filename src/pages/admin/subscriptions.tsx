import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableScroll } from "@/components/admin/TableScroll"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Search, RefreshCw, Calendar, User } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
type SubscriptionTier = Database["public"]["Tables"]["subscription_tiers"]["Row"]

interface SubscriptionWithUser extends Subscription {
  user_email?: string
  user_name?: string
  tier_name?: string
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionWithUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscriptions.filter(
        (sub) =>
          sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSubscriptions(filtered)
    } else {
      setFilteredSubscriptions(subscriptions)
    }
  }, [searchTerm, subscriptions])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false })

      if (subsError) throw subsError

      // Fetch tiers
      const { data: tiersData } = await supabase
        .from("subscription_tiers")
        .select("*")

      if (tiersData) {
        setTiers(tiersData)
      }

      // Get user info for each subscription
      const subscriptionsWithUsers: SubscriptionWithUser[] = await Promise.all(
        (subsData || []).map(async (sub) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", sub.user_id)
            .single()

          const tier = tiersData?.find(t => t.tier_code === sub.plan)

          return {
            ...sub,
            user_email: `user-${sub.user_id?.substring(0, 8) || ''}`,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
            tier_name: tier?.name || sub.plan
          }
        })
      )

      setSubscriptions(subscriptionsWithUsers)
      setFilteredSubscriptions(subscriptionsWithUsers)
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (subscription: SubscriptionWithUser) => {
    setEditingSubscription(subscription)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingSubscription) return

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: editingSubscription.status,
          plan: editingSubscription.plan,
          start_date: editingSubscription.start_date,
          end_date: editingSubscription.end_date
        })
        .eq("id", editingSubscription.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscription updated successfully",
      })

      setIsEditDialogOpen(false)
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      })
    }
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length
  const totalSubscriptions = subscriptions.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all user subscriptions
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-sm text-muted-foreground">
              All subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-sm text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Active Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSubscriptions > 0 ? Math.round((activeSubscriptions / totalSubscriptions) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Subscription retention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search subscriptions by user or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="rounded-md border">
            <TableScroll>
              <Table noWrapper compact>
                <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.user_name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{subscription.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{subscription.tier_name || subscription.plan}</TableCell>
                    <TableCell>
                      <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                        {subscription.status || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subscription)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSubscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </TableScroll>
          </div>
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update subscription information
            </DialogDescription>
          </DialogHeader>
          {editingSubscription && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingSubscription.status || "active"}
                  onValueChange={(value) =>
                    setEditingSubscription({ ...editingSubscription, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select
                  value={editingSubscription.plan}
                  onValueChange={(value) =>
                    setEditingSubscription({ ...editingSubscription, plan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.tier_code}>
                        {tier.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={editingSubscription.start_date ? new Date(editingSubscription.start_date).toISOString().split('T')[0] : ""}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        start_date: e.target.value
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={editingSubscription.end_date ? new Date(editingSubscription.end_date).toISOString().split('T')[0] : ""}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        end_date: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


