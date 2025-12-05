import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Mail, Calendar } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface UserWithProfile {
  id: string
  email: string
  created_at: string
  profile: Profile | null
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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
      // Get all profiles (admin can see all)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profileError) throw profileError

      // For each profile, try to get user email from auth metadata
      // Note: We can't directly access auth.users from client, so we'll use what we have
      const usersWithProfiles: UserWithProfile[] = (profiles || []).map((profile) => ({
        id: profile.user_id,
        email: "", // Email will be empty - we'd need an RPC function to get it
        created_at: profile.created_at,
        profile: profile as Profile,
      }))

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
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.profile?.first_name} {user.profile?.last_name}
                      {!user.profile?.first_name && !user.profile?.last_name && (
                        <span className="text-muted-foreground"> (No name)</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {user.email && (
                        <>
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={user.profile?.role === "admin" || user.profile?.role === "worker" ? "default" : "secondary"}>
                      {user.profile?.role || "user"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

