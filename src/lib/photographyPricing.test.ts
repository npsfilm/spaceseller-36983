import { describe, it, expect } from 'vitest';
import { filterPackagesByType, calculateAddOnsTotal, calculateTotalPrice } from './photographyPricing';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';

describe('photographyPricing', () => {
  describe('filterPackagesByType', () => {
    it('should filter photo packages', () => {
      const result = filterPackagesByType(PACKAGE_TIERS, 'photo');
      expect(result.every(p => p.type === 'photo')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter drone packages', () => {
      const result = filterPackagesByType(PACKAGE_TIERS, 'drone');
      expect(result.every(p => p.type === 'drone')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter combo packages', () => {
      const result = filterPackagesByType(PACKAGE_TIERS, 'photo_drone');
      expect(result.every(p => p.type === 'photo_drone')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid type', () => {
      const result = filterPackagesByType(PACKAGE_TIERS, 'invalid' as any);
      expect(result).toEqual([]);
    });
  });

  describe('calculateAddOnsTotal', () => {
    it('should return 0 for no add-ons', () => {
      const result = calculateAddOnsTotal([], ADD_ONS);
      expect(result).toBe(0);
    });

    it('should calculate single add-on price', () => {
      const droneAddon = ADD_ONS.find(a => a.id === 'drone');
      const result = calculateAddOnsTotal(['drone'], ADD_ONS);
      expect(result).toBe(droneAddon?.price || 0);
    });

    it('should calculate multiple add-ons total', () => {
      const result = calculateAddOnsTotal(['drone', 'video'], ADD_ONS);
      const expected = (ADD_ONS.find(a => a.id === 'drone')?.price || 0) + 
                      (ADD_ONS.find(a => a.id === 'video')?.price || 0);
      expect(result).toBe(expected);
    });

    it('should handle invalid add-on IDs gracefully', () => {
      const result = calculateAddOnsTotal(['invalid-id'], ADD_ONS);
      expect(result).toBe(0);
    });

    it('should calculate all available add-ons', () => {
      const allIds = ADD_ONS.map(a => a.id);
      const result = calculateAddOnsTotal(allIds, ADD_ONS);
      const expected = ADD_ONS.reduce((sum, a) => sum + a.price, 0);
      expect(result).toBe(expected);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should calculate total with package only', () => {
      const result = calculateTotalPrice(299, 0, 0);
      expect(result).toBe(299);
    });

    it('should calculate total with package and add-ons', () => {
      const result = calculateTotalPrice(299, 89, 0);
      expect(result).toBe(388);
    });

    it('should calculate total with package, add-ons, and travel cost', () => {
      const result = calculateTotalPrice(299, 89, 45);
      expect(result).toBe(433);
    });

    it('should handle zero package price', () => {
      const result = calculateTotalPrice(0, 89, 45);
      expect(result).toBe(134);
    });

    it('should handle all components', () => {
      const result = calculateTotalPrice(499, 378, 65);
      expect(result).toBe(942);
    });

    it('should return correct sum with decimal precision', () => {
      const result = calculateTotalPrice(299.99, 89.50, 45.25);
      expect(result).toBeCloseTo(434.74, 2);
    });
  });

  describe('integration scenarios', () => {
    it('should calculate complete order price correctly', () => {
      // Scenario: Standard photo package + drone addon + travel
      const photoPackages = filterPackagesByType(PACKAGE_TIERS, 'photo');
      const standardPackage = photoPackages.find(p => p.name === 'Standard');
      
      const addOnsTotal = calculateAddOnsTotal(['drone'], ADD_ONS);
      const travelCost = 45;
      
      const total = calculateTotalPrice(
        standardPackage?.price || 0,
        addOnsTotal,
        travelCost
      );
      
      expect(total).toBeGreaterThan(0);
      expect(total).toBe((standardPackage?.price || 0) + addOnsTotal + travelCost);
    });
  });
});
