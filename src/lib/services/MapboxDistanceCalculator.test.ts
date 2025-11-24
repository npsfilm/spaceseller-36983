import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapboxDistanceCalculator } from './MapboxDistanceCalculator';

// Mock fetch
global.fetch = vi.fn();

describe('MapboxDistanceCalculator', () => {
  let calculator: MapboxDistanceCalculator;

  beforeEach(() => {
    calculator = new MapboxDistanceCalculator('test-token');
    vi.clearAllMocks();
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', async () => {
      const mockResponse = {
        routes: [
          {
            distance: 50000, // 50km in meters
            duration: 3600,  // 60 minutes in seconds
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await calculator.calculateDistance(10.9, 48.4, 11.0, 48.5);

      expect(result.distance).toBe(50);
      expect(result.duration).toBe(60);
    });

    it('should throw error when no route found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ routes: [] }),
      });

      await expect(
        calculator.calculateDistance(10.9, 48.4, 11.0, 48.5)
      ).rejects.toThrow('No route found');
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      await expect(
        calculator.calculateDistance(10.9, 48.4, 11.0, 48.5)
      ).rejects.toThrow('Mapbox API error: Unauthorized');
    });
  });

  describe('geocodeAddress', () => {
    it('should geocode an address to coordinates', async () => {
      const mockResponse = {
        features: [
          {
            center: [10.9, 48.4]
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await calculator.geocodeAddress('Hauptstraße 1, 86152 Augsburg');

      expect(result).toEqual([10.9, 48.4]);
    });

    it('should return null when no results found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ features: [] }),
      });

      const result = await calculator.geocodeAddress('Invalid Address 123');

      expect(result).toBeNull();
    });

    it('should handle geocoding errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      const result = await calculator.geocodeAddress('Test Address');

      expect(result).toBeNull();
    });
  });
});
