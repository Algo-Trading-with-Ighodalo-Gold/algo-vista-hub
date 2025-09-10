import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Tables } from '@/integrations/supabase/types'

type AffiliateApplication = Tables<'affiliate_applications'>

interface AffiliateApplicationFormProps {
  onSuccess?: () => void
}

export function AffiliateApplicationForm({ onSuccess }: AffiliateApplicationFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applications, setApplications] = useState<AffiliateApplication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    social_link: ''
  })

  const fetchApplications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('affiliate_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching affiliate applications:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('affiliate_applications')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          social_link: formData.social_link || null,
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: "Application Submitted!",
        description: "Your affiliate application has been submitted for review.",
      })

      setFormData({ full_name: '', email: '', social_link: '' })
      setShowForm(false)
      await fetchApplications()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting affiliate application:', error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch applications on component mount
  useState(() => {
    fetchApplications()
  })

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Affiliate Applications
        </CardTitle>
        <CardDescription>
          Apply to become a verified affiliate partner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showForm ? (
          <div className="space-y-4">
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Affiliate Application
            </Button>

            {/* Existing Applications */}
            {applications.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Your Applications</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{application.full_name}</h5>
                        <Badge 
                          variant={
                            application.status === 'approved' ? 'default' :
                            application.status === 'rejected' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Email: {application.email}</div>
                        {application.social_link && (
                          <div>Social: {application.social_link}</div>
                        )}
                        <div>Applied: {new Date(application.created_at).toLocaleDateString()}</div>
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
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Your full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_link">Social Media / Website (Optional)</Label>
              <Input
                id="social_link"
                placeholder="https://twitter.com/yourusername or your website"
                value={formData.social_link}
                onChange={(e) => setFormData({ ...formData, social_link: e.target.value })}
              />
            </div>

            <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
              <p className="font-medium mb-1">Application Review Process:</p>
              <ul className="space-y-1">
                <li>• Applications are reviewed within 2-3 business days</li>
                <li>• We'll contact you via email with the decision</li>
                <li>• Approved affiliates get access to marketing materials</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Application
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
