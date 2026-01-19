# Algo Trading with Ighodalo

> Professional Algorithmic Trading Solutions Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)

A comprehensive web platform for managing and distributing Expert Advisors (EAs) for MetaTrader 5. This platform provides a complete solution for selling, licensing, and managing algorithmic trading software with integrated payment processing, user management, and license validation.

## 🚀 Features

### Core Functionality
- **Expert Advisor Marketplace**: Browse and purchase professional trading EAs
- **License Management**: Secure license generation, validation, and tracking
- **Account Linking**: Connect MT5 trading accounts to licenses with limit enforcement
- **Payment Processing**: Integrated Stripe and Paystack payment gateways
- **User Dashboard**: Comprehensive user portal for managing licenses, accounts, and transactions
- **Admin Dashboard**: Full administrative control panel for managing users, products, and licenses

### Technical Features
- **Modern Stack**: React 18 + TypeScript + Vite for blazing-fast development
- **UI Components**: shadcn/ui with Tailwind CSS for beautiful, accessible interfaces
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Secure user authentication and authorization
- **Real-time Updates**: Live data synchronization with Supabase
- **Responsive Design**: Mobile-first, fully responsive UI
- **Theme Support**: Light/dark mode with system preference detection

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Payment Integration](#payment-integration)
- [License System](#license-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** - [Sign up here](https://supabase.com)
- **Stripe Account** (for payments) - [Sign up here](https://stripe.com)
- **Paystack Account** (optional, for African markets) - [Sign up here](https://paystack.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algo-vista-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Run database migrations**
   - Open Supabase Dashboard → SQL Editor
   - Run migrations from `supabase/migrations/` in order
   - Or use Supabase CLI: `supabase db reset`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
algo-vista-hub/
├── public/                 # Static assets
│   ├── docs/              # PDF documentation
│   └── favicon_io/        # Favicon files
├── src/
│   ├── components/        # React components
│   │   ├── accounts/      # Account management components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout components
│   │   ├── payments/      # Payment components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   ├── data/              # Static data (EAs, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/      # Supabase client & types
│   ├── lib/               # Utility functions
│   │   ├── api/           # API services
│   │   ├── payments/      # Payment processing
│   │   └── security.ts    # Security utilities
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # User dashboard pages
│   │   ├── legal/         # Legal pages
│   │   └── products/      # Product pages
│   └── App.tsx            # Main app component
├── supabase/
│   ├── functions/         # Edge functions
│   │   ├── create-license/
│   │   ├── validate-license/
│   │   └── heartbeat-license/
│   └── migrations/        # Database migrations
├── resources/             # Documentation resources
└── package.json
```

## 🛠 Technology Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Edge Functions
  - Real-time subscriptions

### Payment Processing
- **Stripe** - Global payment processing
- **Paystack** - African payment gateway

### Additional Tools
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **date-fns** - Date utilities
- **Recharts** - Data visualization

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_WEBHOOK_SECRET=whsec_...

# Paystack Configuration (Optional)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
VITE_PAYSTACK_SECRET_KEY=sk_test_...
VITE_PAYSTACK_WEBHOOK_SECRET=...

# Email Configuration (SMTP)
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_email@gmail.com
VITE_SMTP_PASSWORD=your_app_password
VITE_FROM_EMAIL=noreply@algotradingwithighodalo.com
VITE_FROM_NAME=Algo Trading with Ighodalo

# Security
VITE_JWT_SECRET=your_jwt_secret
VITE_ENCRYPTION_KEY=your_encryption_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Algo Trading with Ighodalo

# Cloudflare Worker (License Verification)
VITE_VERIFY_URL=https://your-worker.workers.dev/verify

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_LOGGING=false
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

## 🗄 Database Setup

### Core Tables

- **profiles** - User profiles and settings
- **ea_products** - Expert Advisor product catalog
- **licenses** - License management and tracking
- **license_accounts** - MT5 account to license linking
- **subscriptions** - User subscription management
- **subscription_tiers** - Available subscription plans
- **transactions** - Payment transaction records
- **affiliates** - Affiliate program data
- **support_tickets** - Customer support system

### Running Migrations

1. **Using Supabase Dashboard**:
   - Go to SQL Editor
   - Copy migration files from `supabase/migrations/`
   - Run them in chronological order

2. **Using Supabase CLI**:
   ```bash
   supabase db reset
   # or
   supabase migration up
   ```

See `DATABASE_SETUP.md` for detailed database documentation.

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook secret to `.env`

### Paystack Setup
1. Create a Paystack account
2. Get API keys from Settings → API Keys & Webhooks
3. Configure webhook URL
4. Add keys to `.env`

See `STRIPE_SETUP.md` and `PAYSTACK_SETUP_GUIDE.md` for detailed setup instructions.

## 🔑 License System

The platform includes a comprehensive license management system:

### Features
- **License Generation**: Automatic license key generation on purchase
- **Account Linking**: Link MT5 accounts to licenses with limit enforcement
- **Validation**: Real-time license validation via Cloudflare Worker
- **Expiration Tracking**: Automatic expiration and renewal management
- **Audit Trail**: Complete logging of all license actions

### License Types
- **Individual EA License**: Single EA product license
- **Subscription License**: Recurring subscription-based access
- **Trial License**: Time-limited trial access

See `HOW_ACCOUNTS_WORK.md` for detailed license system documentation.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deployment Options

1. **Vercel** (Recommended)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically on push

2. **Netlify**
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Supabase Hosting**
   - Use Supabase's built-in hosting
   - Configure in Supabase Dashboard

4. **Traditional Hosting**
   - Upload `dist/` folder to your web server
   - Configure server for SPA routing

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md)
- [Database Setup](DATABASE_SETUP.md)
- [Backend Setup](BACKEND_SETUP.md)
- [Stripe Setup](STRIPE_SETUP.md)
- [Paystack Setup](PAYSTACK_SETUP_GUIDE.md)
- [Accounts & Licensing](HOW_ACCOUNTS_WORK.md)
- [Admin Setup](ADMIN_SETUP.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email algotradingwithighodalo@gmail.com or join our Telegram channel: [@AlgotradingwithIghodalo](https://t.me/algotradingwithighodalo)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Supabase](https://supabase.com) for the backend infrastructure
- [Vite](https://vitejs.dev/) for the excellent build tooling

---

**Built with ❤️ for the algorithmic trading community**
