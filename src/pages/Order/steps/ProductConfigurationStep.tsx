import { PhotographyConfigStep } from './PhotographyConfigStep';
import { PhotoEditingConfigStep } from './PhotoEditingConfigStep';
import { VirtualStagingConfigStep } from './VirtualStagingConfigStep';
import { EnergyCertificateConfigStep } from './EnergyCertificateConfigStep';
import type { Service } from '../OrderWizard';

interface ProductConfigurationStepProps {
  category: string | null;
  services: Service[];
  selectedAreaRange: string | null;
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  selectedPackage: string | null;
  travelCost: number;
  onAreaRangeChange: (range: string) => void;
  onProductToggle: (serviceId: string, quantity: number, unitPrice: number) => void;
  onPackageSelect: (packageId: string | null) => void;
}

export const ProductConfigurationStep = (props: ProductConfigurationStepProps) => {
  const { category, selectedPackage, travelCost, onPackageSelect } = props;

  // Route to category-specific configuration component
  switch (category) {
    case 'onsite':
      return (
        <PhotographyConfigStep 
          selectedPackage={selectedPackage}
          travelCost={travelCost}
          onPackageSelect={onPackageSelect}
        />
      );
    case 'photo_editing':
      return <PhotoEditingConfigStep />;
    case 'virtual_staging':
      return <VirtualStagingConfigStep />;
    case 'energy_certificate':
      return <EnergyCertificateConfigStep />;
    default:
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-lg">
              Bitte wählen Sie zuerst eine Kategorie aus
            </p>
          </div>
        </div>
      );
  }
};
