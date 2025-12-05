# Paystack Account Verification Guide

## Going from Test Mode to Live Mode

To accept real payments, you need to verify your Paystack account. Here's what you need:

## Required Documents & Information

### 1. Business Information

**For Registered Business:**
- ✅ Business Registration Certificate (CAC Certificate for Nigeria)
- ✅ Business Bank Account Statement (last 3 months)
- ✅ Tax Identification Number (TIN)
- ✅ Business Address Proof

**For Individual/Sole Proprietor:**
- ✅ Valid Government ID (National ID, Driver's License, or International Passport)
- ✅ Bank Account Statement (last 3 months)
- ✅ Proof of Address (Utility bill, Bank statement)

### 2. Bank Account Details

- ✅ Bank Name
- ✅ Account Number
- ✅ Account Name (must match business/individual name)
- ✅ Bank Verification Number (BVN) - for Nigeria

### 3. Business Details

- ✅ Business Name (as registered)
- ✅ Business Type (Sole Proprietor, Partnership, Limited Company, etc.)
- ✅ Business Address
- ✅ Phone Number
- ✅ Email Address
- ✅ Website URL (if available)

### 4. Additional Documents (May be Required)

- ✅ Memorandum & Articles of Association (for companies)
- ✅ Board Resolution (for companies)
- ✅ Director's ID (for companies)

## Step-by-Step Verification Process

### Step 1: Complete Your Profile

1. Log in to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings** → **Business Profile**
3. Fill in all required information:
   - Business name
   - Business type
   - Business address
   - Phone number
   - Email

### Step 2: Add Bank Account

1. Go to **Settings** → **Bank Accounts**
2. Add your settlement bank account
3. Upload bank statement (PDF or image)
4. Ensure account name matches your business name

### Step 3: Upload Documents

1. Go to **Settings** → **Verification**
2. Upload required documents:
   - Business registration certificate
   - Government ID
   - Proof of address
   - Bank statement

### Step 4: Submit for Review

1. Review all information
2. Submit for verification
3. Wait for approval (usually 1-3 business days)

## Verification Status

You can check your verification status:
- **Settings** → **Verification** → **Status**

Statuses:
- ⏳ **Pending** - Under review
- ✅ **Approved** - Ready for live mode
- ❌ **Rejected** - Check reasons and resubmit

## Switching to Live Mode

Once verified:

1. Go to **Settings** → **API Keys & Webhooks**
2. Switch from **Test Mode** to **Live Mode**
3. Copy your **Live Public Key** (starts with `pk_live_`)
4. Copy your **Live Secret Key** (starts with `sk_live_`)
5. Update your `.env.local`:

```env
# Production Paystack Keys
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
VITE_PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
VITE_PAYSTACK_WEBHOOK_SECRET=your_live_webhook_secret
```

## Country-Specific Requirements

### Nigeria
- CAC Certificate (for businesses)
- BVN (Bank Verification Number)
- TIN (Tax Identification Number)
- NIN (National Identification Number) - for individuals

### Ghana
- Business Registration Certificate
- Tax Identification Number
- Proof of Address

### South Africa
- Company Registration Documents
- Tax Clearance Certificate
- Proof of Address

### Kenya
- Business Registration Certificate
- KRA PIN (Tax Identification)
- Proof of Address

## Important Notes

⚠️ **Before Going Live:**
- Ensure all test payments work correctly
- Set up webhook endpoints
- Test payment flow thoroughly
- Have customer support ready

⚠️ **Security:**
- Never share your secret keys
- Don't commit keys to git
- Use environment variables
- Rotate keys if compromised

⚠️ **Compliance:**
- Ensure your business is legally registered
- Have proper terms of service
- Have privacy policy
- Comply with local regulations

## Support

If you need help with verification:
- **Email:** support@paystack.com
- **Phone:** Check Paystack website for your country
- **Help Center:** https://support.paystack.com

## Quick Checklist

- [ ] Business/Individual information complete
- [ ] Bank account added and verified
- [ ] Required documents uploaded
- [ ] Verification submitted
- [ ] Verification approved
- [ ] Live API keys obtained
- [ ] Webhook endpoint configured
- [ ] Environment variables updated
- [ ] Tested with small real payment

## Current Status

You're currently in **Test Mode** which is perfect for:
- ✅ Testing payment flows
- ✅ Developing features
- ✅ Training team
- ✅ Demo purposes

**Test Mode Limitations:**
- ❌ No real money transactions
- ❌ Test cards only
- ❌ Not for production use

Once verified and switched to Live Mode, you can accept real payments!

