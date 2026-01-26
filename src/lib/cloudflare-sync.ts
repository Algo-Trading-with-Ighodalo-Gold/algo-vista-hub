// Cloudflare License Sync Utility
// This file handles syncing licenses to Cloudflare from the admin panel

import { supabase } from "@/integrations/supabase/client";

export interface SyncLicenseParams {
  product_id: string;
  days?: number;
  max_accounts?: number;
}

export interface SyncLicenseResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * Sync a license to Cloudflare
 * This function calls the Supabase Edge Function which then calls the Cloudflare Worker
 * 
 * @param params - License sync parameters
 * @returns Promise with sync result
 */
export async function syncLicenseToCloudflare(
  params: SyncLicenseParams
): Promise<SyncLicenseResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase.functions.invoke('sync-license-to-cloudflare', {
      body: {
        product_id: params.product_id,
        days: params.days || 365,
        max_accounts: params.max_accounts || 1,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to sync license to Cloudflare');
    }

    if (!data) {
      throw new Error('Empty response from server');
    }

    return data as SyncLicenseResponse;
  } catch (error: any) {
    console.error('Error syncing license to Cloudflare:', error);
    return {
      success: false,
      error: error.message || 'Failed to sync license to Cloudflare',
    };
  }
}
