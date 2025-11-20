import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Settings,
  Activity
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ConnectAccountModalProps {
  isOpen: boolean
  onClose: () => void
  eaId: string
  eaName: string
  onAccountConnected: (account: ConnectedAccount) => void
}

interface ConnectedAccount {
  id: string
  name: string
  accountId: string
  platform: string
  status: 'online' | 'offline' | 'connecting'
  balance: string
  equity: string
  lastSync: string
  eaId: string
  eaName: string
  connectedAt: string
}

const platforms = [
  { value: 'mt5', label: 'MetaTrader 5', description: 'Professional trading platform' },
  { value: 'mt4', label: 'MetaTrader 4', description: 'Classic trading platform' },
  { value: 'ctrader', label: 'cTrader', description: 'Advanced trading platform' }
]

export function ConnectAccountModal({ 
  isOpen, 
  onClose, 
  eaId, 
  eaName, 
  onAccountConnected 
}: ConnectAccountModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    accountId: '',
    platform: '',
    server: '',
    password: ''
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle')
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConnect = async () => {
    if (!formData.name || !formData.accountId || !formData.platform || !formData.server) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    setConnectionStatus('connecting')

    // Simulate connection process
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate for demo
      
      if (success) {
        setConnectionStatus('success')
        
        // Create connected account object
        const newAccount: ConnectedAccount = {
          id: Date.now().toString(),
          name: formData.name,
          accountId: formData.accountId,
          platform: formData.platform,
          status: 'online',
          balance: '$10,000.00', // Mock balance
          equity: '$10,000.00',
          lastSync: 'Just now',
          eaId,
          eaName,
          connectedAt: new Date().toISOString()
        }

        onAccountConnected(newAccount)
        
        toast({
          title: "Account Connected!",
          description: `Successfully connected ${formData.name} to ${eaName}`,
        })

        // Reset form and close after delay
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setConnectionStatus('error')
        toast({
          title: "Connection Failed",
          description: "Unable to connect to the trading account. Please check your credentials.",
          variant: "destructive",
        })
      }
      
      setIsConnecting(false)
    }, 3000)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      accountId: '',
      platform: '',
      server: '',
      password: ''
    })
    setConnectionStatus('idle')
    setIsConnecting(false)
    onClose()
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to trading account...'
      case 'success':
        return 'Account connected successfully!'
      case 'error':
        return 'Connection failed. Please try again.'
      default:
        return 'Ready to connect'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Connect Trading Account
          </DialogTitle>
          <DialogDescription>
            Connect a trading account to {eaName} for automated trading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* EA Info Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{eaName}</h3>
                  <p className="text-sm text-muted-foreground">Expert Advisor</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {eaId}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Connection Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Trading Account"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountId">Account ID *</Label>
                <Input
                  id="accountId"
                  placeholder="e.g., 123456789"
                  value={formData.accountId}
                  onChange={(e) => handleInputChange('accountId', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Trading Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex flex-col">
                        <span>{platform.label}</span>
                        <span className="text-xs text-muted-foreground">{platform.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="server">Server *</Label>
                <Input
                  id="server"
                  placeholder="e.g., MetaQuotes-Demo"
                  value={formData.server}
                  onChange={(e) => handleInputChange('server', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Trading password (optional)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isConnecting}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || connectionStatus === 'success'}
              className="min-w-[120px]"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : connectionStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

