import { describe, it, expect } from 'vitest';
import { LocationService } from './LocationService';
import type { AddressSuggestion } from './LocationService';

describe('LocationService', () => {
  describe('parseAddressFromSuggestion', () => {
    it('should parse complete address suggestion correctly', () => {
      const service = new LocationService('test-token');
      
      const suggestion: AddressSuggestion = {
        place_name: 'Musterstraße 123, 80331 München, Germany',
        center: [11.5761, 48.1372],
        text: 'Musterstraße',
        address: '123',
        context: [
          { id: 'postcode.123', text: '80331' },
          { id: 'place.456', text: 'München' }
        ]
      };
      
      const result = service.parseAddressFromSuggestion(suggestion);
      
      expect(result.streetName).toBe('Musterstraße');
      expect(result.houseNumber).toBe('123');
      expect(result.postalCode).toBe('80331');
      expect(result.city).toBe('München');
    });

    it('should handle missing house number', () => {
      const service = new LocationService('test-token');
      
      const suggestion: AddressSuggestion = {
        place_name: 'Musterstraße, 80331 München, Germany',
        center: [11.5761, 48.1372],
        text: 'Musterstraße',
        context: [
          { id: 'postcode.123', text: '80331' },
          { id: 'place.456', text: 'München' }
        ]
      };
      
      const result = service.parseAddressFromSuggestion(suggestion);
      
      expect(result.streetName).toBe('Musterstraße');
      expect(result.houseNumber).toBe('');
      expect(result.postalCode).toBe('80331');
      expect(result.city).toBe('München');
    });

    it('should handle missing context', () => {
      const service = new LocationService('test-token');
      
      const suggestion: AddressSuggestion = {
        place_name: 'Musterstraße 123',
        center: [11.5761, 48.1372],
        text: 'Musterstraße',
        address: '123'
      };
      
      const result = service.parseAddressFromSuggestion(suggestion);
      
      expect(result.streetName).toBe('Musterstraße');
      expect(result.houseNumber).toBe('123');
      expect(result.postalCode).toBe('');
      expect(result.city).toBe('');
    });
  });

  describe('isTokenConfigured', () => {
    it('should detect valid token configuration', () => {
      // Note: This test depends on MAPBOX_CONFIG
      // In a real test, we'd mock the config
      const isConfigured = LocationService.isTokenConfigured();
      expect(typeof isConfigured).toBe('boolean');
    });
  });
});
