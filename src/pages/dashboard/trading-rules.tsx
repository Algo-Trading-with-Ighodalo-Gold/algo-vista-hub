import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ScrollText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Users
} from 'lucide-react'

const tradingRules = [
  {
    category: 'Risk Management',
    icon: Shield,
    color: 'text-blue-500',
    rules: [
      'Maximum risk per trade: 2% of account balance',
      'Daily loss limit: 6% of account balance',
      'Maximum concurrent trades: 10',
      'Stop loss is mandatory on all positions',
      'Risk-reward ratio must be at least 1:2'
    ]
  },
  {
    category: 'Trading Hours',
    icon: Clock,
    color: 'text-green-500',
    rules: [
      'Trading allowed: Monday 00:00 - Friday 23:59 GMT',
      'No trading during major news events',
      'Weekend positions must be closed by Friday 23:00 GMT',
      'Maximum holding time: 7 days per position'
    ]
  },
  {
    category: 'Account Requirements',
    icon: DollarSign,
    color: 'text-yellow-500',
    rules: [
      'Minimum account balance: $1,000',
      'Maximum leverage: 1:100',
      'Profit target: 10% monthly growth',
      'Maximum drawdown allowed: 15%',
      'Account must maintain minimum equity of $500'
    ]
  },
  {
    category: 'EA Usage',
    icon: Zap,
    color: 'text-purple-500',
    rules: [
      'Only approved EAs are allowed',
      'EA must be registered with valid license',
      'Maximum 3 EAs per account',
      'Regular EA performance monitoring required',
      'EA updates must be approved before use'
    ]
  }
]

const violations = [
  {
    type: 'Warning',
    description: 'Risk per trade exceeded on EUR/USD position',
    date: '2024-09-10',
    status: 'Resolved'
  },
  {
    type: 'Notice',
    description: 'Account drawdown approaching limit (12%)',
    date: '2024-09-08',
    status: 'Active'
  }
]

const getViolationIcon = (type: string) => {
  switch (type) {
    case 'Warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'Violation':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <CheckCircle className="h-4 w-4 text-blue-500" />
  }
}

export default function TradingRulesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <ScrollText className="h-8 w-8 text-primary" />
          Trading Rules
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Platform rules and guidelines for successful trading
        </p>
      </div>

      {/* Account Status */}
      <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Account Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  Account in Good Standing
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  All trading rules are being followed
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Compliant
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trading Rules */}
      <div className="grid gap-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        {tradingRules.map((category, index) => (
          <Card key={category.category} className={`hover:shadow-lg transition-shadow animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className={`h-6 w-6 ${category.color}`} />
                {category.category}
              </CardTitle>
              <CardDescription>
                Important guidelines for {category.category.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {category.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Violations History */}
      <Card className="animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Recent Notifications
          </CardTitle>
          <CardDescription>
            Rule violations and compliance notices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {violations.length > 0 ? (
            <div className="space-y-4">
              {violations.map((violation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getViolationIcon(violation.type)}
                    <div>
                      <p className="font-medium">{violation.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(violation.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={violation.status === 'Active' ? 'destructive' : 'secondary'}>
                    {violation.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No rule violations recorded</p>
              <p className="text-sm text-muted-foreground">Keep up the good work!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}