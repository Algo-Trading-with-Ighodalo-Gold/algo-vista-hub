import * as React from "react"
import { cn } from "@/lib/utils"

interface TableScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Max height for vertical scroll. Default: 70vh */
  maxHeight?: string
}

/**
 * Reusable wrapper for admin tables. Provides:
 * - overflow-x-auto for horizontal scrolling
 * - overflow-y-auto + max-height for vertical scrolling of long tables
 * - min-w-max inner wrapper so table can grow wider than viewport
 * - Sticky header support when used with thead
 */
export const TableScroll = React.forwardRef<HTMLDivElement, TableScrollProps>(
  ({ className, children, maxHeight = "70vh", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "min-w-0 overflow-x-auto overflow-y-auto [-webkit-overflow-scrolling:touch]",
        className
      )}
      style={{ maxHeight }}
      {...props}
    >
      <div className="min-w-max inline-block">
        {children}
      </div>
    </div>
  )
)
TableScroll.displayName = "TableScroll"
