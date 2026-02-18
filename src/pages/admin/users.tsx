import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableScroll } from "@/components/admin/TableScroll"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Mail, Calendar, Edit, Eye, Wallet, Key, RefreshCw } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type License = Database["public"]["Tables"]["licenses"]["Row"]
type Transaction = {
  id: string
  date: string
  amount: number
  description: string
  status: string
  type: string
}

interface UserWithProfile {
  id: string
  email: string
  created_at: string
  profile: Profile | null
  licenses?: License[]
  transactions?: Transaction[]
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<UserWithProfile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState<UserWithProfile | null>(null)
  const [viewType, setViewType] = useState<"transactions" | "licenses">("transactions")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Get all profiles (admin can see all)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profileError) throw profileError

      // Try to get user emails via RPC or use profile email if available
      const usersWithProfiles: UserWithProfile[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Try to get email from RPC function
          let email = ""
          try {
            const { data: emailData } = await supabase.rpc('get_user_email', { user_uuid: profile.user_id })
            email = emailData || ""
          } catch {
            // Fallback: try to get from auth metadata or use profile email if exists
            email = (profile as any).email || ""
          }

          // Fetch licenses for this user
          const { data: licenses } = await supabase
            .from("licenses")
            .select("*")
            .eq("user_id", profile.user_id)

          // Fetch transactions (licenses as transactions)
          const transactions: Transaction[] = (licenses || []).map((license) => ({
            id: license.id,
            date: license.created_at,
            amount: 0, // Would need to get from actual transaction table
            description: `${license.ea_product_name || 'License'} License`,
            status: license.status === 'active' ? 'completed' : 'pending',
            type: 'purchase'
          }))

          return {
        id: profile.user_id,
            email: email || `user-${profile.user_id.substring(0, 8)}`,
        created_at: profile.created_at,
        profile: profile as Profile,
            licenses: licenses || [],
            transactions
          }
        })
      )

      setUsers(usersWithProfiles)
      setFilteredUsers(usersWithProfiles)
    } catch (error: any) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserWithProfile) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editingUser.profile?.first_name,
          last_name: editingUser.profile?.last_name,
          role: editingUser.profile?.role,
        })
        .eq("user_id", editingUser.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      setIsEditDialogOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleViewTransactions = (user: UserWithProfile) => {
    setViewingUser(user)
    setViewType("transactions")
    setIsViewDialogOpen(true)
  }

  const handleViewLicenses = (user: UserWithProfile) => {
    setViewingUser(user)
    setViewType("licenses")
    setIsViewDialogOpen(true)
  }

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
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all platform users
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search users by email or name..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.profile?.first_name} {user.profile?.last_name}
                      {!user.profile?.first_name && !user.profile?.last_name && (
                        <span className="text-muted-foreground"> (No name)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{user.email}</span>
                    </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant={user.profile?.role === "admin" || user.profile?.role === "worker" ? "default" : "secondary"}>
                      {user.profile?.role || "user"}
                    </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.licenses?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTransactions(user)}
                        >
                          <Wallet className="h-4 w-4 mr-1" />
                          Transactions
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLicenses(user)}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Licenses
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                  </div>
                    </TableCell>
                  </TableRow>
            ))}
            {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No users found
                    </TableCell>
                  </TableRow>
            )}
              </TableBody>
              </Table>
            </TableScroll>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={editingUser.profile?.first_name || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      profile: {
                        ...editingUser.profile!,
                        first_name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={editingUser.profile?.last_name || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      profile: {
                        ...editingUser.profile!,
                        last_name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editingUser.profile?.role || "user"}
                  onValueChange={(value) =>
                    setEditingUser({
                      ...editingUser,
                      profile: {
                        ...editingUser.profile!,
                        role: value as any,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* View Transactions/Licenses Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewType === "transactions" ? "User Transactions" : "User Licenses"}
            </DialogTitle>
            <DialogDescription>
              {viewingUser?.email} - {viewingUser?.profile?.first_name} {viewingUser?.profile?.last_name}
            </DialogDescription>
          </DialogHeader>
          {viewType === "transactions" ? (
            <div className="space-y-4">
              {viewingUser?.transactions && viewingUser.transactions.length > 0 ? (
                <Table compact>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingUser.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>${(transaction.amount / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions found</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {viewingUser?.licenses && viewingUser.licenses.length > 0 ? (
                <Table compact>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Key</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingUser.licenses.map((license) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono text-xs">{license.license_key}</TableCell>
                        <TableCell>{license.ea_product_name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={license.status === "active" ? "default" : "secondary"}>
                            {license.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : "Never"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No licenses found</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
