// API Service for user management and other API operations
import { supabase } from '@/integrations/supabase/client'
import { log } from '@/lib/logger'
import { ErrorHandler } from '@/lib/error-handler'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  country: string
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  first_name: string
  last_name: string
  country: string
}

export class UserAPI {
  // Create user profile
  static async createProfile(userId: string, profileData: CreateProfileData): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          country: profileData.country,
        })
        .select()
        .single()

      if (error) {
        log.error('Failed to create user profile', { userId, error: error.message })
        throw error
      }

      log.userAction('User profile created', userId, profileData)
      return data
    } catch (error: any) {
      log.error('Error creating user profile', { userId, error: error.message })
      throw ErrorHandler.handle(error)
    }
  }

  // Get user profile
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        log.error('Failed to get user profile', { userId, error: error.message })
        throw error
      }

      return data
    } catch (error: any) {
      log.error('Error getting user profile', { userId, error: error.message })
      throw ErrorHandler.handle(error)
    }
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: Partial<CreateProfileData>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        log.error('Failed to update user profile', { userId, error: error.message })
        throw error
      }

      log.userAction('User profile updated', userId, profileData)
      return data
    } catch (error: any) {
      log.error('Error updating user profile', { userId, error: error.message })
      throw ErrorHandler.handle(error)
    }
  }

  // Delete user profile
  static async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        log.error('Failed to delete user profile', { userId, error: error.message })
        throw error
      }

      log.userAction('User profile deleted', userId)
    } catch (error: any) {
      log.error('Error deleting user profile', { userId, error: error.message })
      throw ErrorHandler.handle(error)
    }
  }
}

// Export the class as default and named export
export default UserAPI

