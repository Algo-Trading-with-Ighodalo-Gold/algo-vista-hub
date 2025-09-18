import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { 
  User, 
  Mail, 
  Settings, 
  Copy, 
  Edit3,
  Shield,
  Star,
  UserCheck
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const { 
    profile, 
    loading 
  } = useDashboardData()

  const displayName = 
    profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Trader'

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your account information and settings
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="hover-scale"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Information */}
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal details and account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      placeholder="Enter first name"
                      defaultValue={profile?.first_name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      placeholder="Enter last name"
                      defaultValue={profile?.last_name || ''}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="hover-scale">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Display Name</span>
                  </div>
                  <p className="text-lg font-semibold">{displayName}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user?.email || '', 'Email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Subscription Status</span>
                  </div>
                  <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {profile?.subscription_status || 'Free'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Member since</span>
                  </div>
                  <p className="text-muted-foreground">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString()
                      : user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Recently'
                    }
                  </p>
                </div>

                {profile?.affiliate_code && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Affiliate Code</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground font-mono">
                        {profile.affiliate_code}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.affiliate_code || '', 'Affiliate code')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Account Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {profile?.subscription_status === 'active' ? 'Premium' : 'Free'}
              </div>
              <p className="text-sm text-muted-foreground">
                Current Plan
              </p>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profile Status</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Verification</span>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}