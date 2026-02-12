# Affiliate Commission System

## Overview
The affiliate system now works on a **purchase-based commission model**. Affiliates earn commissions when users they refer make purchases, not just when they sign up.

## How It Works

### 1. User Referral Flow
1. **Affiliate shares link**: `yoursite.com?ref=REFERRAL_CODE`
2. **User clicks link**: System tracks the click in `referral_clicks` table
3. **User signs up**: Profile is linked to affiliate via `referred_by` field
4. **User purchases product**: Commission is automatically awarded

### 2. Commission Awarding
When a referred user completes a purchase:
- System checks if user has `referred_by` set in their profile
- Finds the affiliate record
- Calculates commission rate based on affiliate tier (see below)
- Creates commission record in `referral_commissions` table
- Updates affiliate's `commission_earned` total

### 3. Commission Tiers
Commissions are calculated based on sales in the last 30 days:

| Sales (Last 30 Days) | Commission Rate |
|----------------------|-----------------|
| 1-10 sales           | 20%             |
| 11-25 sales          | 25%             |
| 26-50 sales          | 30%             |
| 50+ sales            | 35%             |

### 4. Commission Status
- **pending**: Commission is pending approval
- **approved**: Commission is approved and ready for payout
- **paid**: Commission has been paid out
- **cancelled**: Commission was cancelled

## Database Tables

### `referral_commissions`
Tracks all commissions from purchases:
- `affiliate_id`: Link to affiliate record
- `referrer_user_id`: The affiliate's user ID
- `referred_user_id`: The buyer's user ID
- `transaction_id`: Payment provider reference
- `product_id`: Product purchased
- `product_name`: Product name
- `purchase_amount`: Amount paid (in base currency)
- `commission_rate`: Commission percentage
- `commission_amount`: Calculated commission
- `status`: pending/approved/paid/cancelled

### `affiliates`
Updated automatically with total earnings:
- `commission_earned`: Sum of all commissions

## Functions

### `award_referral_commission()`
Called automatically when a purchase is completed:
- Checks if buyer was referred
- Calculates commission based on tier
- Creates commission record
- Updates affiliate totals

### `calculate_commission_rate()`
Determines commission rate based on sales volume:
- Counts sales in last 30 days
- Returns appropriate rate (20-35%)

### `get_affiliate_stats()`
Returns comprehensive affiliate statistics:
- Total commissions
- Pending commissions
- Paid commissions
- Total sales count
- Recent sales count

## Affiliate Portal Features

The affiliate dashboard now shows:

1. **Stats Overview**:
   - Total Clicks
   - Referred Users
   - Total Sales (purchases made)
   - Total Earnings (sum of commissions)

2. **Recent Purchases & Commissions**:
   - List of all purchases made by referred users
   - Shows product name, purchase amount, commission rate, commission amount
   - Status badges (pending/approved/paid)

3. **Referred Users**:
   - List of all users who signed up via your link
   - "Purchased" badge for users who made purchases

## Setup Instructions

1. **Run the migration**:
   ```sql
   -- Run the migration file:
   supabase/migrations/20250203000000_add_referral_commissions.sql
   ```

2. **Verify functions exist**:
   - `award_referral_commission()`
   - `calculate_commission_rate()`
   - `get_affiliate_stats()`

3. **Test the flow**:
   - Create an affiliate account
   - Share your referral link
   - Have someone sign up and purchase
   - Check your affiliate portal for the commission

## Commission Calculation Example

If a referred user purchases a product for ₦50,000:
- Affiliate has 15 sales in last 30 days → 25% commission rate
- Commission = ₦50,000 × 25% = ₦12,500
- Commission is automatically approved and added to affiliate's total

## Admin Features

Admins can:
- View all commissions in admin panel
- Approve/pay commissions
- Adjust commission rates if needed
- View affiliate performance metrics

## Notes

- Commissions are automatically approved when purchases are made
- Commission rates are dynamic based on recent sales volume
- All commissions are tracked in the `referral_commissions` table
- The system supports multiple purchases from the same referred user
- Commission amounts are in the same currency as purchases (Naira)
