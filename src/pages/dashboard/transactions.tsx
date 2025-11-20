import { useState, useEffect } from 'react'
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
  CreditCard,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { getTransactions, getTransactionSummary, formatCurrency, exportTransactions, Transaction, TransactionSummary } from '@/lib/api/transactions'
import { useToast } from '@/hooks/use-toast'

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'purchase':
    case 'subscription':
      return <ArrowUpRight className="h-4 w-4 text-red-500" />
    case 'earning':
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    case 'refund':
      return <ArrowDownLeft className="h-4 w-4 text-orange-500" />
    default:
      return <CreditCard className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default' as const
    case 'pending':
      return 'secondary' as const
    case 'failed':
      return 'destructive' as const
    case 'refunded':
      return 'warning' as const
    default:
      return 'outline' as const
  }
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const loadTransactions = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const [transactionsData, summaryData] = await Promise.all([
        getTransactions(user.id),
        getTransactionSummary(user.id)
      ])
      setTransactions(transactionsData)
      setSummary(summaryData)
    } catch (error) {
      console.error('Error loading transactions:', error)
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [user?.id])

  const handleExport = async () => {
    if (!user?.id) return
    
    try {
      const csvContent = await exportTransactions(user.id)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Transactions exported successfully!"
      })
    } catch (error) {
      console.error('Error exporting transactions:', error)
      toast({
        title: "Error",
        description: "Failed to export transactions. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const term = searchTerm.trim().toLowerCase()

    const matchesSearch = term
      ? [
          transaction.description,
          transaction.type,
          transaction.status,
          transaction.license_key,
        ]
          .filter(Boolean)
          .some(value => value!.toLowerCase().includes(term)) ||
        transaction.amount.toString().toLowerCase().includes(term) ||
        new Date(transaction.date)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          .toLowerCase()
          .includes(term)
      : true

    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus

    return matchesSearch && matchesStatus
  })
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
          <Button 
            variant="outline" 
            className="hover-scale"
            onClick={handleExport}
            disabled={loading || transactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="hover-scale"
            onClick={loadTransactions}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">
              {loading ? '...' : summary ? formatCurrency(summary.totalSpent) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? '...' : summary ? formatCurrency(summary.monthlySpent) : '$0.00'} this month
            </p>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading transactions...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {transactions.length === 0 
                  ? "You haven't made any transactions yet." 
                  : "No transactions match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
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
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {transaction.license_key && (
                      <p className="text-xs text-muted-foreground font-mono">
                        License: {transaction.license_key.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={getStatusVariant(transaction.status)} className="text-xs">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="hover-scale">
                    Details
                  </Button>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid gap-6 md:grid-cols-3 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">
              {loading ? '...' : summary?.transactionCount || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {loading ? '...' : summary ? formatCurrency(summary.totalEarnings) : '$0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? '...' : summary ? formatCurrency(summary.pendingEarnings) : '$0.00'} pending
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">
              {loading ? '...' : summary ? formatCurrency(summary.averageTransaction) : '$0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Per purchase</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}