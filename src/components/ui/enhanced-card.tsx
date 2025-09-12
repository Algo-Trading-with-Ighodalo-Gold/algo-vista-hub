import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "glow" | "premium"
  animated?: boolean
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", animated = false, ...props }, ref) => {
    const baseClasses = cn(
      "transition-all duration-300",
      animated && "hover-scale hover-glow",
      {
        "gradient-border": variant === "gradient",
        "border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30": variant === "glow",
        "bg-gradient-primary text-primary-foreground shadow-2xl": variant === "premium",
      },
      className
    )

    return (
      <Card
        ref={ref}
        className={baseClasses}
        {...props}
      />
    )
  }
)

EnhancedCard.displayName = "EnhancedCard"

export { EnhancedCard }