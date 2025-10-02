import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { 
  User, 
  Mail, 
  Settings, 
  Copy, 
  Edit3,
  Shield,
  Star,
  UserCheck,
  Upload,
  Camera
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { 
    profile, 
    loading 
  } = useDashboardData()

  const displayName = 
    profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Trader'

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file)
      setAvatarUrl(imageUrl)
      
      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

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
          <h1 className="dashboard-section-title flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </h1>
          <p className="dashboard-subtitle mt-1">
            Manage your account information and settings
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="hover-scale"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="h-3 w-3 mr-1" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {/* Profile Information */}
      <div className="grid gap-4 lg:grid-cols-3 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="dashboard-heading flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Account Information
            </CardTitle>
            <CardDescription className="dashboard-text">Your personal details and account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Section */}
            <div className="flex items-start gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-2 border-muted">
                  <AvatarImage src={avatarUrl || profile?.avatar_url} alt={displayName} />
                  <AvatarFallback className="text-lg font-semibold bg-muted">
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                     onClick={triggerFileInput}>
                  <div className="flex flex-col items-center gap-1">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 text-white" />
                        <span className="text-xs text-white">Edit</span>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="dashboard-heading font-semibold text-lg">{displayName}</h3>
                <p className="dashboard-text text-muted-foreground">{user?.email}</p>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                    className="btn-hover"
                    disabled={isUploading}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Profile Picture
                  </Button>
                </div>
                <div className="mt-2">
                  <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {profile?.subscription_status || 'Free'} Plan
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="grid gap-3 pt-4 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="dashboard-text">First Name</Label>
                    <Input 
                      id="firstName"
                      placeholder="Enter first name"
                      defaultValue={profile?.first_name || ''}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="dashboard-text">Last Name</Label>
                    <Input 
                      id="lastName"
                      placeholder="Enter last name"
                      defaultValue={profile?.last_name || ''}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="dashboard-text">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="h-8 text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="hover-scale h-7 text-xs">Save Changes</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="h-7 text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Settings className="h-3 w-3 text-muted-foreground" />
                    <span className="dashboard-text font-medium">Member since</span>
                  </div>
                  <p className="dashboard-text text-muted-foreground">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString()
                      : user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Recently'
                    }
                  </p>
                </div>

                {profile?.affiliate_code && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-muted-foreground" />
                      <span className="dashboard-text font-medium">Affiliate Code</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dashboard-text text-muted-foreground font-mono">
                        {profile.affiliate_code}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.affiliate_code || '', 'Affiliate code')}
                        className="h-6 w-6 p-0"
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
          <CardHeader className="pb-2">
            <CardTitle className="dashboard-heading flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Account Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center space-y-1">
              <div className="dashboard-title font-bold text-primary">
                {profile?.subscription_status === 'active' ? 'Premium' : 'Free'}
              </div>
              <p className="dashboard-text text-muted-foreground">
                Current Plan
              </p>
            </div>
            
            <div className="space-y-2 pt-3 border-t">
              <div className="flex justify-between">
                <span className="dashboard-text text-muted-foreground">Profile Status</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="dashboard-text text-muted-foreground">Verification</span>
                <Badge variant="outline" className="text-xs">Verified</Badge>
              </div>
              <div className="flex justify-between">
                <span className="dashboard-text text-muted-foreground">EAs Active</span>
                <Badge variant="default" className="text-xs">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}