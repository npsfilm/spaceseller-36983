import { useState } from 'react';
import { PackageType } from '@/types/photography';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';
import { filterPackagesByType, calculateAddOnsTotal, calculateTotalPrice } from '@/lib/photographyPricing';
import { PhotographyHeader } from '../components/PhotographyHeader';
import { PackageTypeFilter } from '../components/PackageTypeFilter';
import { PhotoCountSlider } from '../components/PhotoCountSlider';
import { PackageCarousel } from '../components/PackageCarousel';
import { AddOnsList } from '../components/AddOnsList';
import { PhotographySummaryCard } from '../components/PhotographySummaryCard';

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

  const filteredPackages = filterPackagesByType(PACKAGE_TIERS, packageType);
  const selectedPackageData = filteredPackages.find(p => p.id === selectedPackage);
  
  const addOnsTotal = calculateAddOnsTotal(selectedAddOns, ADD_ONS);
  const totalPrice = calculateTotalPrice(selectedPackageData?.price || 0, addOnsTotal, travelCost);
  
  const selectedAddOnsData = selectedAddOns
    .map(id => ADD_ONS.find(a => a.id === id))
    .filter(Boolean) as typeof ADD_ONS;

  return (
    <div className="space-y-8 py-8">
      <PhotographyHeader />

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

      {selectedPackage && selectedPackageData && (
        <PhotographySummaryCard
          selectedPackage={selectedPackageData}
          selectedAddOns={selectedAddOnsData}
          travelCost={travelCost}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
};
