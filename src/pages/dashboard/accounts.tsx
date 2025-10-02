import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Activity, 
  Plus,
  Search,
  Play,
  Pause,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Clock,
  Users
} from 'lucide-react'

const mockEAData = [
  {
    id: '1',
    name: 'Scalper Pro EA',
    status: 'active',
    expiryDate: '2024-12-15',
    connectedAccounts: 2,
    isMonitoring: true,
    lastActivity: '2 minutes ago',
    performance: '+12.5%'
  },
  {
    id: '2', 
    name: 'Grid Trader EA',
    status: 'active',
    expiryDate: '2024-11-30',
    connectedAccounts: 1,
    isMonitoring: true,
    lastActivity: '5 minutes ago',
    performance: '+8.2%'
  },
  {
    id: '3',
    name: 'Night Owl EA',
    status: 'inactive',
    expiryDate: '2024-12-20',
    connectedAccounts: 0,
    isMonitoring: false,
    lastActivity: '2 hours ago',
    performance: '+5.1%'
  },
  {
    id: '4',
    name: 'Trend Rider EA',
    status: 'expired',
    expiryDate: '2024-09-15',
    connectedAccounts: 0,
    isMonitoring: false,
    lastActivity: '2 weeks ago',
    performance: '-2.3%'
  }
]

const mockAccounts = [
  {
    id: '1',
    name: 'Main Trading Account',
    accountId: 'MT5-123456789',
    platform: 'MT5',
    status: 'online',
    balance: '$15,247.82',
    equity: '$15,892.45',
    lastSync: '2 minutes ago'
  },
  {
    id: '2', 
    name: 'Demo Account',
    accountId: 'MT5-987654321',
    platform: 'MT5',
    status: 'online',
    balance: '$10,000.00',
    equity: '$9,847.35',
    lastSync: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Scalping Account',
    accountId: 'MT5-456789123',
    platform: 'MT5', 
    status: 'offline',
    balance: '$5,123.67',
    equity: '$5,123.67',
    lastSync: '2 hours ago'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
    case 'online':
      return <CheckCircle className="h-3 w-3 text-green-500" />
    case 'inactive':
    case 'offline':
      return <XCircle className="h-3 w-3 text-red-500" />
    case 'expired':
      return <Clock className="h-3 w-3 text-yellow-500" />
    default:
      return <AlertCircle className="h-3 w-3 text-yellow-500" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
    case 'online':
      return 'default' as const
    case 'inactive':
    case 'offline':
      return 'secondary' as const
    case 'expired':
      return 'destructive' as const
    default:
      return 'outline' as const
  }
}

const getExpiryColor = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  
  if (daysUntilExpiry < 0) return 'text-red-500'
  if (daysUntilExpiry < 7) return 'text-yellow-500'
  if (daysUntilExpiry < 30) return 'text-orange-500'
  return 'text-green-500'
}

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  const filteredEAs = mockEAData.filter(ea => {
    const matchesSearch = ea.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || ea.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="dashboard-section-title text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            EA Management & Accounts
          </h1>
          <p className="text-muted-foreground dashboard-text mt-1">
            Monitor your Expert Advisors and connected trading accounts
          </p>
        </div>
        
        <Button size="sm" className="hover-scale">
          <Plus className="h-3 w-3 mr-1" />
          Connect Account
        </Button>
      </div>

      {/* EA Management Section */}
      <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader className="pb-3">
          <CardTitle className="dashboard-heading flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Expert Advisors
          </CardTitle>
          <CardDescription className="dashboard-text">
            Manage your EA licenses and monitoring status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search EAs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 h-8">
                  <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs px-2">Active</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs px-2">Inactive</TabsTrigger>
                  <TabsTrigger value="expired" className="text-xs px-2">Expired</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* EA Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="dashboard-text">EA Name</TableHead>
                    <TableHead className="dashboard-text">Status</TableHead>
                    <TableHead className="dashboard-text">Expiry Date</TableHead>
                    <TableHead className="dashboard-text">Accounts</TableHead>
                    <TableHead className="dashboard-text">Monitoring</TableHead>
                    <TableHead className="dashboard-text">Performance</TableHead>
                    <TableHead className="dashboard-text">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEAs.map((ea) => (
                    <TableRow key={ea.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium dashboard-text">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ea.status)}
                          {ea.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(ea.status)} className="text-xs">
                          {ea.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`dashboard-text ${getExpiryColor(ea.expiryDate)}`}>
                        {new Date(ea.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="dashboard-text">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {ea.connectedAccounts}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${ea.isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="dashboard-text text-muted-foreground">
                            {ea.isMonitoring ? 'Active' : 'Stopped'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`dashboard-text font-medium ${
                        ea.performance.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {ea.performance}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover-scale"
                            onClick={() => {}}
                          >
                            {ea.isMonitoring ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover-scale"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <div className="grid gap-4 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="dashboard-heading text-foreground">Connected Trading Accounts</h2>
        {mockAccounts.map((account, index) => (
          <Card key={account.id} className={`hover:shadow-lg transition-shadow animate-fade-in opacity-0 [animation-fill-mode:forwards]`} 
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dashboard-heading flex items-center gap-2">
                    {getStatusIcon(account.status)}
                    {account.name}
                  </CardTitle>
                  <CardDescription className="dashboard-text flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {account.platform}
                    </Badge>
                    {account.accountId}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(account.status)} className="text-xs">
                    {account.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="dashboard-text font-medium text-muted-foreground">Balance</p>
                  <p className="dashboard-title font-semibold">{account.balance}</p>
                </div>
                <div className="space-y-1">
                  <p className="dashboard-text font-medium text-muted-foreground">Equity</p>
                  <p className="dashboard-title font-semibold">{account.equity}</p>
                </div>
                <div className="space-y-1">
                  <p className="dashboard-text font-medium text-muted-foreground">Last Sync</p>
                  <p className="dashboard-text text-muted-foreground">{account.lastSync}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="hover-scale h-7 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm" className="hover-scale h-7 text-xs">
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="dashboard-text">Active EAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-title font-bold text-primary">2</div>
            <p className="dashboard-text text-muted-foreground mt-1">Running now</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="dashboard-text">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-title font-bold text-primary">3</div>
            <p className="dashboard-text text-muted-foreground mt-1">2 Online</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="dashboard-text">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-title font-bold text-primary">$30,371.49</div>
            <p className="dashboard-text text-muted-foreground mt-1">All accounts</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="dashboard-text">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-title font-bold text-green-500">+8.6%</div>
            <p className="dashboard-text text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}