import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Code, Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Tables } from '@/integrations/supabase/types'

type EADevelopment = Tables<'ea_development'>

interface EADevelopmentFormProps {
  onSuccess?: () => void
}

export function EADevelopmentForm({ onSuccess }: EADevelopmentFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requests, setRequests] = useState<EADevelopment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    strategy_name: '',
    requirements: ''
  })

  const fetchRequests = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('ea_development')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching EA development requests:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('ea_development')
        .insert({
          user_id: user.id,
          strategy_name: formData.strategy_name,
          requirements: formData.requirements,
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: "Request Submitted!",
        description: "Your EA development request has been submitted successfully.",
      })

      setFormData({ strategy_name: '', requirements: '' })
      setShowForm(false)
      await fetchRequests()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting EA development request:', error)
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch requests on component mount
  useState(() => {
    fetchRequests()
  })

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          EA Development Requests
        </CardTitle>
        <CardDescription>
          Submit requests for custom Expert Advisor development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showForm ? (
          <div className="space-y-4">
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New EA Development Request
            </Button>

            {/* Existing Requests */}
            {requests.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Your Requests</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{request.strategy_name}</h5>
                        <Badge 
                          variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'in_progress' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {request.requirements}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy_name">Strategy Name</Label>
              <Input
                id="strategy_name"
                placeholder="e.g., Scalping Bot v2.0"
                value={formData.strategy_name}
                onChange={(e) => setFormData({ ...formData, strategy_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements & Description</Label>
              <Textarea
                id="requirements"
                placeholder="Describe your EA requirements, entry/exit logic, risk management, timeframes, etc."
                rows={6}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Request
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
