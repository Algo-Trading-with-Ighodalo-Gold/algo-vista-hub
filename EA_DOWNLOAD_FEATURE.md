# EA Download Feature

## Overview
Users can now download EA files (.ex4 for MT4 or .ex5 for MT5) as a ZIP package directly from their accounts page after purchasing a license. Each ZIP file contains:
- The EA file (.ex4 or .ex5)
- A settings file (.set) with recommended parameters

The system ensures that:
- Only users with **active licenses** can download
- Users can only download EAs they have purchased (not source code files or unauthorized EAs)
- Downloads are secured via Supabase Storage with signed URLs
- Files are packaged as ZIP archives for easy installation

## Setup Instructions

### 1. Run SQL Migration
Run the SQL migration file in your Supabase SQL Editor:
```
supabase/migrations/ADD_EA_DOWNLOAD_SUPPORT.sql
```

This migration will:
- Add `file_key` column to `products` and `ea_products` tables
- Create `ea-files` storage bucket
- Set up storage policies for secure access
- Create `get_ea_download_url` RPC function

### 2. Upload EA Files to Storage
1. Go to Supabase Dashboard → Storage
2. Navigate to the `ea-files` bucket
3. Upload your EA files (.ex4 format)
4. Note the file path/name

### 3. Link Files to Products
For each product, update the `file_key` column with the storage path:

```sql
-- Example: Link EA file to a product
UPDATE public.products 
SET file_key = 'EA-BOS-v1.0.ex4' 
WHERE product_code = 'EA-BOS';

-- Or for ea_products table
UPDATE public.ea_products 
SET file_key = 'SWING_MASTER-v1.0.ex4' 
WHERE product_code = 'SWING_MASTER';
```

**Important:** The `file_key` should match the exact file name/path in the `ea-files` storage bucket.

## How It Works

### User Flow
1. User purchases an EA and receives a license
2. User goes to Dashboard → Accounts page
3. User expands their license card
4. If license is **active** and **not expired**, a "Download EA" button appears
5. User clicks the button
6. System verifies license status
7. System generates a signed URL (valid for 1 hour)
8. System downloads the EA file and creates a ZIP package containing:
   - The EA file (.ex4 or .ex5)
   - A settings file (.set) with recommended parameters
9. ZIP file downloads automatically

### Security Features
- **License Verification**: Only active, non-expired licenses can download
- **User Ownership**: Users can only download EAs from their own licenses
- **Signed URLs**: Download links expire after 1 hour
- **Storage Policies**: RLS policies ensure users can only access files for their licensed products

### Technical Details

#### RPC Function: `get_ea_download_url`
- Verifies license ownership
- Checks license status (must be 'active')
- Checks expiration date
- Retrieves product information
- Returns file_key and bucket information

#### Storage Bucket: `ea-files`
- Private bucket (not publicly accessible)
- Access controlled via RLS policies
- Only authenticated users with active licenses can download

#### Frontend Implementation
- Download button appears in `LicenseCard` component
- Only visible for active, non-expired licenses
- Uses Supabase Storage API to generate signed URLs
- Downloads EA file and creates ZIP package using JSZip library
- ZIP contains EA file and auto-generated settings file
- Automatically triggers browser download

## Admin Tasks

### Adding EA Files
1. Upload .ex4 file to `ea-files` bucket in Supabase Storage
2. Update product record with `file_key`:
   ```sql
   UPDATE products 
   SET file_key = 'your-file-name.ex4' 
   WHERE product_code = 'YOUR_PRODUCT_CODE';
   ```

### Updating EA Files
1. Upload new version to storage (with new name or overwrite)
2. Update `file_key` if filename changed
3. Optionally update `version` column in products table

## Troubleshooting

### "EA file not available for download"
- Check that `file_key` is set in the products table
- Verify the file exists in the `ea-files` storage bucket
- Ensure the `file_key` matches the exact filename in storage

### "License not found or access denied"
- User must own the license
- License must be in 'active' status
- License must not be expired

### "Failed to generate download link"
- Check Supabase Storage bucket configuration
- Verify storage policies are correctly set
- Check browser console for detailed errors

## Notes
- Both .ex4 (MT4) and .ex5 (MT5) files are supported
- Files are downloaded as ZIP packages containing:
  - EA file (.ex4 or .ex5)
  - Settings file (.set) with recommended parameters
- ZIP filename uses the product name (e.g., `EA-BOS.zip`)
- Settings file includes recommended risk management and trading parameters
- Users can customize the settings file according to their trading strategy
- Download links expire after 1 hour for security
- Users can re-download as long as their license is active
