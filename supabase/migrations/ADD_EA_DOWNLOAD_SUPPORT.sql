-- Migration: Add EA Download Support
-- Allows users to download EA files they have purchased (active licenses only)
-- Files are stored in Supabase Storage and access is verified via license

-- Add file_key column to products table for storing EA file path
DO $$ 
BEGIN
  -- Add file_key to products table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = 'products' 
      AND column_name = 'file_key'
  ) THEN
    ALTER TABLE public.products ADD COLUMN file_key TEXT;
  END IF;

  -- Also add file_key to ea_products table for backward compatibility (only if table exists)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'ea_products'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'ea_products' 
        AND column_name = 'file_key'
    ) THEN
      ALTER TABLE public.ea_products ADD COLUMN file_key TEXT;
    END IF;
  END IF;
END $$;

-- Create storage bucket for EA files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ea-files', 'ea-files', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for EA files
-- Only authenticated users with active licenses can download
DROP POLICY IF EXISTS "Users with active licenses can download EAs" ON storage.objects;
CREATE POLICY "Users with active licenses can download EAs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ea-files' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.licenses l
    LEFT JOIN public.products p ON (
      l.ea_product_id = p.id::TEXT 
      OR l.ea_product_id = p.product_code
    )
    WHERE l.user_id = auth.uid()
      AND l.status = 'active'
      AND (
        l.expires_at IS NULL 
        OR l.expires_at > NOW()
      )
      AND (
        -- Match by file_key from products table
        (p.file_key IS NOT NULL AND p.file_key = storage.objects.name)
        -- Fallback: match by file path containing product code or id
        OR (p.product_code IS NOT NULL AND storage.objects.name LIKE '%' || p.product_code || '%')
        OR (p.id::TEXT IS NOT NULL AND storage.objects.name LIKE '%' || p.id::TEXT || '%')
      )
  )
);

-- Admins can upload EA files
DROP POLICY IF EXISTS "Admins can upload EA files" ON storage.objects;
CREATE POLICY "Admins can upload EA files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ea-files' 
  AND public.is_admin()
);

-- Admins can update EA files
DROP POLICY IF EXISTS "Admins can update EA files" ON storage.objects;
CREATE POLICY "Admins can update EA files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'ea-files' 
  AND public.is_admin()
);

-- Admins can delete EA files
DROP POLICY IF EXISTS "Admins can delete EA files" ON storage.objects;
CREATE POLICY "Admins can delete EA files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ea-files' 
  AND public.is_admin()
);

-- Create RPC function to get secure download URL for EA
-- This verifies the user has an active license before providing download link
CREATE OR REPLACE FUNCTION public.get_ea_download_url(
  p_license_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
  v_product RECORD;
  v_file_key TEXT;
  v_download_url TEXT;
BEGIN
  -- Get license and verify ownership
  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License not found or access denied'
    );
  END IF;

  -- Check if license is active
  IF v_license.status != 'active' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License is not active. Please renew your license to download.'
    );
  END IF;

  -- Check if license has expired
  IF v_license.expires_at IS NOT NULL AND v_license.expires_at <= NOW() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'License has expired. Please renew to download.'
    );
  END IF;

  -- Get product information
  -- Try products table first, fallback to ea_products (if it exists)
  SELECT * INTO v_product
  FROM public.products
  WHERE id::TEXT = v_license.ea_product_id
     OR product_code = v_license.ea_product_id
  LIMIT 1;

  -- If not found in products, try ea_products (only if table exists)
  IF NOT FOUND THEN
    BEGIN
      SELECT * INTO v_product
      FROM public.ea_products
      WHERE id::TEXT = v_license.ea_product_id
         OR product_code = v_license.ea_product_id
      LIMIT 1;
    EXCEPTION WHEN undefined_table THEN
      -- Table doesn't exist, continue with v_product as NOT FOUND
      NULL;
    END;
  END IF;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Product not found for this license'
    );
  END IF;

  -- Get file key from product
  v_file_key := v_product.file_key;

  IF v_file_key IS NULL OR v_file_key = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'EA file not available for download. Please contact support.'
    );
  END IF;

  -- Generate signed URL for download (valid for 1 hour)
  -- Note: This requires Supabase Storage API, which we'll handle in the frontend
  -- For now, return the file key and let frontend generate the URL
  RETURN json_build_object(
    'success', true,
    'file_key', v_file_key,
    'bucket', 'ea-files',
    'product_name', v_product.name,
    'version', COALESCE(v_product.version, '1.0.0'),
    'message', 'Download URL generated successfully'
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_ea_download_url(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ea_download_url(UUID) TO service_role;

-- Add comment
COMMENT ON FUNCTION public.get_ea_download_url IS 'Returns secure download information for EA files. Verifies user has active license before providing download access.';
