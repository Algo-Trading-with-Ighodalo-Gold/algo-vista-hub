import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    positive: boolean
  }
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  trend.positive ? "text-success" : "text-destructive"
                }`}>
                  {trend.positive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}