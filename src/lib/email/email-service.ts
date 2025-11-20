// Email Service
// This file handles email notifications and confirmations for the algorithmic trading platform

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

class EmailService {
  private config: EmailConfig;
  private transporter: any;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  // Initialize email transporter
  async initialize() {
    if (!this.transporter) {
      // Dynamic import to avoid SSR issues
      const nodemailer = await import('nodemailer');
      
      this.transporter = nodemailer.createTransporter({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPassword,
        },
      });

      // Verify connection configuration
      try {
        await this.transporter.verify();
        console.log('Email service initialized successfully');
      } catch (error) {
        console.error('Email service initialization failed:', error);
      }
    }
  }

  // Send email
  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      await this.initialize();

      const mailOptions = {
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userEmail: string, userName: string) {
    const template = this.getWelcomeTemplate(userName);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send email verification
  async sendVerificationEmail(userEmail: string, userName: string, verificationLink: string) {
    const template = this.getVerificationTemplate(userName, verificationLink);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetLink: string) {
    const template = this.getPasswordResetTemplate(userName, resetLink);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send purchase confirmation
  async sendPurchaseConfirmation(
    userEmail: string,
    userName: string,
    productName: string,
    amount: number,
    currency: string,
    licenseKey: string
  ) {
    const template = this.getPurchaseConfirmationTemplate(
      userName,
      productName,
      amount,
      currency,
      licenseKey
    );
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send subscription confirmation
  async sendSubscriptionConfirmation(
    userEmail: string,
    userName: string,
    planName: string,
    amount: number,
    currency: string,
    nextBillingDate: string
  ) {
    const template = this.getSubscriptionConfirmationTemplate(
      userName,
      planName,
      amount,
      currency,
      nextBillingDate
    );
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send license key email
  async sendLicenseKeyEmail(
    userEmail: string,
    userName: string,
    productName: string,
    licenseKey: string,
    downloadLink: string
  ) {
    const template = this.getLicenseKeyTemplate(
      userName,
      productName,
      licenseKey,
      downloadLink
    );
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send support ticket confirmation
  async sendSupportTicketConfirmation(
    userEmail: string,
    userName: string,
    ticketId: string,
    topic: string
  ) {
    const template = this.getSupportTicketTemplate(userName, ticketId, topic);
    
    return await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Email templates
  private getWelcomeTemplate(userName: string): EmailTemplate {
    return {
      subject: 'Welcome to Algo Trading with Ighodalo - Your Trading Journey Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Algo Trading with Ighodalo!</h1>
          <p>Dear ${userName},</p>
          <p>Welcome to the future of algorithmic trading! We're excited to have you join our community of successful traders.</p>
          <p>Your account has been successfully created and you can now:</p>
          <ul>
            <li>Browse our premium Expert Advisors</li>
            <li>Access our trading resources</li>
            <li>Join our exclusive Telegram community</li>
            <li>Get personalized support from our team</li>
          </ul>
          <p>Ready to start your trading journey? <a href="${window.location.origin}/products" style="color: #2563eb;">Explore our products</a></p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Welcome to Algo Trading with Ighodalo!\n\nDear ${userName},\n\nWelcome to the future of algorithmic trading! We're excited to have you join our community of successful traders.\n\nYour account has been successfully created and you can now:\n- Browse our premium Expert Advisors\n- Access our trading resources\n- Join our exclusive Telegram community\n- Get personalized support from our team\n\nReady to start your trading journey? Visit: ${window.location.origin}/products\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getVerificationTemplate(userName: string, verificationLink: string): EmailTemplate {
    return {
      subject: 'Verify Your Email Address - Algo Trading with Ighodalo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Verify Your Email Address</h1>
          <p>Dear ${userName},</p>
          <p>Thank you for signing up with Algo Trading with Ighodalo! To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Verify Your Email Address\n\nDear ${userName},\n\nThank you for signing up with Algo Trading with Ighodalo! To complete your registration, please verify your email address by visiting this link:\n\n${verificationLink}\n\nThis link will expire in 24 hours for security reasons.\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getPasswordResetTemplate(userName: string, resetLink: string): EmailTemplate {
    return {
      subject: 'Reset Your Password - Algo Trading with Ighodalo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Reset Your Password</h1>
          <p>Dear ${userName},</p>
          <p>We received a request to reset your password for your Algo Trading with Ighodalo account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Reset Your Password\n\nDear ${userName},\n\nWe received a request to reset your password for your Algo Trading with Ighodalo account.\n\nTo reset your password, visit this link:\n${resetLink}\n\nIf you didn't request this password reset, please ignore this email. Your password will remain unchanged.\n\nThis link will expire in 1 hour for security reasons.\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getPurchaseConfirmationTemplate(
    userName: string,
    productName: string,
    amount: number,
    currency: string,
    licenseKey: string
  ): EmailTemplate {
    return {
      subject: `Purchase Confirmation - ${productName} | Algo Trading with Ighodalo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Purchase Confirmation</h1>
          <p>Dear ${userName},</p>
          <p>Thank you for your purchase! Your order has been confirmed and processed successfully.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
            <p><strong>License Key:</strong> <code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${licenseKey}</code></p>
          </div>
          <p>Your license key has been activated and you can now use your Expert Advisor. Please keep this license key safe and secure.</p>
          <p>Need help getting started? <a href="${window.location.origin}/support" style="color: #2563eb;">Contact our support team</a></p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Purchase Confirmation\n\nDear ${userName},\n\nThank you for your purchase! Your order has been confirmed and processed successfully.\n\nOrder Details:\n- Product: ${productName}\n- Amount: ${currency} ${amount.toFixed(2)}\n- License Key: ${licenseKey}\n\nYour license key has been activated and you can now use your Expert Advisor. Please keep this license key safe and secure.\n\nNeed help getting started? Contact our support team at: ${window.location.origin}/support\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getSubscriptionConfirmationTemplate(
    userName: string,
    planName: string,
    amount: number,
    currency: string,
    nextBillingDate: string
  ): EmailTemplate {
    return {
      subject: `Subscription Confirmed - ${planName} | Algo Trading with Ighodalo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Subscription Confirmed</h1>
          <p>Dear ${userName},</p>
          <p>Your subscription has been successfully activated! Welcome to our premium trading community.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Subscription Details</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
            <p><strong>Next Billing Date:</strong> ${new Date(nextBillingDate).toLocaleDateString()}</p>
          </div>
          <p>You now have access to all premium features and Expert Advisors included in your plan.</p>
          <p>Manage your subscription in your <a href="${window.location.origin}/dashboard" style="color: #2563eb;">dashboard</a></p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Subscription Confirmed\n\nDear ${userName},\n\nYour subscription has been successfully activated! Welcome to our premium trading community.\n\nSubscription Details:\n- Plan: ${planName}\n- Amount: ${currency} ${amount.toFixed(2)}\n- Next Billing Date: ${new Date(nextBillingDate).toLocaleDateString()}\n\nYou now have access to all premium features and Expert Advisors included in your plan.\n\nManage your subscription in your dashboard: ${window.location.origin}/dashboard\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getLicenseKeyTemplate(
    userName: string,
    productName: string,
    licenseKey: string,
    downloadLink: string
  ): EmailTemplate {
    return {
      subject: `Your License Key - ${productName} | Algo Trading with Ighodalo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Your License Key</h1>
          <p>Dear ${userName},</p>
          <p>Here are your license details for ${productName}:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">License Information</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>License Key:</strong> <code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${licenseKey}</code></p>
            <p><strong>Download Link:</strong> <a href="${downloadLink}" style="color: #2563eb;">Download Expert Advisor</a></p>
          </div>
          <p>Please keep your license key safe and secure. You'll need it to activate your Expert Advisor.</p>
          <p>Need installation help? <a href="${window.location.origin}/support" style="color: #2563eb;">Contact our support team</a></p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Team</p>
        </div>
      `,
      text: `Your License Key\n\nDear ${userName},\n\nHere are your license details for ${productName}:\n\nLicense Information:\n- Product: ${productName}\n- License Key: ${licenseKey}\n- Download Link: ${downloadLink}\n\nPlease keep your license key safe and secure. You'll need it to activate your Expert Advisor.\n\nNeed installation help? Contact our support team at: ${window.location.origin}/support\n\nBest regards,\nThe Algo Trading with Ighodalo Team`,
    };
  }

  private getSupportTicketTemplate(userName: string, ticketId: string, topic: string): EmailTemplate {
    return {
      subject: `Support Ticket Created #${ticketId} | Algo Trading with Ighodalo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Support Ticket Created</h1>
          <p>Dear ${userName},</p>
          <p>Thank you for contacting our support team. We've received your request and will get back to you as soon as possible.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details</h3>
            <p><strong>Ticket ID:</strong> #${ticketId}</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <p><strong>Status:</strong> Open</p>
          </div>
          <p>We typically respond to support tickets within 24 hours. You can track your ticket status in your <a href="${window.location.origin}/dashboard" style="color: #2563eb;">dashboard</a>.</p>
          <p>Best regards,<br>The Algo Trading with Ighodalo Support Team</p>
        </div>
      `,
      text: `Support Ticket Created\n\nDear ${userName},\n\nThank you for contacting our support team. We've received your request and will get back to you as soon as possible.\n\nTicket Details:\n- Ticket ID: #${ticketId}\n- Topic: ${topic}\n- Status: Open\n\nWe typically respond to support tickets within 24 hours. You can track your ticket status in your dashboard: ${window.location.origin}/dashboard\n\nBest regards,\nThe Algo Trading with Ighodalo Support Team`,
    };
  }
}

// Export singleton instance
export const emailService = new EmailService({
  smtpHost: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
  smtpUser: import.meta.env.VITE_SMTP_USER || '',
  smtpPassword: import.meta.env.VITE_SMTP_PASSWORD || '',
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@algotradingwithighodalo.com',
  fromName: import.meta.env.VITE_FROM_NAME || 'Algo Trading with Ighodalo',
});

// Export types
export type { EmailConfig, EmailTemplate, EmailData };
