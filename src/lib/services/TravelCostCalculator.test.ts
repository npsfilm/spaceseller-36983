import { describe, it, expect } from 'vitest';
import { TravelCostCalculator } from './TravelCostCalculator';

describe('TravelCostCalculator', () => {
  const calculator = new TravelCostCalculator();

  describe('calculateTravelCost', () => {
    it('calculates cost for distances within first 20km tier', () => {
      const cost = calculator.calculateTravelCost(15);
      expect(cost).toBe(5); // 15km * 0.30 = 4.50, rounded up to 5
    });

    it('calculates cost for distances at the tier boundary', () => {
      const cost = calculator.calculateTravelCost(20);
      expect(cost).toBe(10); // 20km * 0.30 = 6.00, rounded up to 10
    });

    it('calculates cost for distances beyond 20km', () => {
      const cost = calculator.calculateTravelCost(50);
      // First 20km: 20 * 0.30 = 6
      // Next 30km: 30 * 0.38 = 11.40
      // Total: 17.40, rounded up to 20
      expect(cost).toBe(20);
    });

    it('calculates cost for very long distances', () => {
      const cost = calculator.calculateTravelCost(100);
      // First 20km: 20 * 0.30 = 6
      // Next 80km: 80 * 0.38 = 30.40
      // Total: 36.40, rounded up to 40
      expect(cost).toBe(40);
    });

    it('rounds up to nearest 5 euros', () => {
      const cost1 = calculator.calculateTravelCost(10);
      expect(cost1).toBe(5); // 3.00, rounded up to 5

      const cost2 = calculator.calculateTravelCost(25);
      // First 20km: 6.00
      // Next 5km: 1.90
      // Total: 7.90, rounded up to 10
      expect(cost2).toBe(10);
    });

    it('handles zero distance', () => {
      const cost = calculator.calculateTravelCost(0);
      expect(cost).toBe(0);
    });

    it('throws error for negative distance', () => {
      expect(() => calculator.calculateTravelCost(-10)).toThrow('Distance cannot be negative');
    });
  });

  describe('getFirstTierLimit', () => {
    it('returns the first tier distance limit', () => {
      expect(calculator.getFirstTierLimit()).toBe(20);
    });
  });

  describe('edge cases', () => {
    it('should handle very small distances correctly', () => {
      // 0.5km * €0.30 = €0.15 → rounds to €5
      expect(calculator.calculateTravelCost(0.5)).toBe(5);
      // 1km * €0.30 = €0.30 → rounds to €5
      expect(calculator.calculateTravelCost(1)).toBe(5);
    });

    it('should handle very large distances correctly', () => {
      // 200km: (20 * 0.30) + (180 * 0.38) = 6 + 68.40 = 74.40 → rounds to €75
      expect(calculator.calculateTravelCost(200)).toBe(75);
      
      // 500km: (20 * 0.30) + (480 * 0.38) = 6 + 182.40 = 188.40 → rounds to €190
      expect(calculator.calculateTravelCost(500)).toBe(190);
    });

    it('should handle decimal distances', () => {
      // 22.5km: (20 * 0.30) + (2.5 * 0.38) = 6 + 0.95 = 6.95 → rounds to €10
      expect(calculator.calculateTravelCost(22.5)).toBe(10);
    });
  });
});
