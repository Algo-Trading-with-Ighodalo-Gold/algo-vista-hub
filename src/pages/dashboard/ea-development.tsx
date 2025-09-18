import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { EADevelopmentForm } from '@/components/dashboard/ea-development-form'
import { 
  FileCode,
  Plus,
  Settings,
  Download,
  Play,
  Pause,
  BarChart3,
  Calendar,
  ExternalLink
} from 'lucide-react'

const mockEAs = [
  {
    id: '1',
    name: 'Scalper Pro EA',
    version: '2.1.0',
    status: 'Active',
    performance: '+24.5%',
    trades: 1247,
    lastUpdate: '2024-09-10'
  },
  {
    id: '2',
    name: 'Trend Rider EA',
    version: '1.8.3', 
    status: 'Paused',
    performance: '+18.2%',
    trades: 856,
    lastUpdate: '2024-09-08'
  }
]

const mockRequests = [
  {
    id: '1',
    name: 'Custom Grid Strategy',
    status: 'In Development',
    submitted: '2024-09-01',
    progress: 75
  },
  {
    id: '2',
    name: 'News Trading Bot',
    status: 'Under Review',
    submitted: '2024-08-28',
    progress: 25
  }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default' as const
    case 'Paused':
      return 'secondary' as const
    case 'In Development':
      return 'outline' as const
    case 'Under Review':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

export default function DashboardEADevelopmentPage() {
  const [showCalendly, setShowCalendly] = useState(false)
  const { loading } = useDashboardData()

  const handleRequestSubmitted = () => {
    setShowCalendly(true)
  }

  if (showCalendly) {
    return (
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Book Your Consultation
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Schedule a consultation to discuss your EA development requirements
          </p>
        </div>

        <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Request Submitted Successfully!</CardTitle>
            <CardDescription>
              Your EA development request has been received. Please book a consultation below to discuss your requirements in detail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calendly Embed Placeholder */}
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center space-y-4">
              <Calendar className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Calendly Integration</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click the button below to open our calendar booking system and schedule your consultation at a time that works best for you.
              </p>
              <Button size="lg" className="hover-scale">
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowCalendly(false)}
                className="hover-scale"
              >
                Back to Dashboard
              </Button>
              <Button variant="outline" className="hover-scale">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Request Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <FileCode className="h-8 w-8 text-primary" />
            EA Development
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your Expert Advisors and request custom development
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCalendly(false)}
          className="hover-scale"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New EA
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active EAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2,103</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+21.4%</div>
            <p className="text-xs text-muted-foreground">Average return</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dev Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <Tabs defaultValue="my-eas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-eas">My EAs</TabsTrigger>
            <TabsTrigger value="request-new">Request New EA</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="my-eas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Expert Advisors</CardTitle>
                <CardDescription>
                  Manage and monitor your active trading algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEAs.map((ea, index) => (
                    <div key={ea.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                         style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileCode className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{ea.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Version {ea.version} • {ea.trades} trades • Updated {ea.lastUpdate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{ea.performance}</p>
                          <Badge variant={getStatusVariant(ea.status)}>
                            {ea.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="request-new" className="space-y-6">
            <EADevelopmentForm onSuccess={handleRequestSubmitted} />
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Requests</CardTitle>
                <CardDescription>
                  Track the progress of your custom EA development requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRequests.map((request, index) => (
                    <div key={request.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                         style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted {request.submitted}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${request.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{request.progress}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover-scale">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}