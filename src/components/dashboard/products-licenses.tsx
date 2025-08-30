import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Key, Activity } from 'lucide-react'
import { Tables } from '@/integrations/supabase/types'
import { format } from 'date-fns'

type License = Tables<'licenses'>

interface ProductsLicensesProps {
  licenses: License[]
  loading: boolean
}

export function ProductsLicenses({ licenses, loading }: ProductsLicensesProps) {
  if (loading) {
    return (
      <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Products & Licenses
          </CardTitle>
          <CardDescription>Your Expert Advisors and license keys</CardDescription>
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

  const activeLicenses = licenses.filter(license => license.status === 'active')

  return (
    <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Products & Licenses
        </CardTitle>
        <CardDescription>Your Expert Advisors and license keys</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {licenses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No licenses available</p>
            <Button variant="default">Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeLicenses.map((license) => {
              const mt5Accounts = Array.isArray(license.mt5_accounts) 
                ? license.mt5_accounts as string[]
                : []
              
              return (
                <div key={license.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {license.license_key.substring(0, 8)}...
                      </span>
                    </div>
                    <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                      {license.status}
                    </Badge>
                  </div>
                  
                  {license.created_at && (
                    <div className="text-sm text-muted-foreground">
                      Licensed: {format(new Date(license.created_at), 'MMM dd, yyyy')}
                    </div>
                  )}
                  
                  {mt5Accounts.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4" />
                        MT5 Accounts ({mt5Accounts.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mt5Accounts.map((account, index) => (
                          <Badge key={index} variant="outline" className="font-mono text-xs">
                            {account}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      Download EA
                    </Button>
                    <Button size="sm" variant="outline">
                      Copy License
                    </Button>
                  </div>
                </div>
              )
            })}
            
            {licenses.length > activeLicenses.length && (
              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  View inactive licenses ({licenses.length - activeLicenses.length})
                </summary>
                <div className="mt-2 space-y-2">
                  {licenses
                    .filter(license => license.status !== 'active')
                    .map((license) => (
                      <div key={license.id} className="border rounded-lg p-3 opacity-75">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">
                            {license.license_key.substring(0, 8)}...
                          </span>
                          <Badge variant="secondary">{license.status}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}