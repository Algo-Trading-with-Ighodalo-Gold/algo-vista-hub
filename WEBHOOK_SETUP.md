# Webhook Setup Guide

## What are Webhooks?

Webhooks are HTTP callbacks that Polar sends to your server when payment events happen:
- Checkout completed
- Checkout failed
- Subscription created/updated/canceled
- Refund and dispute lifecycle events

## For Development (No Domain Yet)

### Option 1: Use ngrok (Recommended for Testing)

1. **Install ngrok**
   ```bash
   # Download from https://ngrok.com/download
   # Or use npm: npm install -g ngrok
   ```

2. **Start your local server**
   ```bash
   npm run dev
   # Your app runs on http://localhost:5173
   ```

3. **Expose it with ngrok**
   ```bash
   ngrok http 5173
   # This gives you a public URL like: https://abc123.ngrok.io
   ```

4. **Add webhook in Polar**
   - Go to Polar Dashboard → Webhooks
   - Add webhook URL: `https://abc123.ngrok.io/api/payments/polar/webhook`
   - Copy the webhook secret

5. **Update .env.local**
   ```env
   VITE_POLAR_WEBHOOK_SECRET=whsec_xxxxx
   ```

**Note:** ngrok free tier gives you a new URL each time. For development, this is fine.

### Option 2: Use LocalTunnel (Free Alternative)

```bash
# Install
npm install -g localtunnel

# Expose your local server
lt --port 5173

# Use the provided URL in Polar webhook settings
```

### Option 3: Skip Webhooks for Now (Manual Verification)

You can test payments without webhooks, but you'll need to:
- Manually verify payments in Polar dashboard
- Manually create licenses in your database
- Not ideal for production, but works for initial testing

## For Production (When You Have a Domain)

1. **Deploy your backend/API**
   - Deploy to Vercel, Netlify, Railway, or your own server
   - Your webhook endpoint should be: `https://yourdomain.com/api/payments/polar/webhook`

2. **Set up webhook in Polar**
   - Go to Polar Dashboard → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/polar/webhook`
   - Select events:
     - `checkout.completed`
     - `checkout.failed`
     - `subscription.created`
     - `subscription.updated`
     - `subscription.canceled`
   - Copy the webhook secret

3. **Update production environment**
   ```env
   VITE_POLAR_WEBHOOK_SECRET=whsec_your_production_secret
   ```

## Webhook Endpoint Implementation

You'll need to create this endpoint in your backend:

```typescript
// Example: /api/payments/polar/webhook
POST /api/payments/polar/webhook

// Verify webhook signature
// Process the event:
// - checkout.completed → Create license / grant product
// - subscription.created → Link subscription to user
// - subscription.canceled → Deactivate or mark expiring
```

## Current Status

✅ **You can test payments NOW without webhooks:**
- Users can make payments
- They'll be redirected to Polar checkout
- Payment will complete
- You'll need to manually verify in Polar dashboard

⚠️ **Webhooks needed for:**
- Automatic license creation after payment
- Automatic subscription management
- Real-time payment status updates

## Recommendation

1. **For now:** Test payments manually, skip webhooks
2. **When ready:** Use ngrok for local webhook testing
3. **For production:** Set up webhooks when you deploy

The payment flow will work without webhooks - you'll just need to manually verify payments until webhooks are set up.

