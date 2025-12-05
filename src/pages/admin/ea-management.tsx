import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type EaProduct = Database["public"]["Tables"]["ea_products"]["Row"]
type EaProductInsert = Database["public"]["Tables"]["ea_products"]["Insert"]
type EaProductUpdate = Database["public"]["Tables"]["ea_products"]["Update"]

export default function EAManagement() {
  const [products, setProducts] = useState<EaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<EaProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Partial<EaProductInsert>>({
    product_code: "",
    name: "",
    description: "",
    price_cents: 0,
    is_active: true,
    max_concurrent_sessions: 1,
    max_mt5_accounts: 1,
    requires_hardware_binding: true,
    version: "1.0.0",
    key_features: [],
    trading_pairs: "",
    timeframes: "",
    strategy_type: "",
    performance: "",
    avg_monthly_return: "",
    max_drawdown: "",
    min_deposit: "",
  })
  
  const [keyFeatureInput, setKeyFeatureInput] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("ea_products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load EA products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      product_code: "",
      name: "",
      description: "",
      price_cents: 0,
      is_active: true,
      max_concurrent_sessions: 1,
      max_mt5_accounts: 1,
      requires_hardware_binding: true,
      version: "1.0.0",
      key_features: [],
      trading_pairs: "",
      timeframes: "",
      strategy_type: "",
      performance: "",
      avg_monthly_return: "",
      max_drawdown: "",
      min_deposit: "",
    })
    setKeyFeatureInput("")
    setIsDialogOpen(true)
  }
  
  const addKeyFeature = () => {
    if (keyFeatureInput.trim()) {
      setFormData({
        ...formData,
        key_features: [...(formData.key_features || []), keyFeatureInput.trim()]
      })
      setKeyFeatureInput("")
    }
  }
  
  const removeKeyFeature = (index: number) => {
    const newFeatures = [...(formData.key_features || [])]
    newFeatures.splice(index, 1)
    setFormData({ ...formData, key_features: newFeatures })
  }

  const handleEdit = (product: EaProduct) => {
    setEditingProduct(product)
    setFormData({
      product_code: product.product_code,
      name: product.name,
      description: product.description || "",
      price_cents: product.price_cents || 0,
      is_active: product.is_active ?? true,
      max_concurrent_sessions: product.max_concurrent_sessions || 1,
      max_mt5_accounts: product.max_mt5_accounts || 1,
      requires_hardware_binding: product.requires_hardware_binding ?? true,
      version: product.version || "1.0.0",
      key_features: product.key_features || [],
      trading_pairs: product.trading_pairs || "",
      timeframes: product.timeframes || "",
      strategy_type: product.strategy_type || "",
      performance: product.performance || "",
      avg_monthly_return: product.avg_monthly_return || "",
      max_drawdown: product.max_drawdown || "",
      min_deposit: product.min_deposit || "",
    })
    setKeyFeatureInput("")
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this EA product?")) return

    try {
      const { error } = await supabase
        .from("ea_products")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "EA product deleted successfully",
      })
      fetchProducts()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete EA product",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    try {
      // Clean up formData - only include fields that exist and have values
      const cleanedData: any = {
        product_code: formData.product_code,
        name: formData.name,
        description: formData.description || null,
        price_cents: formData.price_cents || 0,
        is_active: formData.is_active ?? true,
        max_concurrent_sessions: formData.max_concurrent_sessions || 1,
        max_mt5_accounts: formData.max_mt5_accounts || 1,
        requires_hardware_binding: formData.requires_hardware_binding ?? true,
        version: formData.version || "1.0.0",
      }

      // Only include optional fields if they have values (to avoid sending empty strings)
      if (formData.key_features && formData.key_features.length > 0) {
        cleanedData.key_features = formData.key_features
      }
      if (formData.trading_pairs && formData.trading_pairs.trim()) {
        cleanedData.trading_pairs = formData.trading_pairs
      }
      if (formData.timeframes && formData.timeframes.trim()) {
        cleanedData.timeframes = formData.timeframes
      }
      if (formData.strategy_type && formData.strategy_type.trim()) {
        cleanedData.strategy_type = formData.strategy_type
      }
      if (formData.min_deposit && formData.min_deposit.trim()) {
        cleanedData.min_deposit = formData.min_deposit
      }
      if (formData.avg_monthly_return && formData.avg_monthly_return.trim()) {
        cleanedData.avg_monthly_return = formData.avg_monthly_return
      }
      if (formData.max_drawdown && formData.max_drawdown.trim()) {
        cleanedData.max_drawdown = formData.max_drawdown
      }
      if (formData.performance && formData.performance.trim()) {
        cleanedData.performance = formData.performance
      }

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("ea_products")
          .update(cleanedData)
          .eq("id", editingProduct.id)

        if (error) {
          console.error("Update error:", error)
          // Check if it's a schema cache error
          if (error.message && error.message.includes("schema cache")) {
            toast({
              title: "Database Schema Error",
              description: "Missing database columns. Please run the migration: supabase/migrations/20250201130000_add_ea_product_columns.sql in Supabase SQL Editor",
              variant: "destructive",
            })
          } else {
            throw error
          }
          return
        }

        toast({
          title: "Success",
          description: "EA product updated successfully",
        })
      } else {
        // Create new product
        if (!cleanedData.product_code || !cleanedData.name) {
          toast({
            title: "Error",
            description: "Product code and name are required",
            variant: "destructive",
          })
          return
        }

        const { error } = await supabase
          .from("ea_products")
          .insert([cleanedData])

        if (error) {
          console.error("Insert error:", error)
          // Check if it's a schema cache error
          if (error.message && error.message.includes("schema cache")) {
            toast({
              title: "Database Schema Error",
              description: "Missing database columns. Please run the migration: supabase/migrations/20250201130000_add_ea_product_columns.sql in Supabase SQL Editor",
              variant: "destructive",
            })
          } else {
            throw error
          }
          return
        }

        toast({
          title: "Success",
          description: "EA product created successfully",
        })
      }

      setIsDialogOpen(false)
      fetchProducts()
    } catch (error: any) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error.message || error.details || "Failed to save EA product. Please run ADD_EA_PRODUCT_COLUMNS.sql in Supabase first.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EA Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage Expert Advisor products
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add New EA
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{product.product_code}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    ${((product.price_cents || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>{product.version}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No EA products yet</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create First EA
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit EA Product" : "Create New EA Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the EA product information"
                : "Add a new Expert Advisor product to the platform"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_code">Product Code *</Label>
                <Input
                  id="product_code"
                  value={formData.product_code}
                  onChange={(e) =>
                    setFormData({ ...formData, product_code: e.target.value })
                  }
                  placeholder="e.g., GOLD_MILKER"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Gold Milker EA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description of the EA..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_cents">Price (cents)</Label>
                <Input
                  id="price_cents"
                  type="number"
                  value={formData.price_cents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_cents: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="1.0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_active: value === "active" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_concurrent_sessions">Max Sessions</Label>
                <Input
                  id="max_concurrent_sessions"
                  type="number"
                  value={formData.max_concurrent_sessions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_concurrent_sessions: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_mt5_accounts">Max MT5 Accounts</Label>
                <Input
                  id="max_mt5_accounts"
                  type="number"
                  value={formData.max_mt5_accounts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_mt5_accounts: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requires_hardware_binding">
                  Hardware Binding
                </Label>
                <Select
                  value={
                    formData.requires_hardware_binding ? "yes" : "no"
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      requires_hardware_binding: value === "yes",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Required</SelectItem>
                    <SelectItem value="no">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="space-y-2 border-t pt-4">
              <Label>Key Features</Label>
              <div className="flex gap-2">
                <Input
                  value={keyFeatureInput}
                  onChange={(e) => setKeyFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addKeyFeature()
                    }
                  }}
                  placeholder="Enter a key feature and press Enter"
                />
                <Button type="button" onClick={addKeyFeature} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.key_features || []).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Trading Specs Section */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-semibold">Trading Specs</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trading_pairs">Trading Pairs</Label>
                  <Input
                    id="trading_pairs"
                    value={formData.trading_pairs}
                    onChange={(e) =>
                      setFormData({ ...formData, trading_pairs: e.target.value })
                    }
                    placeholder="e.g., XAUUSD, EURUSD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframes">Timeframes</Label>
                  <Input
                    id="timeframes"
                    value={formData.timeframes}
                    onChange={(e) =>
                      setFormData({ ...formData, timeframes: e.target.value })
                    }
                    placeholder="e.g., M15, H1, H4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy_type">Strategy Type</Label>
                  <Input
                    id="strategy_type"
                    value={formData.strategy_type}
                    onChange={(e) =>
                      setFormData({ ...formData, strategy_type: e.target.value })
                    }
                    placeholder="e.g., Swing/Trend Hybrid"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_deposit">Min Deposit</Label>
                  <Input
                    id="min_deposit"
                    value={formData.min_deposit}
                    onChange={(e) =>
                      setFormData({ ...formData, min_deposit: e.target.value })
                    }
                    placeholder="e.g., $300 - $1,000"
                  />
                </div>
              </div>
            </div>

            {/* Performance Section */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-semibold">Performance</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avg_monthly_return">Avg Monthly Return</Label>
                  <Input
                    id="avg_monthly_return"
                    value={formData.avg_monthly_return}
                    onChange={(e) =>
                      setFormData({ ...formData, avg_monthly_return: e.target.value })
                    }
                    placeholder="e.g., 10 - 20%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_drawdown">Max Drawdown</Label>
                  <Input
                    id="max_drawdown"
                    value={formData.max_drawdown}
                    onChange={(e) =>
                      setFormData({ ...formData, max_drawdown: e.target.value })
                    }
                    placeholder="e.g., 8 - 12%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performance">Performance Summary</Label>
                  <Input
                    id="performance"
                    value={formData.performance}
                    onChange={(e) =>
                      setFormData({ ...formData, performance: e.target.value })
                    }
                    placeholder="e.g., +268% performance / Medium risk"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




