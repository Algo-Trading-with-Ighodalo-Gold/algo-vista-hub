import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
// Using native Date methods for formatting
import { cn } from '@/lib/utils'

interface ExtendLicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExtend: (licenseId: string, newExpiryDate: Date) => Promise<void>
  isLoading?: boolean
  licenseName?: string
  currentExpiryDate?: string | null
  licenseId?: string
}

export function ExtendLicenseDialog({
  open,
  onOpenChange,
  onExtend,
  isLoading = false,
  licenseName,
  currentExpiryDate,
  licenseId
}: ExtendLicenseDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (currentExpiryDate) {
      const current = new Date(currentExpiryDate)
      // Default to 1 year from current expiry, or 1 year from today if expired
      const defaultDate = current > new Date() ? current : new Date()
      defaultDate.setFullYear(defaultDate.getFullYear() + 1)
      return defaultDate
    }
    // Default to 1 year from today
    const defaultDate = new Date()
    defaultDate.setFullYear(defaultDate.getFullYear() + 1)
    return defaultDate
  })

  const handleExtend = async () => {
    if (!selectedDate || !licenseId) return
    await onExtend(licenseId, selectedDate)
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extend License</DialogTitle>
          <DialogDescription>
            Set a new expiration date for this license. The license will remain active until the selected date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {currentExpiryDate && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-xs text-muted-foreground">Current Expiration</Label>
              <p className="text-sm font-medium">{formatDate(currentExpiryDate)}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="expiry-date">New Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="expiry-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Select a date in the future. The license will expire on this date.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExtend}
            disabled={isLoading || !selectedDate || !licenseId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extending...
              </>
            ) : (
              'Extend License'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
