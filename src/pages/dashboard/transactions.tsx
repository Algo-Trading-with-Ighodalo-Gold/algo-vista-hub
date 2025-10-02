import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Wallet,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const mockTransactions = [
  {
    id: '1',
    date: '2024-09-12',
    amount: '$299.00',
    description: 'EA TitanX Pro License',
    status: 'Completed',
    type: 'purchase'
  },
  {
    id: '2', 
    date: '2024-09-10',
    amount: '$149.00',
    description: 'Monthly Subscription',
    status: 'Completed',
    type: 'subscription'
  },
  {
    id: '3',
    date: '2024-09-08',
    amount: '$50.00',
    description: 'Affiliate Commission',
    status: 'Pending',
    type: 'earning'
  },
  {
    id: '4',
    date: '2024-09-05',
    amount: '$199.00',
    description: 'EA Development Service',
    status: 'Completed',
    type: 'service'
  },
  {
    id: '5',
    date: '2024-09-01',
    amount: '$75.00',
    description: 'Premium Support Package',
    status: 'Completed',
    type: 'support'
  }
]

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'purchase':
    case 'subscription':
    case 'service':
    case 'support':
      return <ArrowUpRight className="h-4 w-4 text-red-500" />
    case 'earning':
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    default:
      return <CreditCard className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'default' as const
    case 'Pending':
      return 'secondary' as const
    case 'Failed':
      return 'destructive' as const
    default:
      return 'outline' as const
  }
}

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="dashboard-section-title flex items-center gap-3">
            <Wallet className="h-6 w-6 text-primary" />
            Transactions
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            View your payment history and transaction details
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="hover-scale">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Summary */}
      <div className="grid gap-6 lg:grid-cols-4 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">$772.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payments and purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{transaction.amount}</p>
                    <Badge variant={getStatusVariant(transaction.status)} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="hover-scale">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid gap-6 md:grid-cols-3 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">4</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">$50.00</div>
            <p className="text-sm text-muted-foreground mt-1">Pending payout</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">$193.00</div>
            <p className="text-sm text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}