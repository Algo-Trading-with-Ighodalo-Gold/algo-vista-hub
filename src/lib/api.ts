// API service for backend operations
import { supabase } from '@/integrations/supabase/client'
import { validateRegistrationForm, validateProjectInquiryForm, sanitizeString, sanitizeEmail, sanitizeTextarea } from './validation'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string>
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  country: string
  avatar_url?: string
  subscription_status: string
  affiliate_code?: string
  created_at: string
  updated_at: string
}

export interface ProjectInquiry {
  id: string
  name: string
  email: string
  strategy: string
  instruments: string
  timeframes: string
  entry_logic: string
  exit_logic: string
  risk_management: string
  trade_management: string
  special_features: string
  budget: string
  timeline: string
  status: string
  created_at: string
  updated_at: string
}

export interface EALicense {
  id: string
  user_id: string
  ea_id: string
  license_key: string
  status: 'active' | 'expired' | 'suspended'
  expires_at: string
  created_at: string
}

// User Management API
export class UserAPI {
  static async createProfile(userId: string, profileData: {
    first_name: string
    last_name: string
    referral_code?: string
  }): Promise<ApiResponse<UserProfile>> {
    try {
      // First, create the profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          user_id: userId,
          first_name: sanitizeString(profileData.first_name),
          last_name: sanitizeString(profileData.last_name),
          subscription_status: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // AFTER profile is created, link referral if provided
      if (profileData.referral_code && data) {
        const { error: referralError } = await supabase.rpc('link_referral_on_signup', {
          new_user_id: userId,
          referral_code_param: profileData.referral_code
        })
        
        if (referralError) {
          console.error('Failed to link referral:', referralError)
          // Don't fail profile creation if referral linking fails, but log it
        } else {
          console.log('Successfully linked referral:', profileData.referral_code)
        }
      }

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const sanitizedUpdates = {
        ...updates,
        first_name: updates.first_name ? sanitizeString(updates.first_name) : undefined,
        last_name: updates.last_name ? sanitizeString(updates.last_name) : undefined,
        country: updates.country ? sanitizeString(updates.country) : undefined,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
    try {
      // Convert file to base64 for storage in database
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const base64Data = await base64Promise
      
      // Update profile with base64 avatar data
      const result = await this.updateProfile(userId, { avatar_url: base64Data })
      
      if (result.success) {
        return { success: true, data: base64Data }
      } else {
        return { success: false, error: result.error || 'Failed to update profile' }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to upload avatar' }
    }
  }
}

// Project Inquiry API
export class ProjectInquiryAPI {
  static async createInquiry(inquiryData: {
    name: string
    email: string
    strategy: string
    instruments: string
    timeframes: string
    entry_logic: string
    exit_logic: string
    risk_management: string
    trade_management: string
    special_features: string
    budget: string
    timeline: string
    nda_agreed: boolean
  }): Promise<ApiResponse<ProjectInquiry>> {
    try {
      // Validate the form data
      const validation = validateProjectInquiryForm({
        name: inquiryData.name,
        email: inquiryData.email,
        strategy: inquiryData.strategy,
        entryLogic: inquiryData.entry_logic,
        exitLogic: inquiryData.exit_logic,
        budget: inquiryData.budget,
        timeline: inquiryData.timeline
      })

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        return { success: false, error: errorMessages || 'Validation failed' }
      }

      const sanitizedData = {
        name: sanitizeString(inquiryData.name),
        email: sanitizeEmail(inquiryData.email),
        strategy: sanitizeTextarea(inquiryData.strategy),
        instruments: sanitizeString(inquiryData.instruments),
        timeframes: sanitizeString(inquiryData.timeframes),
        entry_logic: sanitizeTextarea(inquiryData.entry_logic),
        exit_logic: sanitizeTextarea(inquiryData.exit_logic),
        risk_management: sanitizeTextarea(inquiryData.risk_management),
        trade_management: sanitizeTextarea(inquiryData.trade_management),
        special_features: sanitizeTextarea(inquiryData.special_features),
        budget: inquiryData.budget,
        timeline: inquiryData.timeline,
        nda_agreed: inquiryData.nda_agreed,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('project_inquiries')
        .insert(sanitizedData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Full error object:', error)
      // Supabase errors can have different properties
      const errorMessage = error.message || error.details || error.hint || error.code || JSON.stringify(error)
      return { success: false, error: errorMessage }
    }
  }

  static async getInquiriesByEmail(email: string): Promise<ApiResponse<ProjectInquiry[]>> {
    try {
      const { data, error } = await supabase
        .from('project_inquiries')
        .select('*')
        .eq('email', sanitizeEmail(email))
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async updateInquiryStatus(inquiryId: string, status: string): Promise<ApiResponse<ProjectInquiry>> {
    try {
      const { data, error } = await supabase
        .from('project_inquiries')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiryId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

// EA License API
export class EALicenseAPI {
  static async createLicense(userId: string, eaId: string): Promise<ApiResponse<EALicense>> {
    try {
      const licenseKey = this.generateLicenseKey()
      const expiresAt = new Date()
      expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year license

      const { data, error } = await supabase
        .from('ea_licenses')
        .insert({
          user_id: userId,
          ea_id: eaId,
          license_key: licenseKey,
          status: 'active',
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async getUserLicenses(userId: string): Promise<ApiResponse<EALicense[]>> {
    try {
      const { data, error } = await supabase
        .from('ea_licenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async validateLicense(licenseKey: string): Promise<ApiResponse<EALicense>> {
    try {
      const { data, error } = await supabase
        .from('ea_licenses')
        .select('*')
        .eq('license_key', licenseKey)
        .eq('status', 'active')
        .single()

      if (error) throw error

      // Check if license is expired
      if (new Date(data.expires_at) < new Date()) {
        // Update status to expired
        await supabase
          .from('ea_licenses')
          .update({ status: 'expired' })
          .eq('id', data.id)

        return { success: false, error: 'License has expired' }
      }

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  private static generateLicenseKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Analytics API
export class AnalyticsAPI {
  static async trackEvent(event: string, properties: Record<string, any> = {}): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: event,
          properties,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async getDashboardStats(userId: string): Promise<ApiResponse<{
    totalEAs: number
    activeEAs: number
    totalProfit: number
    monthlyProfit: number
  }>> {
    try {
      // This would typically involve complex queries
      // For now, returning mock data
      const stats = {
        totalEAs: 3,
        activeEAs: 2,
        totalProfit: 1250.50,
        monthlyProfit: 320.75
      }

      return { success: true, data: stats }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

// Notification API
export class NotificationAPI {
  static async sendEmail(to: string, subject: string, content: string): Promise<ApiResponse> {
    try {
      // This would integrate with an email service like SendGrid or Resend
      // For now, we'll just log it
      console.log('Email would be sent:', { to, subject, content })
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async sendTelegramMessage(chatId: string, message: string): Promise<ApiResponse> {
    try {
      // This would integrate with Telegram Bot API
      // For now, we'll just log it
      console.log('Telegram message would be sent:', { chatId, message })
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}





