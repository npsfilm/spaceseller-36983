import { MAPBOX_CONFIG } from '@/config/mapbox';

/**
 * Calculator for travel costs based on distance
 * 
 * Pricing rules:
 * - €0.30 per km for the first 20km
 * - €0.38 per km for each additional kilometer
 * - One-way distance only
 * - Round up to nearest €5
 */
export class TravelCostCalculator {
  private readonly costPerKmFirst20: number;
  private readonly costPerKmAfter20: number;
  private readonly firstTierKm: number;

  constructor() {
    this.costPerKmFirst20 = MAPBOX_CONFIG.costPerKmFirst20;
    this.costPerKmAfter20 = MAPBOX_CONFIG.costPerKmAfter20;
    this.firstTierKm = MAPBOX_CONFIG.firstTierKm;
  }

  /**
   * Calculate travel cost based on distance in kilometers
   * @param distanceKm - One-way distance in kilometers
   * @returns Travel cost in euros
   */
  calculateTravelCost(distanceKm: number): number {
    if (distanceKm < 0) {
      throw new Error('Distance cannot be negative');
    }

    let cost: number;
    
    if (distanceKm <= this.firstTierKm) {
      cost = distanceKm * this.costPerKmFirst20;
    } else {
      cost = (this.firstTierKm * this.costPerKmFirst20) + ((distanceKm - this.firstTierKm) * this.costPerKmAfter20);
    }
    
    // Round up to nearest 5 euros
    cost = Math.ceil(cost / 5) * 5;
    
    return cost;
  }

  /**
   * Get the first tier distance threshold
   * @returns Distance in km where pricing tier changes
   */
  getFirstTierLimit(): number {
    return this.firstTierKm;
  }
}

// Export singleton instance
export const travelCostCalculator = new TravelCostCalculator();
