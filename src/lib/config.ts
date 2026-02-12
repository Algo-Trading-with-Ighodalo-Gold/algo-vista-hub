// Application Configuration
// This file contains all configuration settings for the application

export const config = {
  // App Information
  app: {
    name: 'Algo Trading with Ighodalo',
    version: '1.0.0',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    description: 'Professional Algorithmic Trading Solutions',
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://vvgtmfmvisxhivmldrhd.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3RtZm12aXN4aGl2bWxkcmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODUwNzYsImV4cCI6MjA3MjE2MTA3Nn0.fw3TtYzM92-hV-BAN2PeA1NnGLa6TvhvEhgjqQ1QdCE',
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  },

  // Polar Configuration
  polar: {
    webhookSecret: import.meta.env.VITE_POLAR_WEBHOOK_SECRET || '',
    organizationId: import.meta.env.VITE_POLAR_ORGANIZATION_ID || '',
    defaultProductId: import.meta.env.VITE_POLAR_DEFAULT_PRODUCT_ID || '',
  },

  // Email Configuration
  email: {
    smtpHost: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
    smtpUser: import.meta.env.VITE_SMTP_USER || '',
    smtpPassword: import.meta.env.VITE_SMTP_PASSWORD || '',
    fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@algotradingwithighodalo.com',
    fromName: import.meta.env.VITE_FROM_NAME || 'Algo Trading with Ighodalo',
  },

  // Security Configuration
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret-key',
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'your-encryption-key',
    rateLimitRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100'),
    rateLimitWindow: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  },

  // Telegram Configuration
  telegram: {
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
    channelId: import.meta.env.VITE_TELEGRAM_CHANNEL_ID || '@AlgotradingwithIghodalo',
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
    emailNotifications: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
    paymentProcessing: import.meta.env.VITE_ENABLE_PAYMENT_PROCESSING === 'true',
  },

  // API Endpoints
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000, // 30 seconds
  },

  // Payment Configuration
  payments: {
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK'],
    polarEnabled: true,
  },

  // License Configuration
  licenses: {
    defaultValidityDays: 365,
    maxConcurrentSessions: 1,
    maxValidationsPerHour: 100,
    hardwareBindingRequired: true,
  },

  // Subscription Configuration
  subscriptions: {
    trialDays: 7,
    gracePeriodDays: 3,
    autoRenewal: true,
  },

  // Email Templates
  emailTemplates: {
    welcome: 'welcome',
    verification: 'email-verification',
    passwordReset: 'password-reset',
    purchaseConfirmation: 'purchase-confirmation',
    subscriptionConfirmation: 'subscription-confirmation',
    licenseKey: 'license-key',
    supportTicket: 'support-ticket',
  },

  // Error Handling
  errorHandling: {
    showDetailedErrors: import.meta.env.NODE_ENV === 'development',
    logErrors: true,
    reportErrors: import.meta.env.NODE_ENV === 'production',
  },

  // Logging Configuration
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: import.meta.env.NODE_ENV === 'production',
    enableRemote: false,
  },
};

// Validation function to check if required configuration is present
export function validateConfig(): { isValid: boolean; missingKeys: string[] } {
  const missingKeys: string[] = [];

  // Check required Supabase configuration
  if (!config.supabase.url) {
    missingKeys.push('VITE_SUPABASE_URL');
  }
  if (!config.supabase.anonKey) {
    missingKeys.push('VITE_SUPABASE_ANON_KEY');
  }

  // Check payment configuration
  if (!config.stripe.publishableKey && !config.polar.organizationId) {
    missingKeys.push('VITE_STRIPE_PUBLISHABLE_KEY or VITE_POLAR_ORGANIZATION_ID');
  }

  // Check email configuration
  if (!config.email.smtpUser || !config.email.smtpPassword) {
    missingKeys.push('VITE_SMTP_USER and VITE_SMTP_PASSWORD');
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
}

// Export individual configuration sections for easier imports
export const {
  app,
  supabase: supabaseConfig,
  stripe: stripeConfig,
  polar: polarConfig,
  email: emailConfig,
  security: securityConfig,
  telegram: telegramConfig,
  features: featureFlags,
  api: apiConfig,
  payments: paymentConfig,
  licenses: licenseConfig,
  subscriptions: subscriptionConfig,
  emailTemplates,
  errorHandling,
  logging: loggingConfig,
} = config;
