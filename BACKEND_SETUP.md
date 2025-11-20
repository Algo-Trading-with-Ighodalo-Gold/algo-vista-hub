# Algo Trading with Ighodalo - Backend Setup Guide

## 🚀 Complete Backend Infrastructure

This guide covers the complete backend setup for the Algo Trading with Ighodalo algorithmic trading platform, including Stripe and Confirmo payment integration.

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Stripe account (for payment processing)
- Confirmo account (for alternative payment processing)
- Email service (Gmail SMTP or similar)

## 🗄️ Database Schema

The Supabase database is already configured with the following tables:

### Core Tables
- `profiles` - User profiles and settings
- `ea_products` - Expert Advisor products
- `licenses` - License management
- `subscriptions` - Subscription management
- `subscription_tiers` - Available subscription plans

### Payment Tables
- `affiliates` - Affiliate program data
- `affiliate_applications` - Affiliate applications
- `referral_clicks` - Referral tracking

### Support Tables
- `support_tickets` - Customer support tickets
- `project_inquiries` - Custom EA development inquiries
- `ea_development` - EA development projects

### License Management
- `license_sessions` - Active license sessions
- `license_validations` - License validation logs

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Confirmo Configuration
VITE_CONFIRMO_API_KEY=your_confirmo_api_key_here
VITE_CONFIRMO_MERCHANT_ID=your_confirmo_merchant_id_here
VITE_CONFIRMO_BASE_URL=https://api.confirmo.net
VITE_CONFIRMO_WEBHOOK_SECRET=your_confirmo_webhook_secret_here

# Email Configuration
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_email@gmail.com
VITE_SMTP_PASSWORD=your_app_password_here
VITE_FROM_EMAIL=noreply@algotradingwithighodalo.com
VITE_FROM_NAME=Algo Trading with Ighodalo

# Security Configuration
VITE_JWT_SECRET=your_jwt_secret_here
VITE_ENCRYPTION_KEY=your_encryption_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Algo Trading with Ighodalo
VITE_APP_VERSION=1.0.0

# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
VITE_TELEGRAM_CHANNEL_ID=@AlgotradingwithIghodalo

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_PAYMENT_PROCESSING=true
```

## 💳 Payment Integration

### Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Get your publishable and secret keys from the dashboard

2. **Configure Webhooks**
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `invoice.payment_succeeded`, `customer.subscription.created`

3. **Test Mode**
   - Use test keys for development
   - Switch to live keys for production

### Confirmo Setup

1. **Create Confirmo Account**
   - Go to [confirmo.net](https://confirmo.net) and create an account
   - Get your API key and merchant ID

2. **Configure Webhooks**
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/confirmo`
   - Select events: `payment.completed`, `subscription.created`, `subscription.canceled`

## 📧 Email Service Setup

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA for your account

2. **Generate App Password**
   - Go to Google Account > Security > App passwords
   - Generate a new app password for "Mail"
   - Use this password in your environment variables

3. **Alternative Email Services**
   - SendGrid
   - Resend
   - Mailgun
   - AWS SES

## 🔐 Security Features

### Implemented Security Measures

1. **Input Validation**
   - All user inputs are sanitized
   - SQL injection prevention
   - XSS protection

2. **Rate Limiting**
   - API rate limiting (100 requests per 15 minutes)
   - Login attempt tracking
   - Account lockout after failed attempts

3. **Authentication Security**
   - Password strength requirements
   - Account lockout mechanisms
   - Session management

4. **Data Encryption**
   - Sensitive data encryption
   - Secure key management
   - HTTPS enforcement

## 🚀 API Endpoints

### User Management
- `POST /api/users/profile` - Create user profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar

### Payment Processing
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/create-subscription` - Create subscription
- `POST /api/payments/confirmo/create` - Create Confirmo payment
- `GET /api/payments/history` - Get payment history

### Product Management
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/subscription-tiers` - Get subscription tiers

### Support System
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets` - Get user tickets
- `POST /api/support/inquiries` - Create project inquiry

### License Management
- `GET /api/licenses` - Get user licenses
- `POST /api/licenses/validate` - Validate license
- `POST /api/licenses/create` - Create license

## 📱 Frontend Integration

### Using the API Services

```typescript
import { UserAPI, ProductAPI, paymentAPI } from '@/lib/api/api-service';

