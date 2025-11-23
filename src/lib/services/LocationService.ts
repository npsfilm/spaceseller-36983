import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { MAPBOX_CONFIG } from '@/config/mapbox';

export interface AddressSuggestion {
  place_name: string;
  center: [number, number];
  text: string;
  address?: string;
  context?: Array<{ id: string; text: string }>;
}

export interface ParsedAddress {
  streetName: string;
  houseNumber: string;
  city: string;
  postalCode: string;
}

export interface GeocodingResult {
  coordinates: [number, number]; // [lng, lat]
  place_name: string;
}

/**
 * Service for handling location-based operations including
 * geocoding, address parsing, and address suggestions
 */
export class LocationService {
  private geocodingClient;

  constructor(accessToken: string) {
    this.geocodingClient = mbxGeocoding({ accessToken });
  }

  /**
   * Parse address components from a Mapbox suggestion
   */
  parseAddressFromSuggestion(suggestion: AddressSuggestion): ParsedAddress {
    const houseNumber = suggestion.address || '';
    const streetName = suggestion.text || '';
    
    let city = '';
    let postalCode = '';
    
    if (suggestion.context) {
      for (const ctx of suggestion.context) {
        if (ctx.id.startsWith('postcode')) {
          postalCode = ctx.text;
        } else if (ctx.id.startsWith('place')) {
          city = ctx.text;
        }
      }
    }
    
    return { streetName, houseNumber, city, postalCode };
  }

  /**
   * Fetch address suggestions from Mapbox Geocoding API
   */
  async fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
    if (query.length < 3) {
      return [];
    }

    try {
      const response = await this.geocodingClient.forwardGeocode({
        query: `${query}, Deutschland`,
        limit: 5,
        countries: ['de'],
        types: ['address']
      }).send();

      return (response.body.features || []) as AddressSuggestion[];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      throw new Error('Failed to fetch address suggestions');
    }
  }

  /**
   * Geocode a complete address to get coordinates
   */
  async geocodeAddress(address: {
    strasse: string;
    hausnummer?: string;
    plz: string;
    stadt: string;
  }): Promise<GeocodingResult | null> {
    const fullAddress = `${address.strasse} ${address.hausnummer || ''}, ${address.plz} ${address.stadt}, Deutschland`.trim();
    
    try {
      const response = await this.geocodingClient.forwardGeocode({
        query: fullAddress,
        limit: 1
      }).send();
      
      if (!response.body.features.length) {
        return null;
      }
      
      const feature = response.body.features[0];
      return {
        coordinates: feature.geometry.coordinates as [number, number],
        place_name: feature.place_name
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Validate if a Mapbox token is properly configured
   */
  static isTokenConfigured(): boolean {
    return Boolean(
      MAPBOX_CONFIG.accessToken && 
      MAPBOX_CONFIG.accessToken !== 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE'
    );
  }
}

// Export singleton instance
export const locationService = new LocationService(MAPBOX_CONFIG.accessToken);
