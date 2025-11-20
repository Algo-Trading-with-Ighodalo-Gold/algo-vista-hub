# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/fcb50a22-f7e3-423e-9b34-ce2bb16f2ca8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fcb50a22-f7e3-423e-9b34-ce2bb16f2ca8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fcb50a22-f7e3-423e-9b34-ce2bb16f2ca8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## 📋 Accounts & Licensing System

### Overview

The Accounts page (`/dashboard/accounts`) provides a comprehensive interface for managing EA licenses and connected MT5 trading accounts. The system integrates with Supabase backend and Cloudflare Worker for license verification.

### Environment Variables

Add the following to your `.env` file:

```bash
# Cloudflare Worker License Verification
VITE_VERIFY_URL=https://your-worker.your-subdomain.workers.dev/verify
```

### Database Setup

#### Running Migrations

1. **Using Supabase CLI** (recommended):
   ```bash
   supabase db reset
   # or apply specific migration
   supabase migration up
   ```

2. **Manual SQL execution**:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase/migrations/20250115000000_add_license_accounts_and_rpcs.sql`
   - Click "Run"

#### Required Tables

The migration creates/updates:
- `license_accounts` - Links MT5 accounts to licenses
- `license_logs` - Audit trail for license actions
- Updates `licenses` table with `plan_id`, `is_active`, `licensed_to` columns

#### RPC Functions

- `link_account_to_license(p_license_id UUID, p_account BIGINT)` - Links an account with limit enforcement
- `unlink_account_from_license(p_license_id UUID, p_account BIGINT)` - Unlinks an account

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your Supabase and Cloudflare Worker URLs
   ```

3. **Run migrations** (see Database Setup above)

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the Accounts page**:
   - Navigate to `/dashboard/accounts` after logging in

### Testing with Sample Data

#### Seed a Test License

Run this SQL in Supabase SQL Editor (replace `YOUR_USER_ID` with your actual user ID):

```sql
-- Insert a test product
INSERT INTO public.ea_products (name, product_code, is_active, max_mt5_accounts)
VALUES ('Test EA', 'TEST-EA-001', true, 3)
ON CONFLICT DO NOTHING;

-- Get the product ID
WITH product AS (
  SELECT id FROM public.ea_products WHERE product_code = 'TEST-EA-001' LIMIT 1
)
-- Insert a test license
INSERT INTO public.licenses (
  user_id,
  license_key,
  license_type,
  status,
  is_active,
  ea_product_id,
  max_concurrent_sessions,
  expires_at
)
SELECT 
  'YOUR_USER_ID'::UUID,
  'TEST-LICENSE-' || gen_random_uuid()::TEXT,
  'individual_ea',
  'active',
  true,
  product.id,
  3,
  NOW() + INTERVAL '1 year'
FROM product;
```

#### Verify Cloudflare Worker Response

The Cloudflare Worker `/verify` endpoint should return:

```json
{
  "ok": true,
  "product_id": "uuid",
  "licensed_to": "user@example.com",
  "expires_at": "2025-12-31 23:59:59",
  "allowed_accounts": ["123456789", "987654321"],
  "timestamp": "2025-01-15T12:00:00Z",
  "nonce": "random-nonce",
  "signature": "hmac-signature"
}
```

**HMAC Payload Format**: `"product_id|account|expires_at|timestamp|nonce|1"`

**Note**: HMAC secret (`LICENSE_HMAC_SECRET`) is stored server-side only, never exposed to the frontend.

### Features

- ✅ **License Management**: View all licenses grouped by EA product
- ✅ **Account Linking**: Connect MT5 accounts to specific licenses
- ✅ **Limit Enforcement**: Automatic enforcement of plan limits via RPC functions
- ✅ **Status Tracking**: Real-time license and account status
- ✅ **Search & Filter**: Search by EA name, account ID, or broker
- ✅ **Responsive UI**: Clean, modern interface with Tailwind/shadcn components
- ✅ **Error Handling**: Friendly error messages and validation
- ✅ **Audit Trail**: All actions logged in `license_logs` table

### Code Organization

```
src/
├── components/
│   └── accounts/
│       ├── license-card.tsx          # Individual license card component
│       └── connect-account-dialog.tsx # Dialog for adding accounts
├── hooks/
│   └── use-accounts-data.ts          # Data fetching hook
├── lib/
│   └── accounts-utils.ts            # Utility functions
└── pages/
    └── dashboard/
        └── accounts.tsx              # Main accounts page
```

### Utility Functions

Located in `src/lib/accounts-utils.ts`:

- `isLicenseActive(license)` - Checks if license is active and not expired
- `effectiveLimit(license, tierMap)` - Calculates account limit (0 = unlimited)
- `connectedCount(licenseId, accountsMap)` - Gets connected account count
- `canConnectAccount(license, connectedCount, tierMap)` - Validates if account can be added
- `formatPlanName(tier)` - Formats tier name for display

### RLS Policies

Row Level Security (RLS) is enabled on all tables:

- **licenses**: Users can only see their own licenses
- **license_accounts**: Users can only manage accounts for their licenses
- **license_logs**: Users can only view logs for their licenses

RPC functions use `SECURITY DEFINER` with ownership checks inside the functions.

### Troubleshooting

**Issue**: "License not found or access denied"
- **Solution**: Ensure the user owns the license and RLS policies are correctly set

**Issue**: "Account limit reached"
- **Solution**: Check plan limits in `subscription_tiers` table or license `max_concurrent_sessions`

**Issue**: "This account is already linked to another license"
- **Solution**: Each MT5 account can only be linked to one license at a time

**Issue**: Migration fails
- **Solution**: Ensure you have proper permissions and that required tables (`licenses`, `subscription_tiers`) exist

### Files Modified/Created

- ✅ `supabase/migrations/20250115000000_add_license_accounts_and_rpcs.sql` - Database migration
- ✅ `src/pages/dashboard/accounts.tsx` - Main accounts page (rewritten)
- ✅ `src/hooks/use-accounts-data.ts` - Data fetching hook
- ✅ `src/lib/accounts-utils.ts` - Utility functions
- ✅ `src/components/accounts/license-card.tsx` - License card component
- ✅ `src/components/accounts/connect-account-dialog.tsx` - Connect dialog
- ✅ `env.example` - Added `VITE_VERIFY_URL`
- ✅ `README.md` - This documentation section