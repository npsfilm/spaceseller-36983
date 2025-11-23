import { supabase } from '@/integrations/supabase/client';

export interface PhotographerMatch {
  id: string;
  distance_km: number;
  profile: {
    vorname: string;
    nachname: string;
    email: string;
  };
}

export interface PhotographerAvailability {
  available: boolean;
  photographers: PhotographerMatch[];
  nearestDistance?: number;
}

/**
 * Service for finding and matching photographers based on location
 */
export class PhotographerMatchingService {
  /**
   * Find available photographers within a specified radius
   * @param latitude - Destination latitude
   * @param longitude - Destination longitude
   * @param maxDistanceKm - Maximum search radius in kilometers (default: 150)
   * @returns Available photographers sorted by distance
   */
  async findAvailablePhotographers(
    latitude: number,
    longitude: number,
    maxDistanceKm: number = 150
  ): Promise<PhotographerAvailability> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'find-available-photographers',
        {
          body: {
            latitude,
            longitude,
            max_distance_km: maxDistanceKm
          }
        }
      );

      if (error) {
        console.error('Error finding photographers:', error);
        throw new Error('Failed to find available photographers');
      }

      const photographers = data?.photographers || [];
      const available = photographers.length > 0;

      return {
        available,
        photographers,
        nearestDistance: available ? photographers[0].distance_km : undefined
      };
    } catch (error) {
      console.error('Photographer matching error:', error);
      throw error;
    }
  }

  /**
   * Get the nearest photographer for a location
   */
  async getNearestPhotographer(
    latitude: number,
    longitude: number
  ): Promise<PhotographerMatch | null> {
    const result = await this.findAvailablePhotographers(latitude, longitude);
    return result.photographers[0] || null;
  }

  /**
   * Check if photography services are available at a location
   */
  async isPhotographyAvailable(
    latitude: number,
    longitude: number
  ): Promise<boolean> {
    const result = await this.findAvailablePhotographers(latitude, longitude);
    return result.available;
  }
}

// Export singleton instance
export const photographerMatchingService = new PhotographerMatchingService();
