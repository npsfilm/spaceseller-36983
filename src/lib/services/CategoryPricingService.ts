/**
 * Unified pricing calculation service for all order categories
 * Provides consistent pricing logic and tax calculation
 */

export interface PricingItem {
  id: string;
  price: number;
  quantity?: number;
}

export interface PricingBreakdown {
  items: PricingItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  travelCost?: number;
}

export interface CategoryPricingStrategy {
  calculateSubtotal(items: PricingItem[], additionalFees?: number): number;
  calculateTotal(subtotal: number, taxRate?: number): number;
  getBreakdown(items: PricingItem[], additionalFees?: number, taxRate?: number): PricingBreakdown;
}

/**
 * Base pricing service with common calculations
 */
export class CategoryPricingService implements CategoryPricingStrategy {
  protected readonly defaultTaxRate = 0.19; // 19% VAT

  /**
   * Calculate subtotal from pricing items
   */
  calculateSubtotal(items: PricingItem[], additionalFees: number = 0): number {
    const itemsTotal = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + (item.price * quantity);
    }, 0);

    return itemsTotal + additionalFees;
  }

  /**
   * Calculate total including tax
   */
  calculateTotal(subtotal: number, taxRate: number = this.defaultTaxRate): number {
    const taxAmount = subtotal * taxRate;
    return subtotal + taxAmount;
  }

  /**
   * Get complete pricing breakdown
   */
  getBreakdown(
    items: PricingItem[],
    additionalFees: number = 0,
    taxRate: number = this.defaultTaxRate
  ): PricingBreakdown {
    const subtotal = this.calculateSubtotal(items, additionalFees);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return {
      items,
      subtotal,
      taxAmount,
      total,
      travelCost: additionalFees > 0 ? additionalFees : undefined
    };
  }
}

/**
 * Photography-specific pricing strategy
 * Includes package pricing, add-ons, and travel costs
 */
export class PhotographyPricingService extends CategoryPricingService {
  /**
   * Calculate photography package total with add-ons
   */
  calculatePackageTotal(
    packagePrice: number,
    addOns: PricingItem[],
    travelCost: number = 0
  ): PricingBreakdown {
    const packageItem: PricingItem = {
      id: 'package',
      price: packagePrice,
      quantity: 1
    };

    return this.getBreakdown([packageItem, ...addOns], travelCost);
  }

  /**
   * Calculate tiered discount for multiple items
   */
  calculateTieredDiscount(basePrice: number, quantity: number): number {
    if (quantity >= 10) return basePrice * 0.85; // 15% discount
    if (quantity >= 5) return basePrice * 0.90;  // 10% discount
    if (quantity >= 3) return basePrice * 0.95;  // 5% discount
    return basePrice;
  }
}

/**
 * Photo editing pricing strategy
 * Includes per-photo pricing and bulk discounts
 */
export class PhotoEditingPricingService extends CategoryPricingService {
  /**
   * Calculate editing costs with volume discounts
   */
  calculateEditingCosts(
    photoCount: number,
    pricePerPhoto: number,
    options: PricingItem[] = []
  ): PricingBreakdown {
    const discountedPrice = this.applyVolumeDiscount(photoCount, pricePerPhoto);
    const totalEditingCost = photoCount * discountedPrice;

    const editingItem: PricingItem = {
      id: 'photo-editing',
      price: totalEditingCost,
      quantity: 1
    };

    return this.getBreakdown([editingItem, ...options]);
  }

  /**
   * Apply volume-based discount
   */
  private applyVolumeDiscount(photoCount: number, basePrice: number): number {
    if (photoCount >= 50) return basePrice * 0.70;  // 30% discount
    if (photoCount >= 25) return basePrice * 0.80;  // 20% discount
    if (photoCount >= 10) return basePrice * 0.90;  // 10% discount
    return basePrice;
  }
}

/**
 * Virtual staging pricing strategy
 * Includes per-room pricing and style variations
 */
export class VirtualStagingPricingService extends CategoryPricingService {
  /**
   * Calculate staging costs per room
   */
  calculateStagingCosts(
    roomCount: number,
    pricePerRoom: number,
    variations: number = 1
  ): PricingBreakdown {
    const baseRoomCost = roomCount * pricePerRoom;
    const variationMultiplier = variations > 1 ? 1 + ((variations - 1) * 0.5) : 1;
    const totalCost = baseRoomCost * variationMultiplier;

    const stagingItem: PricingItem = {
      id: 'virtual-staging',
      price: totalCost,
      quantity: 1
    };

    return this.getBreakdown([stagingItem]);
  }
}

/**
 * Energy certificate pricing strategy
 * Fixed pricing per certificate type
 */
export class EnergyCertificatePricingService extends CategoryPricingService {
  /**
   * Calculate certificate costs
   */
  calculateCertificateCost(certificateType: 'verbrauchsausweis' | 'bedarfsausweis'): PricingBreakdown {
    const prices = {
      verbrauchsausweis: 99,
      bedarfsausweis: 149
    };

    const certificateItem: PricingItem = {
      id: `certificate-${certificateType}`,
      price: prices[certificateType],
      quantity: 1
    };

    return this.getBreakdown([certificateItem]);
  }
}

// Export singleton instances for each category
export const photographyPricingService = new PhotographyPricingService();
export const photoEditingPricingService = new PhotoEditingPricingService();
export const virtualStagingPricingService = new VirtualStagingPricingService();
export const energyCertificatePricingService = new EnergyCertificatePricingService();

// Export base service for custom implementations
export const categoryPricingService = new CategoryPricingService();
