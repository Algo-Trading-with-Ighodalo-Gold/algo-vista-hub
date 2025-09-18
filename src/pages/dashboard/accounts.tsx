import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Plus,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const mockAccounts = [
  {
    id: '1',
    name: 'Main Trading Account',
    accountId: 'MT5-123456789',
    platform: 'MT5',
    status: 'Active',
    balance: '$15,247.82',
    equity: '$15,892.45',
    lastSync: '2 minutes ago'
  },
  {
    id: '2', 
    name: 'Demo Account',
    accountId: 'MT4-987654321',
    platform: 'MT4',
    status: 'Active',
    balance: '$10,000.00',
    equity: '$9,847.35',
    lastSync: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Scalping Account',
    accountId: 'MT5-456789123',
    platform: 'MT5', 
    status: 'Inactive',
    balance: '$5,123.67',
    equity: '$5,123.67',
    lastSync: '2 hours ago'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'Inactive':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default' as const
    case 'Inactive':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Connected Accounts
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your trading accounts and monitor their status
          </p>
        </div>
        
        <Button className="hover-scale">
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-6 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        {mockAccounts.map((account, index) => (
          <Card key={account.id} className={`hover:shadow-lg transition-shadow animate-fade-in opacity-0 [animation-fill-mode:forwards]`} 
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(account.status)}
                    {account.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {account.platform}
                    </Badge>
                    {account.accountId}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(account.status)}>
                    {account.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="hover-scale">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className="text-lg font-semibold">{account.balance}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Equity</p>
                  <p className="text-lg font-semibold">{account.equity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                  <p className="text-sm text-muted-foreground">{account.lastSync}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="hover-scale">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="hover-scale">
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Statistics */}
      <div className="grid gap-6 md:grid-cols-3 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground mt-1">2 Active, 1 Inactive</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">$30,371.49</div>
            <p className="text-sm text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">$30,863.25</div>
            <p className="text-sm text-muted-foreground mt-1">Current market value</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}