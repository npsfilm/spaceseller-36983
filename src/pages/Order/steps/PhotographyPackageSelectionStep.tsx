import { useState, useMemo } from 'react';
import { Camera } from 'lucide-react';
import { PackageType, PropertySize } from '@/types/photography';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { filterPackagesByType, getRecommendedPackages } from '@/lib/photographyPricing';
import { ConfigurationHeader } from '../components/shared';
import { PackageTypeFilter } from '../components/PackageTypeFilter';
import { PropertySizeSelector } from '../components/PropertySizeSelector';
import { PhotographyPackageCard } from '../components/PhotographyPackageCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PhotographyPackageSelectionStepProps {
  selectedPackage: string | null;
  onPackageSelect: (packageId: string | null) => void;
}

export const PhotographyPackageSelectionStep = ({
  selectedPackage,
  onPackageSelect
}: PhotographyPackageSelectionStepProps) => {
  const [packageType, setPackageType] = useState<PackageType>('photo');
  const [propertySize, setPropertySize] = useState<PropertySize | null>(null);
  const [showAllPackages, setShowAllPackages] = useState(false);

  const handlePackageTypeChange = (type: PackageType) => {
    setPackageType(type);
    setPropertySize(null);
    setShowAllPackages(false);
    onPackageSelect(null);
  };

  const handlePropertySizeChange = (size: PropertySize) => {
    setPropertySize(size);
    setShowAllPackages(false);
    onPackageSelect(null);
  };

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId === selectedPackage ? null : packageId);
  };

  const displayedPackages = useMemo(() => {
    if (showAllPackages) {
      const typeFiltered = filterPackagesByType(PACKAGE_TIERS, packageType);
      return typeFiltered.sort((a, b) => a.photoCount - b.photoCount);
    } else {
      return getRecommendedPackages(PACKAGE_TIERS, packageType, propertySize);
    }
  }, [packageType, propertySize, showAllPackages]);

  const totalPackageCount = useMemo(() => {
    return filterPackagesByType(PACKAGE_TIERS, packageType).length;
  }, [packageType]);

  return (
    <div className="min-h-screen py-8">
      <ConfigurationHeader
        icon={Camera}
        title="Wählen Sie Ihr Fotografie-Paket"
        description="Professionelle Immobilienfotografie für aussagekräftige Exposés"
      />

      {/* Side-by-side Layout: Filters Left, Packages Right */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Compact Filter Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Filter</h3>
              
              {/* Art der Aufnahme */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Art der Aufnahme
                </label>
                <PackageTypeFilter 
                  packageType={packageType} 
                  onPackageTypeChange={handlePackageTypeChange}
                  compact
                />
              </div>

              {/* Property Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Wie groß ist Ihre Immobilie?
                </label>
                <PropertySizeSelector
                  selectedSize={propertySize}
                  onSizeChange={handlePropertySizeChange}
                  compact
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Package Comparison Cards */}
          <div className="lg:col-span-9 space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                {!propertySize && 'Empfohlene Pakete'}
                {propertySize && 'Passende Pakete für Ihre Immobilie'}
              </h3>
              <p className="text-muted-foreground">
                Vergleichen Sie die Leistungen und wählen Sie das passende Paket
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Show All / Show Less Buttons */}
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
      </div>
    </div>
  );
};
