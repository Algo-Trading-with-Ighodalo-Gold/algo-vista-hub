# Products Table Integration Guide

## Overview
The EA Management page has been updated to use the `products` table instead of `ea_products`. This table is already linked to Cloudflare, making it the single source of truth for EA products.

## Migration Steps

### 1. Run SQL Migration
Copy and paste the SQL from `supabase/migrations/20250202000000_link_products_to_licensing.sql` into your Supabase SQL Editor and run it.

This migration will:
- Add all necessary columns to the `products` table for licensing
- Set up RLS policies
- Create indexes for performance
- Add triggers for automatic timestamp updates

### 2. Update Existing Products
If you have existing products in the `products` table (like "EA-BOS" and "SWING_MASTER"), they will automatically get:
- `product_code` set to match their `id`
- Default values for licensing fields (max_concurrent_sessions: 1, etc.)

### 3. Verify Integration
After running the migration:
1. Go to Admin → EA Management
2. You should see products from the `products` table
3. You can create, edit, and delete products
4. Licenses will be linked to products via `product_code` or `id`

## Key Changes

### Database Schema
- **products table** now includes:
  - `product_code` (unique, matches `id`)
  - `description`, `price_cents`, `version`
  - `max_concurrent_sessions`, `max_mt5_accounts`
  - `requires_hardware_binding`, `is_active`
  - Additional fields: `key_features`, `trading_pairs`, `timeframes`, etc.

### Code Updates
- **EA Management Page**: Now reads from/writes to `products` table
- **Create License Function**: Checks `products` table first, falls back to `ea_products` for backward compatibility
- **Validate License Function**: Supports both `products` and `ea_products` tables

## Backward Compatibility
The system maintains backward compatibility:
- Existing licenses linked to `ea_products` will continue to work
- New licenses will use the `products` table
- License validation checks both tables

## Cloudflare Integration
The `products` table is already linked to Cloudflare. Any changes made through the EA Management page will automatically sync with Cloudflare.

## Creating a New Product

1. Click "Add New EA" in EA Management
2. Fill in:
   - **Product Code**: Must be unique (e.g., "EA-BOS")
   - **Name**: Display name (e.g., "Break-of-Structure EA")
   - **Description**: Detailed description
   - **Price**: In cents (e.g., 5000 = $50.00)
   - **Version**: e.g., "1.0.0"
   - **License Settings**: Max sessions, MT5 accounts, hardware binding
3. Click "Create"

The product will be:
- Saved to the `products` table
- Available for licensing
- Synced with Cloudflare (if configured)

## Linking Licenses to Products

When creating a license:
- The system looks up the product by `product_code` or `id` in the `products` table
- The license stores `ea_product_id` = product `id`
- The license stores `ea_product_name` = product `name`

## Troubleshooting

### Products not showing?
- Check if migration ran successfully
- Verify RLS policies allow admin access
- Check browser console for errors

### Can't create/edit products?
- Ensure you're logged in as admin
- Check RLS policies: `public.is_admin()` should return true
- Verify all required columns exist (run migration)

### Licenses not linking?
- Verify `product_code` matches between products and license creation
- Check that product exists in `products` table
- Review license creation logs

## Next Steps

1. ✅ Run the migration SQL
2. ✅ Test creating a product in EA Management
3. ✅ Test creating a license for that product
4. ✅ Verify Cloudflare sync (if applicable)
5. ✅ Test license validation
