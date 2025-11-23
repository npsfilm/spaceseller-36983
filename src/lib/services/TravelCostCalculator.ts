import { MAPBOX_CONFIG } from '@/config/mapbox';

/**
 * Calculator for travel costs based on distance
 * 
 * Pricing rules:
 * - €0.65 per km for distances up to 200km
 * - €0.85 per km for distances over 200km
 * - Round up to nearest €5
 * - Free if under €20
 */
export class TravelCostCalculator {
  private readonly costPerKm: number;
  private readonly costPerKmOver200: number;
  private readonly freeTravelThreshold: number;

  constructor() {
    this.costPerKm = MAPBOX_CONFIG.costPerKm;
    this.costPerKmOver200 = MAPBOX_CONFIG.costPerKmOver200;
    this.freeTravelThreshold = MAPBOX_CONFIG.freeTravelThreshold;
  }

  /**
   * Calculate travel cost based on distance in kilometers
   * @param distanceKm - One-way distance in kilometers
   * @returns Travel cost in euros (0 if below threshold)
   */
  calculateTravelCost(distanceKm: number): number {
    if (distanceKm < 0) {
      throw new Error('Distance cannot be negative');
    }

    let cost: number;
    
    if (distanceKm <= 200) {
      cost = distanceKm * this.costPerKm;
    } else {
      cost = (200 * this.costPerKm) + ((distanceKm - 200) * this.costPerKmOver200);
    }
    
    // Round up to nearest 5 euros
    cost = Math.ceil(cost / 5) * 5;
    
    // Free if under threshold
    if (cost < this.freeTravelThreshold) {
      return 0;
    }
    
    return cost;
  }

  /**
   * Calculate the breakeven distance where travel becomes chargeable
   * @returns Distance in km where cost exceeds free threshold
   */
  getFreeDistanceLimit(): number {
    // Solve: distance * costPerKm = freeTravelThreshold
    return this.freeTravelThreshold / this.costPerKm;
  }

  /**
   * Check if a distance qualifies for free travel
   */
  isFreeTravel(distanceKm: number): boolean {
    return this.calculateTravelCost(distanceKm) === 0;
  }
}

// Export singleton instance
export const travelCostCalculator = new TravelCostCalculator();
