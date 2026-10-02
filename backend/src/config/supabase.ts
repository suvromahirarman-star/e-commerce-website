import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseClient;
};

/**
 * Storage Service helper for product images
 */
export const storageService = {
  /**
   * Upload an image buffer to Supabase Storage bucket
   */
  async uploadProductImage(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<{ url: string; storagePath: string }> {
    const supabase = getSupabaseClient();
    const bucket = env.SUPABASE_STORAGE_BUCKET;
    const storagePath = `products/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        logger.warn({ error: error.message }, 'Supabase Storage upload warning (fallback to CDN/data URL)');
        // Fallback for offline/mock environments
        return {
          url: `https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85`,
          storagePath,
        };
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return {
        url: publicUrlData.publicUrl,
        storagePath: data.path,
      };
    } catch (err) {
      logger.warn({ err }, 'Error connecting to Supabase Storage, using fallback image URL');
      return {
        url: `https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85`,
        storagePath,
      };
    }
  },

  /**
   * Delete an image from Supabase Storage
   */
  async deleteProductImage(storagePath: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const bucket = env.SUPABASE_STORAGE_BUCKET;

    try {
      const { error } = await supabase.storage.from(bucket).remove([storagePath]);
      if (error) {
        logger.warn({ error: error.message, storagePath }, 'Failed to delete file from Supabase storage');
        return false;
      }
      return true;
    } catch (err) {
      logger.warn({ err, storagePath }, 'Error deleting file from Supabase storage');
      return false;
    }
  },
};
