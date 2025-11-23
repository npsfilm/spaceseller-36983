import { describe, it, expect } from 'vitest';
import { TravelCostCalculator } from './TravelCostCalculator';

describe('TravelCostCalculator', () => {
  const calculator = new TravelCostCalculator();

  describe('calculateTravelCost', () => {
    it('should return 0 for distances under free threshold', () => {
      expect(calculator.calculateTravelCost(10)).toBe(0);
      expect(calculator.calculateTravelCost(20)).toBe(0);
      expect(calculator.calculateTravelCost(25)).toBe(0);
    });

    it('should calculate cost for short distances (≤200km)', () => {
      // 50km * €0.65 = €32.50 → rounds to €35
      expect(calculator.calculateTravelCost(50)).toBe(35);
      
      // 100km * €0.65 = €65 → already multiple of 5
      expect(calculator.calculateTravelCost(100)).toBe(65);
      
      // 150km * €0.65 = €97.50 → rounds to €100
      expect(calculator.calculateTravelCost(150)).toBe(100);
    });

    it('should calculate cost for long distances (>200km)', () => {
      // 250km: (200 * 0.65) + (50 * 0.85) = 130 + 42.5 = 172.5 → rounds to €175
      expect(calculator.calculateTravelCost(250)).toBe(175);
      
      // 300km: (200 * 0.65) + (100 * 0.85) = 130 + 85 = 215 → already multiple of 5
      expect(calculator.calculateTravelCost(300)).toBe(215);
    });

    it('should round up to nearest 5 euros', () => {
      // 51km * €0.65 = €33.15 → rounds to €35
      expect(calculator.calculateTravelCost(51)).toBe(35);
      
      // 52km * €0.65 = €33.80 → rounds to €35
      expect(calculator.calculateTravelCost(52)).toBe(35);
      
      // 54km * €0.65 = €35.10 → rounds to €40
      expect(calculator.calculateTravelCost(54)).toBe(40);
    });

    it('should handle exact 200km boundary', () => {
      // 200km * €0.65 = €130
      expect(calculator.calculateTravelCost(200)).toBe(130);
    });

    it('should throw error for negative distances', () => {
      expect(() => calculator.calculateTravelCost(-10)).toThrow('Distance cannot be negative');
    });

    it('should handle zero distance', () => {
      expect(calculator.calculateTravelCost(0)).toBe(0);
    });
  });

  describe('isFreeTravel', () => {
    it('should return true for distances below free threshold', () => {
      expect(calculator.isFreeTravel(10)).toBe(true);
      expect(calculator.isFreeTravel(25)).toBe(true);
    });

    it('should return false for distances above free threshold', () => {
      expect(calculator.isFreeTravel(50)).toBe(false);
      expect(calculator.isFreeTravel(100)).toBe(false);
    });
  });

  describe('getFreeDistanceLimit', () => {
    it('should return correct breakeven distance', () => {
      // €20 threshold / €0.65 per km ≈ 30.77km
      const limit = calculator.getFreeDistanceLimit();
      expect(limit).toBeCloseTo(30.77, 1);
    });
  });

  describe('edge cases', () => {
    it('should handle very small distances correctly', () => {
      expect(calculator.calculateTravelCost(0.5)).toBe(0);
      expect(calculator.calculateTravelCost(1)).toBe(0);
    });

    it('should handle very large distances correctly', () => {
      // 500km: (200 * 0.65) + (300 * 0.85) = 130 + 255 = 385 → already multiple of 5
      expect(calculator.calculateTravelCost(500)).toBe(385);
      
      // 1000km: (200 * 0.65) + (800 * 0.85) = 130 + 680 = 810 → already multiple of 5
      expect(calculator.calculateTravelCost(1000)).toBe(810);
    });

    it('should handle decimal distances', () => {
      // 50.5km * €0.65 = €32.825 → rounds to €35
      expect(calculator.calculateTravelCost(50.5)).toBe(35);
    });
  });
});
