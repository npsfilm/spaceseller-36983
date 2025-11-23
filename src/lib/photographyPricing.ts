import { PackageType, PackageTier, AddOn } from '@/types/photography';

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
