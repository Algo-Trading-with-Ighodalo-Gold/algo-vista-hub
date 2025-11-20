import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  X, 
  Plus, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Clock,
  Settings,
  Trash2,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EADetailsModalProps {
  isOpen: boolean
  onClose: () => void
  ea: any
  connectedAccounts: ConnectedAccount[]
  onConnectAccount: (eaId: string) => void
  onDisconnectAccount: (accountId: string) => void
  onToggleMonitoring: (accountId: string) => void
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
  isMonitoring?: boolean
}

export function EADetailsModal({ 
  isOpen, 
  onClose, 
  ea, 
  connectedAccounts,
  onConnectAccount,
  onDisconnectAccount,
  onToggleMonitoring
}: EADetailsModalProps) {
  const { toast } = useToast()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return 'default'
      case 'inactive':
      case 'offline':
        return 'destructive'
      case 'expired':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const handleDisconnect = (accountId: string, accountName: string) => {
    onDisconnectAccount(accountId)
    toast({
      title: "Account Disconnected",
      description: `${accountName} has been disconnected from ${ea.name}`,
    })
  }

  const handleToggleMonitoring = (accountId: string, accountName: string, isMonitoring: boolean) => {
    onToggleMonitoring(accountId)
    toast({
      title: isMonitoring ? "Monitoring Stopped" : "Monitoring Started",
      description: `${accountName} monitoring has been ${isMonitoring ? 'stopped' : 'started'}`,
    })
  }

  const eaAccounts = connectedAccounts.filter(account => account.eaId === ea.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{ea?.name || 'Unknown EA'}</h2>
              <p className="text-sm text-muted-foreground font-normal">Expert Advisor Details</p>
            </div>
            <Badge variant={getStatusVariant(ea?.status || 'unknown')} className="ml-auto">
              {ea?.status || 'unknown'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Manage connected trading accounts and monitor EA performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* EA Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <p className="text-2xl font-bold text-green-500 mt-1">{ea.performance}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <p className="text-2xl font-bold mt-1">{eaAccounts.length}</p>
                <p className="text-xs text-muted-foreground">Accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Last Activity</span>
                </div>
                <p className="text-sm font-bold mt-1">{ea.lastActivity}</p>
                <p className="text-xs text-muted-foreground">Active trading</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Max Accounts</span>
                </div>
                <p className="text-2xl font-bold mt-1">{ea.maxAccounts}</p>
                <p className="text-xs text-muted-foreground">Allowed</p>
              </CardContent>
            </Card>
          </div>

          {/* Connected Accounts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Connected Trading Accounts</h3>
              <Button 
                onClick={() => onConnectAccount(ea.id)}
                size="sm"
                disabled={eaAccounts.length >= ea.maxAccounts}
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
                {eaAccounts.length >= ea.maxAccounts && (
                  <span className="ml-2 text-xs">(Max reached)</span>
                )}
              </Button>
            </div>

            {eaAccounts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Accounts Connected</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect a trading account to start automated trading with {ea.name}
                  </p>
                  <Button onClick={() => onConnectAccount(ea.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Equity</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Monitoring</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eaAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.accountId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{account.platform.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(account.status)}
                            <span className="capitalize">{account.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{account.balance}</TableCell>
                        <TableCell className="font-mono">{account.equity}</TableCell>
                        <TableCell className="text-sm">{account.lastSync}</TableCell>
                        <TableCell>
                          <Button
                            variant={account.isMonitoring ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleToggleMonitoring(account.id, account.name, account.isMonitoring || false)}
                            className="h-8"
                          >
                            {account.isMonitoring ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* Refresh account data */}}
                              className="h-8 w-8 p-0"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* Open account settings */}}
                              className="h-8 w-8 p-0"
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDisconnect(account.id, account.name)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>

          {/* EA Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">EA Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p className="text-sm">{new Date(ea.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subscription Tier</label>
                  <Badge variant="outline" className="capitalize">{ea.subscriptionTier}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Max Concurrent Sessions</label>
                  <p className="text-sm">{ea.maxAccounts}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Usage</label>
                  <p className="text-sm">{eaAccounts.length} / {ea.maxAccounts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

