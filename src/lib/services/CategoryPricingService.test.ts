import { describe, it, expect } from 'vitest';
import {
  CategoryPricingService,
  PhotographyPricingService,
  PhotoEditingPricingService,
  VirtualStagingPricingService,
  EnergyCertificatePricingService,
  type PricingItem
} from './CategoryPricingService';

describe('CategoryPricingService', () => {
  const service = new CategoryPricingService();

  describe('calculateSubtotal', () => {
    it('should calculate subtotal from items', () => {
      const items: PricingItem[] = [
        { id: 'item1', price: 100, quantity: 2 },
        { id: 'item2', price: 50, quantity: 1 }
      ];

      const subtotal = service.calculateSubtotal(items);
      expect(subtotal).toBe(250); // (100 * 2) + (50 * 1)
    });

    it('should include additional fees', () => {
      const items: PricingItem[] = [{ id: 'item1', price: 100 }];
      const subtotal = service.calculateSubtotal(items, 25);
      expect(subtotal).toBe(125);
    });

    it('should default quantity to 1 if not specified', () => {
      const items: PricingItem[] = [{ id: 'item1', price: 100 }];
      const subtotal = service.calculateSubtotal(items);
      expect(subtotal).toBe(100);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with default tax rate', () => {
      const total = service.calculateTotal(100);
      expect(total).toBe(119); // 100 + (100 * 0.19)
    });

    it('should calculate total with custom tax rate', () => {
      const total = service.calculateTotal(100, 0.10);
      expect(total).toBe(110); // 100 + (100 * 0.10)
    });
  });

  describe('getBreakdown', () => {
    it('should return complete pricing breakdown', () => {
      const items: PricingItem[] = [
        { id: 'item1', price: 100, quantity: 1 }
      ];

      const breakdown = service.getBreakdown(items);

      expect(breakdown.items).toEqual(items);
      expect(breakdown.subtotal).toBe(100);
      expect(breakdown.taxAmount).toBe(19);
      expect(breakdown.total).toBe(119);
    });

    it('should include travel cost in breakdown', () => {
      const items: PricingItem[] = [{ id: 'item1', price: 100 }];
      const breakdown = service.getBreakdown(items, 25);

      expect(breakdown.subtotal).toBe(125);
      expect(breakdown.travelCost).toBe(25);
    });
  });
});

describe('PhotographyPricingService', () => {
  const service = new PhotographyPricingService();

  describe('calculatePackageTotal', () => {
    it('should calculate package total with add-ons', () => {
      const addOns: PricingItem[] = [
        { id: 'addon1', price: 50 },
        { id: 'addon2', price: 30 }
      ];

      const breakdown = service.calculatePackageTotal(200, addOns, 25);

      expect(breakdown.subtotal).toBe(305); // 200 + 50 + 30 + 25
      expect(breakdown.travelCost).toBe(25);
    });

    it('should calculate package without add-ons or travel', () => {
      const breakdown = service.calculatePackageTotal(200, []);

      expect(breakdown.subtotal).toBe(200);
      expect(breakdown.travelCost).toBeUndefined();
    });
  });

  describe('calculateTieredDiscount', () => {
    it('should apply 15% discount for 10+ items', () => {
      const discounted = service.calculateTieredDiscount(100, 10);
      expect(discounted).toBe(85);
    });

    it('should apply 10% discount for 5-9 items', () => {
      const discounted = service.calculateTieredDiscount(100, 5);
      expect(discounted).toBe(90);
    });

    it('should apply 5% discount for 3-4 items', () => {
      const discounted = service.calculateTieredDiscount(100, 3);
      expect(discounted).toBe(95);
    });

    it('should not apply discount for less than 3 items', () => {
      const discounted = service.calculateTieredDiscount(100, 2);
      expect(discounted).toBe(100);
    });
  });
});

describe('PhotoEditingPricingService', () => {
  const service = new PhotoEditingPricingService();

  describe('calculateEditingCosts', () => {
    it('should calculate costs with volume discount', () => {
      const breakdown = service.calculateEditingCosts(50, 10);
      
      // 50 photos at €10 each with 30% discount = €350
      expect(breakdown.subtotal).toBe(350);
    });

    it('should include editing options', () => {
      const options: PricingItem[] = [
        { id: 'option1', price: 50 }
      ];

      const breakdown = service.calculateEditingCosts(10, 10, options);
      
      // 10 photos at €9 each (10% discount) + €50 option = €140
      expect(breakdown.subtotal).toBe(140);
    });
  });
});

describe('VirtualStagingPricingService', () => {
  const service = new VirtualStagingPricingService();

  describe('calculateStagingCosts', () => {
    it('should calculate costs for single variation', () => {
      const breakdown = service.calculateStagingCosts(3, 50, 1);
      expect(breakdown.subtotal).toBe(150); // 3 rooms * €50
    });

    it('should calculate costs for multiple variations', () => {
      const breakdown = service.calculateStagingCosts(3, 50, 3);
      
      // 3 rooms * €50 * (1 + (3-1) * 0.5) = €300
      expect(breakdown.subtotal).toBe(300);
    });
  });
});

describe('EnergyCertificatePricingService', () => {
  const service = new EnergyCertificatePricingService();

  describe('calculateCertificateCost', () => {
    it('should calculate cost for Verbrauchsausweis', () => {
      const breakdown = service.calculateCertificateCost('verbrauchsausweis');
      expect(breakdown.subtotal).toBe(99);
    });

    it('should calculate cost for Bedarfsausweis', () => {
      const breakdown = service.calculateCertificateCost('bedarfsausweis');
      expect(breakdown.subtotal).toBe(149);
    });

    it('should include tax in total', () => {
      const breakdown = service.calculateCertificateCost('verbrauchsausweis');
      expect(breakdown.total).toBe(117.81); // 99 * 1.19
    });
  });
});
