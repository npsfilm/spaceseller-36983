import { useState, useMemo } from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { PackageType, PropertySize } from '@/types/photography';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';
import { filterPackagesByType, getRecommendedPackages } from '@/lib/photographyPricing';
import { photographyPricingService } from '@/lib/services/CategoryPricingService';
import { ConfigurationHeader, PricingSummaryPanel, type LineItem } from '../components/shared';
import { PackageTypeFilter } from '../components/PackageTypeFilter';
import { PropertySizeSelector } from '../components/PropertySizeSelector';
import { PhotographyPackageCard } from '../components/PhotographyPackageCard';
import { AddOnsList } from '../components/AddOnsList';
import { SpecialInstructionsField } from '@/components/order/SpecialInstructionsField';
import { Button } from '@/components/ui/button';

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
  const [propertySize, setPropertySize] = useState<PropertySize | null>(null);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handlePackageTypeChange = (type: PackageType) => {
    setPackageType(type);
    setPropertySize(null); // Reset property size
    setShowAllPackages(false); // Reset show all
    onPackageSelect(null); // Reset selection when changing type
  };

  const handlePropertySizeChange = (size: PropertySize) => {
    setPropertySize(size);
    setShowAllPackages(false); // Reset show all when size changes
    onPackageSelect(null); // Reset selection
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

  // Get packages to display based on recommendation logic
  const displayedPackages = useMemo(() => {
    if (showAllPackages) {
      // Show all packages sorted by photo count
      const typeFiltered = filterPackagesByType(PACKAGE_TIERS, packageType);
      return typeFiltered.sort((a, b) => a.photoCount - b.photoCount);
    } else {
      // Show recommended packages (max 3)
      return getRecommendedPackages(PACKAGE_TIERS, packageType, propertySize);
    }
  }, [packageType, propertySize, showAllPackages]);

  // Get total count of packages for "show all" button
  const totalPackageCount = useMemo(() => {
    return filterPackagesByType(PACKAGE_TIERS, packageType).length;
  }, [packageType]);

  const selectedPackageData = PACKAGE_TIERS.find(p => p.id === selectedPackage);
  
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

  // Get description for current package type
  const getPackageTypeDescription = () => {
    switch (packageType) {
      case 'photo':
        return 'Professionelle Immobilienfotografie mit verschiedenen Bildanzahlen';
      case 'drone':
        return 'Beeindruckende Luftaufnahmen Ihrer Immobilie';
      case 'photo_drone':
        return 'Kombination aus Foto und Drohne mit attraktivem Preisvorteil';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-12 py-8">
      <ConfigurationHeader
        icon={Camera}
        title="Wählen Sie Ihr Fotografie-Paket"
        description="Professionelle Immobilienfotografie für aussagekräftige Exposés"
      />

      {/* Service Type Selection */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-2">Art der Aufnahme</h3>
          <p className="text-muted-foreground">
            Wählen Sie zwischen Foto, Drohne oder einer Kombination beider Services
          </p>
        </div>
        
        <PackageTypeFilter 
          packageType={packageType} 
          onPackageTypeChange={handlePackageTypeChange}
        />
      </div>

      {/* Property Size Selector */}
      <div className="max-w-5xl mx-auto px-4">
        <PropertySizeSelector
          selectedSize={propertySize}
          onSizeChange={handlePropertySizeChange}
        />
      </div>

      {/* Package Selection */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-2">
            {!propertySize && 'Empfohlene Pakete'}
            {propertySize && 'Passende Pakete für Ihre Immobilie'}
          </h3>
          <p className="text-muted-foreground">
            {!propertySize && 'Unsere beliebtesten Optionen für jede Objektgröße'}
            {propertySize && getPackageTypeDescription()}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPackages.map((pkg) => (
              <PhotographyPackageCard
                key={pkg.id}
                packageData={pkg}
                isSelected={selectedPackage === pkg.id}
                isExactMatch={false}
                onSelect={() => handlePackageSelect(pkg.id)}
              />
            ))}
          </div>

          {/* Show All Button */}
          {!showAllPackages && displayedPackages.length < totalPackageCount && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAllPackages(true)}
                className="gap-2"
              >
                Passt noch nicht? Alle {totalPackageCount} Pakete durchsuchen
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Show Less Button */}
          {showAllPackages && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAllPackages(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="gap-2"
              >
                Weniger anzeigen
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add-ons Section */}
      <AddOnsList
        addOns={ADD_ONS}
        selectedAddOnIds={selectedAddOns}
        onAddOnToggle={handleAddOnToggle}
      />

      {/* Pricing Summary */}
      {selectedPackage && pricingBreakdown && (
        <PricingSummaryPanel
          items={summaryItems}
          subtotal={pricingBreakdown.subtotal}
          additionalFees={additionalFees}
          emptyMessage="Bitte wählen Sie ein Paket aus"
        />
      )}

      {/* Special Instructions */}
      <div className="max-w-3xl mx-auto px-4">
        <SpecialInstructionsField
          value={specialInstructions}
          onChange={setSpecialInstructions}
        />
      </div>
    </div>
  );
};
