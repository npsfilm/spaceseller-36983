import { useState, useMemo } from 'react';
import { Camera } from 'lucide-react';
import { PackageType } from '@/types/photography';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';
import { filterPackagesByType } from '@/lib/photographyPricing';
import { photographyPricingService } from '@/lib/services/CategoryPricingService';
import { ConfigurationHeader, PricingSummaryPanel, type LineItem } from '../components/shared';
import { PackageTypeFilter } from '../components/PackageTypeFilter';
import { PhotoCountSlider } from '../components/PhotoCountSlider';
import { PackageCarousel } from '../components/PackageCarousel';
import { AddOnsList } from '../components/AddOnsList';

interface PhotographyConfigStepProps {
  selectedPackage: string | null;
  travelCost: number;
  onPackageSelect: (packageId: string | null) => void;
}


export const PhotographyConfigStep = ({
  selectedPackage,
  travelCost,
  onPackageSelect
}: PhotographyConfigStepProps) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [packageType, setPackageType] = useState<PackageType>('photo');
  const [photoCount, setPhotoCount] = useState<number>(10);

  const handlePackageTypeChange = (type: PackageType) => {
    setPackageType(type);
    onPackageSelect(null); // Reset selection when changing type
  };

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId === selectedPackage ? null : packageId);
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const filteredPackages = useMemo(() => {
    const typeFiltered = filterPackagesByType(PACKAGE_TIERS, packageType);
    
    // For photo packages, show exactly 3 packages: closest match + one above + one below
    if (packageType === 'photo') {
      const sorted = [...typeFiltered].sort((a, b) => a.photoCount - b.photoCount);
      
      // Find the index of the closest matching package
      const closestIndex = sorted.findIndex(pkg => pkg.photoCount >= photoCount);
      
      if (closestIndex === -1) {
        // All packages are below the selected count, show last 3
        return sorted.slice(-3);
      }
      
      if (closestIndex === 0) {
        // Selected count is at or below the first package, show first 3
        return sorted.slice(0, 3);
      }
      
      // Show the closest package, one below, and one above
      return sorted.slice(closestIndex - 1, closestIndex + 2);
    }
    
    return typeFiltered;
  }, [packageType, photoCount]);
  const selectedPackageData = filteredPackages.find(p => p.id === selectedPackage);
  
  const selectedAddOnsData = selectedAddOns
    .map(id => ADD_ONS.find(a => a.id === id))
    .filter(Boolean) as typeof ADD_ONS;

  // Calculate pricing using photography pricing service
  const pricingBreakdown = useMemo(() => {
    if (!selectedPackageData) return null;

    const addOnItems = selectedAddOnsData.map(addOn => ({
      id: addOn.id,
      price: addOn.price,
      quantity: 1
    }));

    return photographyPricingService.calculatePackageTotal(
      selectedPackageData.price,
      addOnItems,
      travelCost
    );
  }, [selectedPackageData, selectedAddOnsData, travelCost]);

  // Build line items for summary panel
  const summaryItems: LineItem[] = useMemo(() => {
    const items: LineItem[] = [];

    if (selectedPackageData) {
      items.push({
        id: 'package',
        label: `${selectedPackageData.name} (${selectedPackageData.photoCount} Fotos)`,
        price: selectedPackageData.price
      });
    }

    selectedAddOnsData.forEach(addOn => {
      items.push({
        id: addOn.id,
        label: addOn.name,
        price: addOn.price
      });
    });

    return items;
  }, [selectedPackageData, selectedAddOnsData]);

  const additionalFees: LineItem[] = useMemo(() => {
    if (travelCost > 0) {
      return [{
        id: 'travel',
        label: 'Anfahrt inkludiert',
        price: 0 // Show as included, already in subtotal
      }];
    }
    return [];
  }, [travelCost]);

  return (
    <div className="space-y-8 py-8">
      <ConfigurationHeader
        icon={Camera}
        title="Wählen Sie Ihr Fotografie-Paket"
        description="Professionelle Immobilienfotografie für aussagekräftige Exposés"
      />

      <PackageTypeFilter 
        packageType={packageType} 
        onPackageTypeChange={handlePackageTypeChange}
      />

      {packageType === 'photo' && (
        <PhotoCountSlider 
          photoCount={photoCount} 
          onPhotoCountChange={setPhotoCount}
        />
      )}

      <PackageCarousel
        packages={filteredPackages}
        selectedPackageId={selectedPackage}
        onPackageSelect={handlePackageSelect}
      />

      <AddOnsList
        addOns={ADD_ONS}
        selectedAddOnIds={selectedAddOns}
        onAddOnToggle={handleAddOnToggle}
      />

      {selectedPackage && pricingBreakdown && (
        <PricingSummaryPanel
          items={summaryItems}
          subtotal={pricingBreakdown.subtotal}
          additionalFees={additionalFees}
          emptyMessage="Bitte wählen Sie ein Paket aus"
        />
      )}
    </div>
  );
};
