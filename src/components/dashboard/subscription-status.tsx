import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CreditCard, Package } from 'lucide-react'
import { Tables } from '@/integrations/supabase/types'
import { format } from 'date-fns'

type Subscription = Tables<'subscriptions'>

interface SubscriptionStatusProps {
  subscriptions: Subscription[]
  loading: boolean
}

export function SubscriptionStatus({ subscriptions, loading }: SubscriptionStatusProps) {
  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscriptions
          </CardTitle>
          <CardDescription>Your active subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Subscriptions
        </CardTitle>
        <CardDescription>Your active subscription plans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSubscriptions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No active subscriptions</p>
            <Button variant="default">Explore Plans</Button>
          </div>
        ) : (
          activeSubscriptions.map((subscription) => (
            <div key={subscription.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{subscription.plan}</h4>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              {subscription.start_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Started: {format(new Date(subscription.start_date), 'MMM dd, yyyy')}
                </div>
              )}
              
              {subscription.end_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Expires: {format(new Date(subscription.end_date), 'MMM dd, yyyy')}
                </div>
              )}
              
              {subscription.payment_method && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Payment: {subscription.payment_method}
                </div>
              )}
            </div>
          ))
        )}
        
        {subscriptions.length > activeSubscriptions.length && (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View inactive subscriptions ({subscriptions.length - activeSubscriptions.length})
            </summary>
            <div className="mt-2 space-y-2">
              {subscriptions
                .filter(sub => sub.status !== 'active')
                .map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-3 opacity-75">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subscription.plan}</span>
                      <Badge variant="secondary">{subscription.status}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}