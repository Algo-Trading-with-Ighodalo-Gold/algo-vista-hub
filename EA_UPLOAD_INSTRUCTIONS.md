# EA File Upload Instructions

## ⚠️ SECURITY CRITICAL: Source Code Protection

**NEVER upload source code files!** Users should NEVER have access to EA source code.

### ✅ ALLOWED Files:
- **`.ex4` files** - Compiled EA files for MT4 (MetaTrader 4)
- **`.ex5` files** - Compiled EA files for MT5 (MetaTrader 5)

### ❌ BLOCKED Files (Source Code):
- `.mq5` - MQL5 source code
- `.mq4` - MQL4 source code  
- `.ex` - Compiled but not protected
- `.mqh` - MQL header files
- `.mql`, `.mql5`, `.mql4` - Source code files
- `.cpp`, `.h`, `.hpp`, `.c` - C++ source code
- `.cs` - C# source code
- `.py` - Python source code
- `.js`, `.ts` - JavaScript/TypeScript source code
- **ANY other source code format**

## How to Upload EA Files

### Method 1: Via Admin Dashboard (Recommended)

1. **Go to Admin Dashboard**
   - Navigate to: `/admin/ea-management`
   - Or: Admin → EA Management

2. **Create or Edit a Product**
   - Click "Add New EA" to create a new product
   - Or click the Edit button on an existing product

3. **Upload EA File**
   - In the form, find the **"EA File (.ex4/.ex5)"** section
   - Click the upload area (red border indicates security requirement)
   - Select a `.ex4` (MT4) or `.ex5` (MT5) file
   - The system will **automatically reject** any source code files

4. **Fill Product Details**
   - Product Code (e.g., `EA-BOS`)
   - Name (e.g., `EA-BOS Trading System`)
   - Version (e.g., `1.0.0`)
   - Price, description, etc.

5. **Save**
   - Click "Save" or "Create"
   - The EA file will be uploaded to the `ea-files` storage bucket
   - The `file_key` will be automatically saved to the product record

### Method 2: Via Supabase Storage (Manual)

1. **Go to Supabase Dashboard**
   - Navigate to: Storage → `ea-files` bucket

2. **Upload File**
   - Click "Upload file"
   - Select your `.ex4` file
   - Note the exact filename (e.g., `EA-BOS-v1.0.0-1234567890.ex4`)

3. **Link File to Product**
   - Go to Supabase SQL Editor
   - Run this SQL:
   ```sql
   UPDATE public.products 
   SET file_key = 'EA-BOS-v1.0.0-1234567890.ex4' 
   WHERE product_code = 'EA-BOS';
   ```

## File Naming Convention

When uploading via the admin dashboard, files are automatically named:
```
{product_code}-v{version}-{timestamp}.ex4
```

Example:
- Product Code: `EA-BOS`
- Version: `1.0.0`
- Result: `EA-BOS-v1.0.0-1704067200000.ex4`

## Security Features

### Frontend Validation
- File type validation: Only `.ex4` extension allowed
- Explicit blocking of source code extensions
- File size limit: 10MB maximum
- Visual warnings about security requirements

### Backend Security
- Storage bucket is **private** (not publicly accessible)
- Only admins can upload files
- Only users with **active licenses** can download
- RLS policies enforce license verification
- Signed URLs expire after 1 hour

### Database Security
- `file_key` column stores only the filename
- No source code is ever stored in the database
- Product records link to compiled files only

## Verification Checklist

Before making an EA available for download:

- [ ] File is `.ex4` format (compiled EA)
- [ ] File is uploaded to `ea-files` bucket
- [ ] `file_key` is set in products table
- [ ] Product is marked as `is_active = true`
- [ ] Version number is correct
- [ ] Test download as a user with active license

## Troubleshooting

### "Only .ex4 files are allowed"
- You're trying to upload a source code file
- Convert your `.mq5` or `.mq4` to `.ex4` using MetaEditor
- **DO NOT** upload source code files

### "EA file not available for download"
- Check that `file_key` is set in products table
- Verify file exists in `ea-files` bucket
- Ensure `file_key` matches exact filename in storage

### "Failed to upload EA file"
- Check file size (must be < 10MB)
- Verify you're logged in as admin
- Check Supabase Storage bucket permissions
- Ensure `ea-files` bucket exists

## Best Practices

1. **Always compile** your EA to `.ex4` before uploading
2. **Never upload** source code files (`.mq5`, `.mq4`, etc.)
3. **Version your files** - include version in filename
4. **Test downloads** after uploading
5. **Keep source code** secure on your local machine only
6. **Use unique filenames** to avoid conflicts

## Admin Access

Only users with `is_admin()` = true can:
- Upload EA files
- Update EA files
- Delete EA files
- View all files in `ea-files` bucket

Regular users can ONLY:
- Download EA files they have purchased (active license required)
- Access files via signed URLs (expire after 1 hour)
