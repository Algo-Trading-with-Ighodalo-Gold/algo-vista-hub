import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface ConnectAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (account: number, accountName?: string, broker?: string) => Promise<void>
  isLoading?: boolean
  licenseName?: string
}

export function ConnectAccountDialog({
  open,
  onOpenChange,
  onConnect,
  isLoading = false,
  licenseName = 'EA License'
}: ConnectAccountDialogProps) {
  const [accountName, setAccountName] = useState('')
  const [mt5AccountId, setMt5AccountId] = useState('')
  const [broker, setBroker] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate MT5 Account ID is numeric
    const accountNum = parseInt(mt5AccountId, 10)
    if (isNaN(accountNum) || accountNum <= 0) {
      setError('MT5 Account ID must be a valid positive number')
      return
    }

    try {
      await onConnect(accountNum, accountName || undefined, broker || undefined)
      // Reset form on success
      setAccountName('')
      setMt5AccountId('')
      setBroker('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect account')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setAccountName('')
      setMt5AccountId('')
      setBroker('')
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Trading Account</DialogTitle>
          <DialogDescription>
            Connect a new MT5 trading account to {licenseName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name (Optional)</Label>
            <Input
              id="accountName"
              placeholder="e.g., Main Trading Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mt5AccountId">
              MT5 Account ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mt5AccountId"
              type="text"
              inputMode="numeric"
              placeholder="e.g., 123456789"
              value={mt5AccountId}
              onChange={(e) => {
                // Only allow numeric input
                const value = e.target.value.replace(/\D/g, '')
                setMt5AccountId(value)
                setError(null)
              }}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter your MT5 account number (numeric only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="broker">Broker (Optional)</Label>
            <Input
              id="broker"
              placeholder="e.g., IC Markets"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading || !mt5AccountId}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}








