import { PackageTierCard } from './PackageTierCard';

interface PackageTierListProps {
  selectedAreaRange: string | null;
  selectedPackage: string | null;
  onPackageSelect: (packageId: string | null) => void;
}

export const PackageTierList = ({
  selectedAreaRange,
  selectedPackage,
  onPackageSelect
}: PackageTierListProps) => {
  const packageTiers = [
    { id: 'pkg-2', units: 2, currentPrice: 258, originalPrice: 298 },
    { id: 'pkg-3', units: 3, currentPrice: 367, originalPrice: 447 },
    { id: 'pkg-4', units: 4, currentPrice: 476, originalPrice: 596 },
    { id: 'pkg-5', units: 5, currentPrice: 585, originalPrice: 745 },
    { id: 'pkg-6', units: 6, currentPrice: 694, originalPrice: 894 },
    { id: 'pkg-7', units: 7, currentPrice: 803, originalPrice: 1043 },
    { id: 'pkg-8', units: 8, currentPrice: 912, originalPrice: 1192 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Foto - Mehrere Wohnungen an einer Adresse {selectedAreaRange ? `(${selectedAreaRange} m²)` : ''}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {packageTiers.map((tier) => {
          const isSelected = selectedPackage === tier.id;
          
          return (
            <PackageTierCard
              key={tier.id}
              units={tier.units}
              currentPrice={tier.currentPrice}
              originalPrice={tier.originalPrice}
              isSelected={isSelected}
              onToggle={() => {
                if (isSelected) {
                  onPackageSelect(null);
                } else {
                  onPackageSelect(tier.id);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
