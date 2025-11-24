import { MAPBOX_CONFIG } from '@/config/mapbox';

export interface DistanceResult {
  distance: number; // Distance in kilometers
  duration: number; // Duration in minutes
}

/**
 * Service to calculate driving distance between two points using Mapbox Directions API
 */
export class MapboxDistanceCalculator {
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Calculate driving distance between two coordinates
   * @param fromLng - Starting point longitude
   * @param fromLat - Starting point latitude
   * @param toLng - Destination longitude
   * @param toLat - Destination latitude
   * @returns Distance in km and duration in minutes
   */
  async calculateDistance(
    fromLng: number,
    fromLat: number,
    toLng: number,
    toLat: number
  ): Promise<DistanceResult> {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?access_token=${this.accessToken}&geometries=geojson`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      
      return {
        distance: route.distance / 1000, // Convert meters to kilometers
        duration: route.duration / 60,   // Convert seconds to minutes
      };
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  /**
   * Geocode an address string to coordinates
   * @param address - Full address string
   * @returns Coordinates [lng, lat]
   */
  async geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.accessToken}&country=DE&types=address&limit=1`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox Geocoding error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        return null;
      }

      const [lng, lat] = data.features[0].center;
      return [lng, lat];
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
}

// Export singleton instance
export const mapboxDistanceCalculator = new MapboxDistanceCalculator(MAPBOX_CONFIG.accessToken);
