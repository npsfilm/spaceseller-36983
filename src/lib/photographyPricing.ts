import { PackageType, PackageTier, AddOn, PropertySize } from '@/types/photography';

/**
 * Filters package tiers by the selected package type
 * @param packages - Array of all available package tiers
 * @param type - The package type to filter by ('photo', 'drone', or 'photo_drone')
 * @returns Filtered array of packages matching the type
 */
export const filterPackagesByType = (
  packages: PackageTier[],
  type: PackageType
): PackageTier[] => {
  return packages.filter(p => p.type === type);
};

/**
 * Gets recommended packages based on property size and package type
 * @param packages - Array of all available package tiers
 * @param packageType - The package type to filter by
 * @param propertySize - Optional property size to filter by
 * @returns Array of recommended packages (3 packages)
 */
export const getRecommendedPackages = (
  packages: PackageTier[],
  packageType: PackageType,
  propertySize?: PropertySize | null
): PackageTier[] => {
  // First filter by package type
  const typeFiltered = filterPackagesByType(packages, packageType);
  
  // If no property size filter, show one from each tier
  if (!propertySize) {
    const budget = typeFiltered.find(p => p.tier === 'budget');
    const standard = typeFiltered.find(p => p.popular === true) || typeFiltered.find(p => p.tier === 'standard');
    const premium = typeFiltered.find(p => p.tier === 'premium');
    
    return [budget, standard, premium].filter(Boolean) as PackageTier[];
  }
  
  // Define photo count ranges for each property size
  const sizeMap: Record<PropertySize, { min: number; max: number }> = {
    klein: { min: 5, max: 15 },
    mittel: { min: 10, max: 25 },
    gross: { min: 20, max: 100 }
  };
  
  const range = sizeMap[propertySize];
  
  // Filter by size range and return up to 3 packages
  const sizeFiltered = typeFiltered
    .filter(p => p.photoCount >= range.min && p.photoCount <= range.max)
    .sort((a, b) => a.photoCount - b.photoCount);
  
  // Return up to 3 packages, prioritizing popular ones
  if (sizeFiltered.length <= 3) {
    return sizeFiltered;
  }
  
  // If more than 3, try to include the popular one and surrounding packages
  const popularIndex = sizeFiltered.findIndex(p => p.popular === true);
  if (popularIndex !== -1) {
    // Return popular + 1 before + 1 after if possible
    const start = Math.max(0, popularIndex - 1);
    return sizeFiltered.slice(start, start + 3);
  }
  
  // Otherwise return first 3
  return sizeFiltered.slice(0, 3);
};

/**
 * Calculates the total price of selected add-ons
 * @param selectedAddOnIds - Array of selected add-on IDs
 * @param addOns - Array of all available add-ons
 * @returns Total price of selected add-ons
 */
export const calculateAddOnsTotal = (
  selectedAddOnIds: string[],
  addOns: AddOn[]
): number => {
  return selectedAddOnIds.reduce((sum, id) => {
    const addOn = addOns.find(a => a.id === id);
    return sum + (addOn?.price || 0);
  }, 0);
};

/**
 * Calculates the total price including package, add-ons, and travel cost
 * @param packagePrice - Base price of the selected package
 * @param addOnsTotal - Total price of selected add-ons
 * @param travelCost - Travel cost (already calculated based on location)
 * @returns Total price including all components
 */
export const calculateTotalPrice = (
  packagePrice: number,
  addOnsTotal: number,
  travelCost: number
): number => {
  return packagePrice + addOnsTotal + travelCost;
};
