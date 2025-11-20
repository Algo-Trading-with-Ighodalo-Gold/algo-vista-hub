# Database Setup & Server-Side Licensing Guide

## 📊 What's Been Set Up

### Database Tables

1. **Licenses Table** - Stores all EA licenses
   - License keys
   - Status (active, expired, suspended, revoked)
   - License type (individual_ea, basic_tier, etc.)
   - User association
   - Hardware fingerprinting for protection

2. **Trading Accounts Table** - NEW!
   - Links MT5 accounts to specific licenses
   - Tracks account name, MT5 ID, broker
   - Stores balance/equity data
   - Connected to licenses via `license_id`

3. **License Sessions** - Tracks active EA sessions
   - Hardware fingerprinting
   - MT5 account number
   - Session monitoring

## 🚀 Setting Up the Database

### Step 1: Run the Migration

Apply the new `trading_accounts` table to your Supabase database:

```bash
# Option 1: Using Supabase CLI (if you have it)
supabase db reset

# Option 2: Manual SQL execution
# Go to your Supabase Dashboard > SQL Editor
# Copy and paste the contents of: supabase/migrations/add_trading_accounts_table.sql
# Click "Run"
```

### Step 2: Verify the Table

In Supabase Dashboard:
1. Go to **Table Editor**
2. Look for `trading_accounts` table
3. Verify it has the correct columns

## 💾 How It Works Now

### Frontend (Website)
- Users can view their licenses from the database
- Users can add trading accounts and link them to specific EAs
- All data is stored in Supabase in real-time
- Stats are calculated dynamically from the database

### Backend (EA Licensing)

#### Option 1: Server-Side Validation (Recommended)

**Create an API endpoint** that validates licenses:

```typescript
// src/lib/api/license-validation.ts

export async function validateLicense(
  licenseKey: string,
  hardwareFingerprint: string,
  mt5AccountNumber: string
) {
  const response = await fetch('/api/validate-license', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey,
      hardwareFingerprint,
      mt5AccountNumber
    })
  })
  
  return response.json()
}
```

**Server-side validation** (Node.js/Express example):

```javascript
// Server endpoint example
app.post('/api/validate-license', async (req, res) => {
  const { licenseKey, hardwareFingerprint, mt5AccountNumber } = req.body
  
  // Check license in Supabase
  const { data } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .eq('status', 'active')
    .single()
  
  if (!data) {
    return res.status(401).json({ valid: false, reason: 'Invalid license' })
  }
  
  // Check if account is linked
  const { data: account } = await supabase
    .from('trading_accounts')
    .select('*')
    .eq('mt5_account_number', mt5AccountNumber)
    .eq('license_id', data.id)
    .single()
  
  if (!account) {
    return res.status(403).json({ valid: false, reason: 'Account not linked' })
  }
  
  // Check hardware binding (optional but recommended)
  if (data.hardware_fingerprint && data.hardware_fingerprint !== hardwareFingerprint) {
    return res.status(403).json({ valid: false, reason: 'Hardware mismatch' })
  }
  
  // Update session
  await supabase
    .from('license_sessions')
    .insert({
      license_id: data.id,
      hardware_fingerprint: hardwareFingerprint,
      mt5_account_number: mt5AccountNumber
    })
  
  res.json({ valid: true, expiresAt: data.expires_at })
})
```

#### Option 2: Direct EA Integration

Your EA can call Supabase directly using the license key:

```mql5
// MQL5 Example - License Validation
bool ValidateLicense(string licenseKey) {
   string url = "https://your-project.supabase.co/rest/v1/licenses";
   string headers = "apikey: YOUR_SUPABASE_KEY\n" +
                    "Authorization: Bearer YOUR_SUPABASE_KEY\n" +
                    "Content-Type: application/json\n" +
                    "Prefer: return=representation";
   
   string data = "license_key=eq." + licenseKey;
   
   // Make HTTP request to Supabase
   int result = WebRequest("GET", url + "?" + data, headers, 5000, NULL);
   
   // Parse response and check if license is valid
   return (result == 200); // Simplified
}
```

### Recommended Approach

**Hybrid Approach** (Most Secure):

1. **Frontend** (Your website):
   - User purchases EA
   - License is created in database
   - User adds trading accounts
   - Accounts are linked to the license

2. **EA** (MQL5/MT5):
   - EA reads license key from file/input
   - EA generates hardware fingerprint (CPU ID, MAC address, etc.)
   - EA calls your API endpoint for validation
   - API checks Supabase database
   - Returns validation result to EA

3. **Server** (API):
   - Validates license key exists
   - Checks license status (active, expired, etc.)
   - Verifies MT5 account is linked
   - Checks hardware binding
   - Updates validation logs
   - Returns success/failure

## 🔐 Security Features

### Hardware Binding
- Each license can be bound to a specific machine
- Prevents license sharing
- Stored in `hardware_fingerprint` field

### Account Limiting
- Each license has `max_concurrent_sessions`
- Can limit how many MT5 accounts can use one license
- Enforced in the database

### Session Tracking
- All active sessions tracked in `license_sessions`
- Automatic timeout (24 hours default)
- Heartbeat mechanism for active monitoring

### Validation Logs
- Every validation attempt is logged
- Security monitoring
- Detect suspicious activity

## 📱 Current Features

✅ View licenses from database
✅ Add/remove trading accounts  
✅ Link accounts to specific EAs
✅ Real-time stats calculation
✅ Remove total balance section
✅ All data synced to Supabase

## 🎯 Next Steps

1. **Run the migration** to create `trading_accounts` table
2. **Set up your API endpoint** for EA validation
3. **Implement server-side validation** logic
4. **Test the license flow** end-to-end

## 📝 Testing

To test locally:
1. Go to Dashboard > Accounts
2. Click "Add Account" for any EA
3. Fill in the form
4. The account will be saved to Supabase
5. Refresh - the account should persist

## 🆘 Need Help?

- Supabase Dashboard: https://app.supabase.com
- Documentation: See `BACKEND_SETUP.md`
- API Guide: See `STRIPE_SETUP.md`





















