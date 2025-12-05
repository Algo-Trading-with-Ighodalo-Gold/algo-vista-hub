# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for managing EA products, users, and platform data.

## Setting Up Admin Users

### Step 1: Run the Migration

First, apply the admin roles migration to your Supabase database:

```bash
# If using Supabase CLI
supabase db push

# Or apply the migration manually in Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/20250201120000_add_admin_roles.sql
```

### Step 2: Assign Admin Role to a User

You can assign admin or worker role to a user in two ways:

#### Option A: Using Supabase Dashboard (SQL Editor)

```sql
-- Replace 'user-email@example.com' with the actual user email
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user-email@example.com'
);
```

#### Option B: Using Supabase Dashboard (Table Editor)

1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Find the user you want to make admin
3. Edit the `role` field and set it to either:
   - `admin` - Full admin access
   - `worker` - Worker/admin access (same permissions as admin)
   - `user` - Regular user (default)

## Admin Dashboard Features

### 1. Admin Dashboard (`/admin/dashboard`)
- Overview statistics:
  - Total users
  - Active licenses
  - EA products count
  - Connected accounts
  - Affiliates and commissions
- Recent user registrations

### 2. EA Management (`/admin/ea-management`)
- **Create New EA Products**: Add new Expert Advisors to the platform
- **Edit EA Products**: Update existing EA information
- **Delete EA Products**: Remove EAs from the platform
- **Fields Available**:
  - Product Code (unique identifier)
  - Name
  - Description
  - Short Description
  - Price (in cents)
  - Version
  - Status (Active/Inactive)
  - Max Concurrent Sessions
  - Max MT5 Accounts
  - Hardware Binding Requirement
  - Trading Pairs
  - Timeframes
  - Strategy Type
  - Min Deposit
  - Average Monthly Return
  - Max Drawdown
  - Key Features (array)
  - Image Key
  - Risk Level
  - Rating
  - Reviews Count

### 3. Users Management (`/admin/users`)
- View all registered users
- Search users by email or name
- See user roles (admin/worker/user)
- View registration dates

### 4. Accounts & Affiliates (`/admin/accounts-affiliates`)
- **Connected Accounts Tab**:
  - View all MT5 accounts linked to licenses
  - See account status (active/offline/suspended)
  - View account balances
  - See associated licenses
  
- **Affiliates Tab**:
  - View all affiliate accounts
  - See commission earnings
  - View payout status
  - See referral codes

## Accessing Admin Dashboard

1. Log in with an account that has `admin` or `worker` role
2. Navigate to `/admin` or click "Admin Dashboard" in the sidebar
3. The admin section will only appear in the sidebar for admin/worker users

## Security Notes

- Admin routes are protected by `AdminRoute` component
- Only users with `admin` or `worker` role can access admin pages
- RLS (Row Level Security) policies allow admins to view all data
- Regular users cannot access admin routes even if they try to navigate directly

## Creating EA Products

When creating a new EA product:

1. Go to `/admin/ea-management`
2. Click "Add New EA"
3. Fill in the required fields:
   - **Product Code**: Must be unique (e.g., `GOLD_MILKER`)
   - **Name**: Display name (e.g., "Gold Milker EA")
4. Fill in optional fields for better product display
5. Click "Create"
6. The EA will immediately appear on the products page (`/products`)

## Updating Existing EAs

1. Go to `/admin/ea-management`
2. Find the EA you want to update
3. Click the Edit button (pencil icon)
4. Modify the fields
5. Click "Update"

## Best Practices

1. **Product Codes**: Use uppercase with underscores (e.g., `GOLD_MILKER`, `BELEMA_SFP`)
2. **Pricing**: Enter price in cents (e.g., 30000 = $300.00)
3. **Key Features**: Use an array format for features
4. **Image Keys**: Match the image keys used in your image mapping
5. **Status**: Set to "Active" for products to appear on the public products page

## Troubleshooting

### Admin section not showing in sidebar
- Check that your user has `admin` or `worker` role in the `profiles` table
- Refresh the page after role assignment
- Check browser console for errors

### Cannot access admin routes
- Verify your role is set correctly in Supabase
- Check that the migration has been applied
- Ensure you're logged in

### EA products not appearing on products page
- Check that `is_active` is set to `true`
- Verify the product was created successfully
- Check browser console for errors




