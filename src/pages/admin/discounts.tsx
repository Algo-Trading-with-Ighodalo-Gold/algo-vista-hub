import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tag, Plus, Pencil, Calendar, Percent, DollarSign } from "lucide-react"

export interface DiscountCampaign {
  id: string
  name: string
  description: string | null
  discount_type: "percentage" | "fixed_amount"
  discount_value: number
  promo_code: string | null
  affiliate_id: string | null
  product_ids: string[] | null
  starts_at: string
  ends_at: string
  is_active: boolean
  max_redemptions: number | null
  redemption_count: number
  created_at: string
  updated_at: string
}

export default function AdminDiscountsPage() {
  const [campaigns, setCampaigns] = useState<DiscountCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<DiscountCampaign | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed_amount",
    discount_value: "",
    promo_code: "",
    starts_at: "",
    ends_at: "",
    is_active: true,
    max_redemptions: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("discount_campaigns")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCampaigns((data as DiscountCampaign[]) || [])
    } catch (error: any) {
      console.error("Error fetching discount campaigns:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load discount campaigns. Ensure the table exists (run the discount_campaigns migration).",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingCampaign(null)
    setForm({
      name: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      promo_code: "",
      starts_at: new Date().toISOString().slice(0, 16),
      ends_at: "",
      is_active: true,
      max_redemptions: "",
    })
    setDialogOpen(true)
  }

  const openEdit = (c: DiscountCampaign) => {
    setEditingCampaign(c)
    setForm({
      name: c.name,
      description: c.description || "",
      discount_type: c.discount_type,
      discount_value: String(c.discount_value),
      promo_code: c.promo_code || "",
      starts_at: c.starts_at.slice(0, 16),
      ends_at: c.ends_at.slice(0, 16),
      is_active: c.is_active,
      max_redemptions: c.max_redemptions != null ? String(c.max_redemptions) : "",
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    const value = parseFloat(form.discount_value)
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" })
      return
    }
    if (isNaN(value) || value < 0) {
      toast({ title: "Error", description: "Discount value must be a positive number", variant: "destructive" })
      return
    }
    if (form.discount_type === "percentage" && value > 100) {
      toast({ title: "Error", description: "Percentage cannot exceed 100", variant: "destructive" })
      return
    }
    if (!form.starts_at || !form.ends_at) {
      toast({ title: "Error", description: "Start and end dates are required", variant: "destructive" })
      return
    }
    if (new Date(form.ends_at) <= new Date(form.starts_at)) {
      toast({ title: "Error", description: "End date must be after start date", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: value,
        promo_code: form.promo_code.trim() || null,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        is_active: form.is_active,
        max_redemptions: form.max_redemptions.trim() ? parseInt(form.max_redemptions, 10) : null,
        updated_at: new Date().toISOString(),
      }

      if (editingCampaign) {
        const { error } = await supabase
          .from("discount_campaigns")
          .update(payload)
          .eq("id", editingCampaign.id)
        if (error) throw error
        toast({ title: "Success", description: "Campaign updated" })
      } else {
        const { error } = await supabase.from("discount_campaigns").insert(payload)
        if (error) throw error
        toast({ title: "Success", description: "Campaign created" })
      }
      setDialogOpen(false)
      fetchCampaigns()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save campaign",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (c: DiscountCampaign) => {
    try {
      const { error } = await supabase
        .from("discount_campaigns")
        .update({ is_active: !c.is_active, updated_at: new Date().toISOString() })
        .eq("id", c.id)
      if (error) throw error
      toast({ title: "Success", description: c.is_active ? "Campaign deactivated" : "Campaign activated" })
      fetchCampaigns()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update", variant: "destructive" })
    }
  }

  const formatDate = (s: string) => new Date(s).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
  const isCurrentlyActive = (c: DiscountCampaign) =>
    c.is_active &&
    new Date(c.starts_at) <= new Date() &&
    new Date(c.ends_at) >= new Date() &&
    (c.max_redemptions == null || c.redemption_count < c.max_redemptions)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-8 w-8" />
            Discount Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage promo codes, launch offers, and affiliate reward campaigns
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All campaigns</CardTitle>
          <CardDescription>
            Campaigns are shown to customers at checkout when they enter a promo code (coming soon). Admins can see and manage all campaigns here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No discount campaigns yet.</p>
              <p className="text-sm mt-1">Create one to run launch offers, festive sales, or affiliate reward campaigns.</p>
              <Button variant="outline" className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Promo code</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Redemptions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {c.discount_type === "percentage" ? (
                        <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> %</span>
                      ) : (
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Fixed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${Number(c.discount_value).toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      {c.promo_code ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">{c.promo_code}</code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(c.starts_at)} → {formatDate(c.ends_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.redemption_count}
                      {c.max_redemptions != null && ` / ${c.max_redemptions}`}
                    </TableCell>
                    <TableCell>
                      {isCurrentlyActive(c) ? (
                        <Badge variant="default">Active</Badge>
                      ) : !c.is_active ? (
                        <Badge variant="secondary">Inactive</Badge>
                      ) : new Date(c.ends_at) < new Date() ? (
                        <Badge variant="outline">Ended</Badge>
                      ) : new Date(c.starts_at) > new Date() ? (
                        <Badge variant="outline">Scheduled</Badge>
                      ) : (
                        <Badge variant="secondary">Limit reached</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(c)}
                      >
                        {c.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{editingCampaign ? "Edit campaign" : "New campaign"}</DialogTitle>
            <DialogDescription>
              Set discount type and value, optional promo code, and date range. Customers will see this when the campaign is active and they use the code at checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto min-h-0 flex-1 pr-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Launch week 20% off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Internal note or customer-facing text"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Discount type</Label>
                <Select
                  value={form.discount_type}
                  onValueChange={(v: "percentage" | "fixed_amount") => setForm((f) => ({ ...f, discount_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value {form.discount_type === "percentage" ? "(%)" : "($)"}</Label>
                <Input
                  id="value"
                  type="number"
                  min={0}
                  max={form.discount_type === "percentage" ? 100 : undefined}
                  step={form.discount_type === "percentage" ? 1 : 0.01}
                  value={form.discount_value}
                  onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                  placeholder={form.discount_type === "percentage" ? "20" : "10.00"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo_code">Promo code (optional)</Label>
              <Input
                id="promo_code"
                value={form.promo_code}
                onChange={(e) => setForm((f) => ({ ...f, promo_code: e.target.value.toUpperCase() }))}
                placeholder="e.g. LAUNCH20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="starts_at">Starts at</Label>
                <Input
                  id="starts_at"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ends_at">Ends at</Label>
                <Input
                  id="ends_at"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_redemptions">Max redemptions (optional)</Label>
              <Input
                id="max_redemptions"
                type="number"
                min={0}
                value={form.max_redemptions}
                onChange={(e) => setForm((f) => ({ ...f, max_redemptions: e.target.value }))}
                placeholder="Unlimited"
              />
            </div>
            {editingCampaign && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="rounded border-input"
                />
                <Label htmlFor="is_active">Active (campaign can be used)</Label>
              </div>
            )}
          </div>
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingCampaign ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
