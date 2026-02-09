# License File Upload Guide

## Understanding License Files (.mqh)

### What is a .mqh file?
- `.mqh` files are **header files** used in MQL5/MQL4 development
- They contain code that gets **included** into the EA source code during compilation
- When an EA is compiled to `.ex4`, the license code is typically **already included** in the compiled file

### Do You Need to Upload Both Files?

**Most of the time: NO** ✅

If your EA is already compiled to `.ex4`, the license code from `IG_license.mqh` should already be compiled into it. You only need to upload:
- ✅ **The .ex4 file** (compiled EA)

**Only upload the .mqh file if:**
- Your EA uses **runtime license validation** (checks license at runtime, not compile time)
- You're providing the license file separately for users to include
- Your EA system requires the license file to be downloaded separately

## How to Upload Files

### Step 1: Upload EA File (.ex4)
1. Go to Admin Dashboard → EA Management
2. Create or edit a product
3. Click **"Upload EA File (.ex4 ONLY)"**
4. **Select a single .ex4 file** (not a folder)
5. The file will be uploaded automatically when you save

### Step 2: Upload License File (.mqh) - Optional
1. In the same form, scroll to **"License File (.mqh) - Optional"** section
2. Click **"Upload License File (.mqh) - Optional"**
3. Select your `IG_license.mqh` file
4. Save the product

## Fixing Folder Upload Issue

If the file picker is only allowing folders:

### Solution 1: Use "Choose File" Button
- Click the **"Upload EA File"** button
- In the file picker dialog, make sure you're selecting **"Files"** not **"Folders"**
- Look for a dropdown or toggle that says "Files" vs "Folders"

### Solution 2: Browser Settings
Some browsers default to folder selection. Try:
1. **Chrome/Edge**: Click "Choose File" and ensure "Files" is selected (not "Folders")
2. **Firefox**: Right-click the button → "Inspect" → Check if `webkitdirectory` attribute exists
3. **Safari**: Use "Choose File" option explicitly

### Solution 3: Manual Upload via Supabase
If the web interface still doesn't work:
1. Go to Supabase Dashboard → Storage → `ea-files` bucket
2. Upload your `.ex4` file directly
3. Note the filename
4. Update the product in the database:
   ```sql
   UPDATE public.products 
   SET file_key = 'your-file-name.ex4' 
   WHERE product_code = 'YOUR_PRODUCT_CODE';
   ```

## File Structure Recommendations

### Recommended Structure:
```
ea-files/
├── EA-BOS-v1.0.0-1234567890.ex4    (Main EA file)
└── licenses/
    └── EA-BOS-license-1234567890.mqh  (Optional license file)
```

### For Users:
When users download:
- They get the `.ex4` file (ready to use)
- If license file is needed, they can download it separately
- Most users only need the `.ex4` file

## Security Notes

⚠️ **Important**: 
- `.mqh` files contain source code (license validation code)
- Only upload `.mqh` files if absolutely necessary
- Most compiled `.ex4` files already include license validation
- Users should NOT need access to license source code

## Troubleshooting

### "I can only select folders"
- The file input has been fixed to prevent folder selection
- Make sure you're clicking "Choose File" not "Choose Folder"
- Try a different browser

### "License file not uploading"
- Check file size (must be < 1MB)
- Verify file extension is `.mqh`
- Check browser console for errors

### "Do I need both files?"
- **Check your EA**: Does it require a separate license file at runtime?
- **Most EAs**: Only need the `.ex4` file
- **Some EAs**: May need `.mqh` for custom license validation

## Best Practice

**Recommended approach:**
1. Compile your EA with the license code included
2. Upload only the `.ex4` file
3. Users download and use the `.ex4` file directly
4. No separate license file needed

This is simpler, more secure, and easier for users.