// Create user profile
const profile = await UserAPI.createProfile(userId, {
  firstName: 'John',
  lastName: 'Doe',
  country: 'US'
});

// Get products
const products = await ProductAPI.getProducts();

// Create payment intent
const paymentIntent = await paymentAPI.createStripePaymentIntent(
  99.99,
  'USD',
  { productId: 'ea-001' }
);
```

### Payment Integration

```typescript
import { stripeService, confirmoService } from '@/lib/payments';

// Stripe payment
const paymentIntent = await stripeService.createPaymentIntent(99.99, 'USD');
await stripeService.confirmPayment(paymentIntent.client_secret, paymentMethod);

// Confirmo payment
const payment = await confirmoService.createPayment(
  99.99,
  'USD',
  'EA Purchase',
  'user@example.com',
  'John Doe'
);
```

### Email Notifications

```typescript
import { emailService } from '@/lib/email/email-service';

// Send welcome email
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Send purchase confirmation
await emailService.sendPurchaseConfirmation(
  'user@example.com',
  'John Doe',
  'EA Quantum Edge',
  99.99,
  'USD',
  'ALG-1234567890-ABCDEF'
);
```

## 🔄 Webhook Handlers

### Stripe Webhooks

```typescript
// Handle Stripe webhook events
app.post('/api/webhooks/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;
  
  try {
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_succeeded':
        // Handle subscription payment
        break;
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

### Confirmo Webhooks

```typescript
// Handle Confirmo webhook events
app.post('/api/webhooks/confirmo', (req, res) => {
  const signature = req.headers['x-confirmo-signature'];
  const payload = JSON.stringify(req.body);
  
  if (confirmoService.verifyWebhookSignature(payload, signature)) {
    const event = req.body;
    
    switch (event.type) {
      case 'payment.completed':
        // Handle completed payment
        break;
      case 'subscription.created':
        // Handle new subscription
        break;
    }
    
    res.json({ received: true });
  } else {
    res.status(400).send('Invalid signature');
  }
});
```

## 🧪 Testing

### Test Payment Flows

1. **Stripe Test Cards**
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - 3D Secure: `4000002500003155`

2. **Confirmo Test Mode**
   - Use test API keys
   - Test with small amounts
   - Verify webhook handling

### Test Email Delivery

1. **Development**
   - Use console logging
   - Check email service logs

2. **Production**
   - Use real email addresses
   - Monitor delivery rates

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   - Use production Stripe keys
   - Use production Confirmo keys
   - Use production email service

2. **Database Migration**
   - Run Supabase migrations
   - Set up Row Level Security (RLS)
   - Configure database backups

3. **Security Configuration**
   - Enable HTTPS
   - Configure CORS
   - Set up rate limiting

### Monitoring

1. **Error Tracking**
   - Monitor API errors
   - Track payment failures
   - Log security events

2. **Performance Monitoring**
   - API response times
   - Database query performance
   - Payment processing times

## 📊 Analytics

### User Analytics
- Page views
- User actions
- Conversion tracking
- Payment analytics

### Business Metrics
- Revenue tracking
- Subscription metrics
- Customer lifetime value
- Churn analysis

## 🔧 Maintenance

### Regular Tasks
- Monitor payment processing
- Check email delivery
- Review security logs
- Update dependencies

### Database Maintenance
- Clean up expired sessions
- Archive old data
- Optimize queries
- Backup data

## 📞 Support

### Customer Support
- Support ticket system
- Live chat integration
- Email notifications
- Knowledge base

### Technical Support
- API documentation
- Error handling
- Debug logging
- Performance monitoring

## 🎯 Next Steps

1. **Set up environment variables**
2. **Configure payment providers**
3. **Set up email service**
4. **Test all integrations**
5. **Deploy to production**
6. **Monitor and maintain**

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Confirmo Documentation](https://confirmo.net/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Email Service Setup](https://nodemailer.com/about/)

---

**Note**: This backend infrastructure provides a complete foundation for your algorithmic trading platform. All payment processing, user management, and business logic is handled securely and efficiently.
