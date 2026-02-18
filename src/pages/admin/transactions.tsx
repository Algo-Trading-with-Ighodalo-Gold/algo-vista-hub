import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableScroll } from "@/components/admin/TableScroll"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Search, Download, RefreshCw, ArrowLeftRight, DollarSign } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type License = Database["public"]["Tables"]["licenses"]["Row"]

interface Transaction {
  id: string
  user_id: string
  user_email?: string
  user_name?: string
  date: string
  amount: number
  description: string
  status: string
  type: string
  license_id?: string
  stripe_payment_intent_id?: string
}

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [refundingTransaction, setRefundingTransaction] = useState<Transaction | null>(null)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(
        (tx) =>
          tx.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTransactions(filtered)
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchTerm, transactions])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      // Get all licenses (which represent purchases/transactions)
      const { data: licenses, error } = await supabase
        .from("licenses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform licenses into transactions
      const transactionsList: Transaction[] = await Promise.all(
        (licenses || []).map(async (license) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", license.user_id)
            .single()

          // Get EA product price (try products table first, fallback to ea_products)
          let product = null
          const { data: productFromProducts } = await supabase
            .from("products")
            .select("price_cents")
            .or(`id.eq.${license.ea_product_id},product_code.eq.${license.ea_product_id}`)
            .single()
          
          if (productFromProducts) {
            product = productFromProducts
          } else {
            // Fallback to ea_products for backward compatibility
            const { data: productFromEaProducts } = await supabase
              .from("ea_products")
              .select("price_cents")
              .or(`id.eq.${license.ea_product_id},product_code.eq.${license.ea_product_id}`)
              .single()
            product = productFromEaProducts
          }

          return {
            id: license.id,
            user_id: license.user_id,
            user_email: `user-${license.user_id.substring(0, 8)}`,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
            date: license.created_at,
            amount: (product?.price_cents || 29900), // Default price if not found
            description: `${license.ea_product_name || 'EA'} License`,
            status: license.status === 'active' ? 'completed' : license.status,
            type: 'purchase',
            license_id: license.id,
            stripe_payment_intent_id: license.stripe_customer_id
          }
        })
      )

      setTransactions(transactionsList)
      setFilteredTransactions(transactionsList)
    } catch (error: any) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'User', 'Email', 'Description', 'Amount', 'Status', 'Type'].join(','),
      ...filteredTransactions.map(tx => [
        new Date(tx.date).toLocaleDateString(),
        tx.user_name || 'Unknown',
        tx.user_email || '',
        tx.description,
        `$${(tx.amount / 100).toFixed(2)}`,
        tx.status,
        tx.type
      ].join(','))
    ].join('\n')

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
      description: "Transactions exported successfully",
    })
  }

  const handleRefund = (transaction: Transaction) => {
    setRefundingTransaction(transaction)
    setIsRefundDialogOpen(true)
  }

  const handleProcessRefund = async () => {
    if (!refundingTransaction) return

    try {
      // Update license status to revoked
      if (refundingTransaction.license_id) {
        const { error } = await supabase
          .from("licenses")
          .update({
            status: 'revoked',
            updated_at: new Date().toISOString()
          })
          .eq("id", refundingTransaction.license_id)

        if (error) throw error
      }

      // Here you would typically:
      // 1. Process refund via Stripe API
      // 2. Create a refund record in database
      // 3. Send notification to user

      toast({
        title: "Success",
        description: "Refund processed successfully. Note: Stripe refund must be processed separately.",
      })

      setIsRefundDialogOpen(false)
      setRefundReason("")
      fetchTransactions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive",
      })
    }
  }

  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.status === 'completed' ? tx.amount : 0), 0)
  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter(tx => tx.status === 'completed').length

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
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all platform transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm" disabled={filteredTransactions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchTransactions} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              From {completedTransactions} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-sm text-muted-foreground">
              All transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTransactions > 0 ? Math.round((completedTransactions / totalTransactions) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Successful transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search transactions by user, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="rounded-md border">
            <TableScroll>
              <Table noWrapper compact>
                <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.user_name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{transaction.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="font-medium">${(transaction.amount / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefund(transaction)}
                        >
                          Issue Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </TableScroll>
          </div>
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Process a refund for this transaction
            </DialogDescription>
          </DialogHeader>
          {refundingTransaction && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Transaction</Label>
                <p className="text-sm">{refundingTransaction.description}</p>
                <p className="text-sm font-medium">${(refundingTransaction.amount / 100).toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Label>Refund Reason</Label>
                <Textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  rows={4}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Note: This will revoke the associated license. You must process the Stripe refund separately.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessRefund} variant="destructive">
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


