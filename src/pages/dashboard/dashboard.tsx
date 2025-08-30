import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to your Dashboard</h1>
            <p className="text-muted-foreground">Manage your Expert Advisors and subscriptions</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Email: {user?.email}</p>
              <p className="text-sm text-muted-foreground">
                Welcome {user?.user_metadata?.first_name || 'Trader'}!
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Manage your active plans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No active subscriptions</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
            <CardHeader>
              <CardTitle>Downloads</CardTitle>
              <CardDescription>Access your Expert Advisors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No downloads available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}