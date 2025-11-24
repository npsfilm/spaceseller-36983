import { OrderItem } from './OrderDetailService';

/**
 * Service to calculate suggested payment amounts for photographers
 * based on the order's service packages and tiers
 */
export class PhotographerPaymentCalculator {
  /**
   * Payment rates by package tier (in euros)
   */
  private readonly paymentRates = {
    budget: 80,      // Basic/Budget packages
    standard: 120,   // Standard packages
    premium: 180,    // Premium/Pro packages
    enterprise: 250, // Enterprise/Premium+ packages
  };

  /**
   * Add-on rates (in euros)
   */
  private readonly addOnRates = {
    twilight: 40,
    drone: 50,
    virtual_tour: 30,
    video: 60,
  };

  /**
   * Calculate suggested photographer payment based on order items
   * @param items - Order items from the order
   * @returns Suggested payment amount in euros
   */
  calculateSuggestedPayment(items: OrderItem[]): number {
    let totalPayment = 0;

    for (const item of items) {
      // Parse item notes which contains package information
      const notes = this.parseItemNotes(item.item_notes);
      
      if (notes) {
        // Determine tier and calculate base payment
        const tier = this.determineTier(notes);
        totalPayment += this.paymentRates[tier] || this.paymentRates.standard;

        // Add extra for high photo counts
        if (notes.photo_count && notes.photo_count > 20) {
          totalPayment += 30; // Extra for large shoots
        }
      } else {
        // Fallback: estimate based on service price
        totalPayment += this.estimateFromPrice(item.unit_price);
      }
    }

    return Math.round(totalPayment);
  }

  /**
   * Parse item notes JSON string
   */
  private parseItemNotes(notes: string | null): any {
    if (!notes) return null;
    try {
      return JSON.parse(notes);
    } catch {
      return null;
    }
  }

  /**
   * Determine package tier from notes
   */
  private determineTier(notes: any): keyof typeof this.paymentRates {
    const tier = notes.tier?.toLowerCase() || '';
    const packageId = notes.package_id?.toLowerCase() || '';

    if (tier === 'budget' || packageId.includes('basic')) {
      return 'budget';
    } else if (tier === 'premium' || packageId.includes('premium') || packageId.includes('pro')) {
      return 'premium';
    } else if (tier === 'enterprise' || packageId.includes('enterprise')) {
      return 'enterprise';
    }
    
    return 'standard';
  }

  /**
   * Estimate payment from service price when notes aren't available
   */
  private estimateFromPrice(price: number): number {
    // Rough estimation: 40-50% of service price goes to photographer
    return Math.round(price * 0.45);
  }
}

// Export singleton instance
export const photographerPaymentCalculator = new PhotographerPaymentCalculator();
