# 📘 How the Accounts & Licensing System Works

## 🔗 How Trading Accounts Connect to EA Licenses

### **System Overview:**
1. **User purchases an EA** → A license is created in Supabase
2. **User goes to Accounts page** → Sees their licenses
3. **User connects MT5 accounts** → Links them to specific EA licenses
4. **EA runs on those accounts** → Using the license for validation

---

## 🎯 Step-by-Step: Connecting Accounts

### **Method 1: From the Licenses Tab (Recommended)**

1. **View EA License Details:**
   - Go to the **Licenses** tab
   - Click the **"View"** button on any EA license
   - A dialog opens showing license details

2. **Add Account:**
   - In the dialog, scroll to **"Connected Accounts"**
   - Click **"Add Account"** button
   - Fill in:
     - **Account Name** (e.g., "My Main Account")
     - **MT5 Account Number** (e.g., "123456789")
     - **Broker** (e.g., "IC Markets")
   - Click **"Connect"**

3. **Account Linked:**
   - The account is saved to Supabase with a `license_id` field
   - This links the account to that specific EA license
   - The account count badge on the license updates

### **Method 2: From the Accounts Tab**

1. Go to **"Trading Accounts"** tab
2. But wait... accounts must be linked to a license!
   - So you still need to go through Method 1 first
   - The Accounts tab just shows all your connected accounts

---

## 👁️ How to See Which License an Account Belongs To

### **Visual Indicators:**

1. **In the Accounts Tab:**
   - Each trading account card now shows a **blue highlighted section** at the top
   - It displays: **"Connected to EA: [EA Name]"**
   - Example: "Connected to EA: Scalper Pro EA"

2. **In the License Details Dialog:**
   - Click "View" on any license
   - See all connected accounts listed below
   - Each shows account name, broker, and status

3. **On the License Card:**
   - Each license shows: `[X]/[Max] accounts`
   - Example: "2/3 accounts" means 2 accounts connected out of 3 max

---

## 🗄️ Database Structure

### **Tables:**

#### **`licenses` table:**
```sql
- id (unique license ID)
- user_id (owner)
- ea_product_name (which EA)
- license_key (unique key)
- max_concurrent_sessions (how many accounts allowed)
- status (active/expired)
```

#### **`trading_accounts` table:**
```sql
- id (unique account ID)
- user_id (owner)
- license_id ← THIS LINKS TO LICENSE
- account_name
- mt5_account_number
- broker
- status
- balance
- equity
```

**The `license_id` field in `trading_accounts` is the connection!**

---

## 🔄 How the Dummy Data Works

Currently showing:
- **3 Licenses:** Scalper Pro, Grid Trader, Trend Rider
- **3 Accounts:** Linked by `license_id`
  - "Main Trading" → license '1' (Scalper Pro)
  - "Demo Account" → license '1' (Scalper Pro)  
  - "Scalping Account" → license '2' (Grid Trader)

---

## 🚀 Real-World Flow

### **Example Scenario:**

1. **Customer buys "Scalper Pro EA"**
   - Creates license #123 in Supabase
   - License key generated: `ALG-2024-SCALPER-ABC123`
   - Max sessions: 3

2. **Customer connects their IC Markets account**
   - Opens license #123 details
   - Clicks "Add Account"
   - Enters MT5: 987654321, Broker: IC Markets
   - Saved with `license_id: 123` → **LINKED!**

3. **Customer connects another account**
   - Same license #123
   - Adds Pepperstone account 555444333
   - Also saved with `license_id: 123` → **LINKED!**

4. **License shows**: "2/3 accounts" 

5. **Accounts page shows**:
   - IC Markets account → "Connected to EA: Scalper Pro EA"
   - Pepperstone account → "Connected to EA: Scalper Pro EA"

---

## ✅ Visual Improvements Made

1. **Added "Connected to EA" badge** on each account card
2. **Blue highlight** to make it stand out
3. **EA icon** (TrendingUp) for visual clarity
4. **Shows balance** instead of last sync for better context

---

## 🎓 Key Takeaways

- **One account = One license** (account can only belong to one EA)
- **One license = Multiple accounts** (up to max_concurrent_sessions)
- **license_id is the link** between accounts and licenses
- **Always add accounts from License details** dialog
- **Accounts tab shows all your connected accounts** with their EA names

---

The system is now much clearer! You can always see which EA each account is connected to at a glance.





















