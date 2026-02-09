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
import { Plus, Edit, Trash2, Package, TrendingUp, BarChart3, Upload, X, Image as ImageIcon, Loader2, Key } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

// Use products table instead of ea_products
type EaProduct = {
  id: string
  name: string
  product_code: string
  description?: string | null
  price_cents?: number | null
  version?: string | null
  max_concurrent_sessions?: number | null
  max_mt5_accounts?: number | null
  requires_hardware_binding?: boolean | null
  is_active?: boolean | null
  key_features?: string[] | null
  trading_pairs?: string | null
  timeframes?: string | null
  strategy_type?: string | null
  min_deposit?: string | null
  avg_monthly_return?: string | null
  max_drawdown?: string | null
  performance?: string | null
  stripe_price_id?: string | null
  created_at?: string | null
  updated_at?: string | null
}
type EaProductInsert = Partial<EaProduct>
type EaProductUpdate = Partial<EaProduct>

interface ProductStats {
  total_sales: number
  total_revenue: number
  active_licenses: number
}

export default function EAManagement() {
  const [products, setProducts] = useState<EaProduct[]>([])
  const [productStats, setProductStats] = useState<Map<string, ProductStats>>(new Map())
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<EaProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingStatsProduct, setViewingStatsProduct] = useState<EaProduct | null>(null)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [eaFile, setEaFile] = useState<File | null>(null)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [uploadingEA, setUploadingEA] = useState(false)
  const [currentEAFile, setCurrentEAFile] = useState<string | null>(null)
  const [currentLicenseFile, setCurrentLicenseFile] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Fetch from products table (linked to Cloudflare)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
      
      // Fetch sales stats for each product
      const statsMap = new Map<string, ProductStats>()
      for (const product of data || []) {
        // Look up licenses by product_code (which matches id in products table)
        const { data: licenses } = await supabase
          .from("licenses")
          .select("*")
          .or(`ea_product_id.eq.${product.id},ea_product_id.eq.${product.product_code},ea_product_name.eq.${product.name}`)
        
        const totalSales = licenses?.length || 0
        const activeLicenses = licenses?.filter(l => l.status === 'active').length || 0
        const totalRevenue = (product.price_cents || 0) * totalSales
        
        statsMap.set(product.id, {
          total_sales: totalSales,
          total_revenue: totalRevenue,
          active_licenses: activeLicenses
        })
      }
      setProductStats(statsMap)
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
  
  const handleViewStats = (product: EaProduct) => {
    setViewingStatsProduct(product)
    setIsStatsDialogOpen(true)
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
      image_key: null,
      file_key: null,
    })
    setKeyFeatureInput("")
    setImageFile(null)
    setImagePreview(null)
    setEaFile(null)
    setLicenseFile(null)
    setCurrentEAFile(null)
    setCurrentLicenseFile(null)
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
      image_key: (product as any).image_key || null,
      file_key: (product as any).file_key || null,
    })
    setKeyFeatureInput("")
    setImageFile(null)
    setImagePreview((product as any).image_key ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${(product as any).image_key}` : null)
    setEaFile(null)
    setLicenseFile(null)
    setCurrentEAFile((product as any).file_key || null)
    setCurrentLicenseFile((product as any).license_file_key || null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this EA product?")) return

    try {
      const { error } = await supabase
        .from("products")
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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${formData.product_code || 'product'}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      return filePath
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEAFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Prevent folder selection (check if webkitRelativePath exists and has path separators)
    if ((file as any).webkitRelativePath && (file as any).webkitRelativePath.split('/').length > 1) {
      toast({
        title: "Folders Not Allowed",
        description: "Please select individual files, not folders. Click 'Choose File' and select a single .ex4 or .ex5 file.",
        variant: "destructive",
      })
      e.target.value = '' // Reset input
      return
    }
    
    if (file) {
      // STRICT VALIDATION: Only allow .ex4 and .ex5 files (compiled EA files)
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ['ex4', 'ex5'] // .ex4 for MT4, .ex5 for MT5
      const forbiddenExtensions = ['mq5', 'mq4', 'ex', 'mqh', 'mql', 'mql5', 'mql4', 'cpp', 'h', 'hpp', 'c', 'cs', 'py', 'js', 'ts']
      
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        toast({
          title: "Invalid File Type",
          description: `Only .ex4 (MT4) and .ex5 (MT5) files are allowed. Source code files (.mq5, .mq4, .ex, etc.) are NOT permitted for security reasons.`,
          variant: "destructive",
        })
        return
      }

      // Check if it's a forbidden extension (double check)
      if (forbiddenExtensions.includes(fileExt)) {
        toast({
          title: "Security Error",
          description: "Source code files are NOT allowed. Only compiled .ex4 (MT4) or .ex5 (MT5) files can be uploaded.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB for EA files)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "EA file must be less than 10MB",
          variant: "destructive",
        })
        return
      }

      setEaFile(file)
      toast({
        title: "File Selected",
        description: `${file.name} ready to upload`,
      })
    }
  }

  const uploadEAFile = async (productCode: string): Promise<string | null> => {
    if (!eaFile) return null

    try {
      setUploadingEA(true)
      
      // Ensure file is .ex4 or .ex5
      const fileExt = eaFile.name.split('.').pop()?.toLowerCase()
      if (fileExt !== 'ex4' && fileExt !== 'ex5') {
        throw new Error('Only .ex4 (MT4) and .ex5 (MT5) files are allowed')
      }

      // Create unique filename: product-code-version-timestamp.ex4 or .ex5
      const timestamp = Date.now()
      const version = formData.version || '1.0.0'
      const fileName = `${productCode}-v${version}-${timestamp}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage (ea-files bucket)
      const { error: uploadError } = await supabase.storage
        .from('ea-files')
        .upload(filePath, eaFile, {
          cacheControl: '3600',
          upsert: false // Don't overwrite existing files
        })

      if (uploadError) {
        console.error('EA Upload error:', uploadError)
        throw uploadError
      }

      toast({
        title: "EA File Uploaded",
        description: `${eaFile.name} uploaded successfully`,
      })

      return filePath
    } catch (error: any) {
      console.error('Error uploading EA file:', error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload EA file",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadingEA(false)
    }
  }

  const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Prevent folder selection (check if webkitRelativePath exists and has path separators)
    if ((file as any).webkitRelativePath && (file as any).webkitRelativePath.split('/').length > 1) {
      toast({
        title: "Folders Not Allowed",
        description: "Please select individual files, not folders.",
        variant: "destructive",
      })
      e.target.value = ''
      return
    }
    
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      
      // Allow .mqh files (license header files)
      if (fileExt !== 'mqh') {
        toast({
          title: "Invalid File Type",
          description: "Only .mqh license files are allowed.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 1MB for license files)
      if (file.size > 1 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "License file must be less than 1MB",
          variant: "destructive",
        })
        return
      }

      setLicenseFile(file)
      toast({
        title: "License File Selected",
        description: `${file.name} ready to upload`,
      })
    }
  }

  const uploadLicenseFile = async (productCode: string): Promise<string | null> => {
    if (!licenseFile) return null

    try {
      setUploadingEA(true)
      
      const fileExt = licenseFile.name.split('.').pop()?.toLowerCase()
      if (fileExt !== 'mqh') {
        throw new Error('Only .mqh files are allowed')
      }

      const timestamp = Date.now()
      const fileName = `${productCode}-license-${timestamp}.mqh`
      const filePath = `licenses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ea-files')
        .upload(filePath, licenseFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('License Upload error:', uploadError)
        throw uploadError
      }

      toast({
        title: "License File Uploaded",
        description: `${licenseFile.name} uploaded successfully`,
      })

      return filePath
    } catch (error: any) {
      console.error('Error uploading license file:', error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload license file",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadingEA(false)
    }
  }

  const handleSubmit = async () => {
    try {
      // SECURITY: Validate EA file before proceeding (only required for new products)
      if (!editingProduct && !eaFile && !formData.file_key) {
        toast({
          title: "EA File Required",
          description: "You must upload a .ex4 (MT4) or .ex5 (MT5) EA file to create a product",
          variant: "destructive",
        })
        return
      }

      // Upload EA file if a new one was selected
      let eaFileKey = formData.file_key as string | null
      if (eaFile) {
        const uploadedKey = await uploadEAFile(formData.product_code || '')
        if (uploadedKey) {
          eaFileKey = uploadedKey
        } else {
          return // Stop if upload failed
        }
      }

      // Upload license file if provided (optional)
      let licenseFileKey = (formData as any).license_file_key as string | null
      if (licenseFile) {
        const uploadedLicenseKey = await uploadLicenseFile(formData.product_code || '')
        if (uploadedLicenseKey) {
          licenseFileKey = uploadedLicenseKey
        }
        // Don't fail if license upload fails, it's optional
      }

      // Upload image if a new one was selected
      let imageKey = formData.image_key as string | null
      if (imageFile) {
        const uploadedKey = await uploadImage(imageFile)
        if (uploadedKey) {
          imageKey = uploadedKey
        } else {
          return // Stop if upload failed
        }
      }

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

      // Add image_key if available
      if (imageKey) {
        cleanedData.image_key = imageKey
      }

      // Add file_key if available (CRITICAL for downloads)
      if (eaFileKey) {
        cleanedData.file_key = eaFileKey
      }

      // Add license_file_key if available (optional)
      if (licenseFileKey) {
        cleanedData.license_file_key = licenseFileKey
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
        // Update existing product in products table
        const { error } = await supabase
          .from("products")
          .update(cleanedData)
          .eq("id", editingProduct.id)

        if (error) {
          console.error("Update error:", error)
          // Check if it's a schema cache error
          if (error.message && error.message.includes("schema cache")) {
            toast({
              title: "Database Schema Error",
              description: "Missing database columns. Please run the migration: supabase/migrations/20250202000000_link_products_to_licensing.sql in Supabase SQL Editor",
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
        // Create new product in products table
        if (!cleanedData.product_code || !cleanedData.name) {
          toast({
            title: "Error",
            description: "Product code and name are required",
            variant: "destructive",
          })
          return
        }

        // Ensure id matches product_code for consistency with Cloudflare
        const productData = {
          ...cleanedData,
          id: cleanedData.product_code, // Use product_code as id
        }

        const { error } = await supabase
          .from("products")
          .insert([productData])

        if (error) {
          console.error("Insert error:", error)
          // Check if it's a schema cache error
          if (error.message && error.message.includes("schema cache")) {
            toast({
              title: "Database Schema Error",
              description: "Missing database columns. Please run the migration: supabase/migrations/20250202000000_link_products_to_licensing.sql in Supabase SQL Editor",
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
      setImageFile(null)
      setImagePreview(null)
      setEaFile(null)
      setCurrentEAFile(null)
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
              <div className="space-y-2 text-sm border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sales:</span>
                  <span className="font-medium">{productStats.get(product.id)?.total_sales || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-medium">
                    ${((productStats.get(product.id)?.total_revenue || 0) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Licenses:</span>
                  <span className="font-medium">{productStats.get(product.id)?.active_licenses || 0}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewStats(product)}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Stats
                </Button>
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

            {/* EA File Upload Section - SECURITY CRITICAL */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ea_file">EA File (.ex4/.ex5) *</Label>
                <Badge variant="destructive" className="text-xs">
                  SECURITY: Only compiled files allowed
                </Badge>
              </div>
              <div className="space-y-2">
                {currentEAFile && !eaFile ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{currentEAFile}</p>
                        <p className="text-xs text-muted-foreground">Current EA file</p>
                      </div>
                    </div>
                    <div>
                      <input
                        id="ea_file_change"
                        type="file"
                        accept=".ex4,.ex5"
                        onChange={handleEAFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('ea_file_change')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : eaFile ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{eaFile.name}</p>
                        <p className="text-xs text-muted-foreground">Ready to upload</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEaFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-red-300 dark:border-red-800 rounded-lg p-6 text-center bg-red-50/50 dark:bg-red-950/10">
                    <Upload className="h-12 w-12 mx-auto text-red-600 dark:text-red-400 mb-2" />
                    <input
                      id="ea_file"
                      type="file"
                      accept=".ex4,.ex5"
                      onChange={handleEAFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="default"
                      className="mt-2"
                      onClick={() => {
                        const input = document.getElementById('ea_file') as HTMLInputElement
                        if (input) {
                          input.click()
                        }
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload EA File (.ex4/.ex5)
                    </Button>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-2 font-semibold">
                      ⚠️ SECURITY: Only compiled .ex4 files allowed
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Source code files (.mq5, .mq4, .ex, etc.) are BLOCKED
                    </p>
                  </div>
                )}
                {uploadingEA && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading EA file...
                  </div>
                )}
              </div>
            </div>

            {/* License File Upload Section (Optional) */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="license_file">License File (.mqh) - Optional</Label>
                <Badge variant="outline" className="text-xs">
                  Only if EA requires separate license file
                </Badge>
              </div>
              <div className="space-y-2">
                {currentLicenseFile && !licenseFile ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{currentLicenseFile}</p>
                        <p className="text-xs text-muted-foreground">Current license file</p>
                      </div>
                    </div>
                    <div>
                      <input
                        id="license_file_change"
                        type="file"
                        accept=".mqh"
                        onChange={handleLicenseFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('license_file_change')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : licenseFile ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{licenseFile.name}</p>
                        <p className="text-xs text-muted-foreground">Ready to upload</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLicenseFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-lg p-4 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    <Key className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                    <input
                      id="license_file"
                      type="file"
                      accept=".mqh"
                      onChange={handleLicenseFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        const input = document.getElementById('license_file') as HTMLInputElement
                        if (input) {
                          input.click()
                        }
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload License File (.mqh) - Optional
                    </Button>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      Only upload if your EA requires a separate license header file
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Note: Most compiled .ex4 files already include the license code
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="image">Product Image</Label>
              <div className="space-y-2">
                {imagePreview ? (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        const input = document.getElementById('image') as HTMLInputElement
                        if (input) {
                          input.click()
                        }
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Click to upload or drag and drop
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
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
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false)
              setImageFile(null)
              setImagePreview(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={uploadingImage}>
              {uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                editingProduct ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sales Stats Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Sales Statistics</DialogTitle>
            <DialogDescription>
              {viewingStatsProduct?.name} - {viewingStatsProduct?.product_code}
            </DialogDescription>
          </DialogHeader>
          {viewingStatsProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {productStats.get(viewingStatsProduct.id)?.total_sales || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${((productStats.get(viewingStatsProduct.id)?.total_revenue || 0) / 100).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Active Licenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {productStats.get(viewingStatsProduct.id)?.active_licenses || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}




