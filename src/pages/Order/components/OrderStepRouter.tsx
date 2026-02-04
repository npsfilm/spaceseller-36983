import { useNavigate } from 'react-router-dom';
import type { OrderState, Service } from '@/lib/hooks/useOrderState';
import { OrderSummarySidebar } from '@/components/order/OrderSummarySidebar';
import { LocationCheckStep } from '../steps/LocationCheckStep';
import { CategorySelectionStep } from '../steps/CategorySelectionStep';
import { ProductConfigurationStep } from '../steps/ProductConfigurationStep';
import { PhotographyPackageSelectionStep } from '../steps/PhotographyPackageSelectionStep';
import { PhotographyAddOnsStep } from '../steps/PhotographyAddOnsStep';
import { PhotographySchedulingStep } from '../steps/PhotographySchedulingStep';
import { PhotographySummaryStep } from '../steps/PhotographySummaryStep';

interface SchedulingData {
  primaryDate?: Date | null;
  primaryTime?: string | null;
  alternativeDate?: Date | null;
  alternativeTime?: string | null;
}

interface OrderStepRouterProps {
  orderState: OrderState;
  services: Service[];
  categoryLabel: string;
  
  // Location step callbacks
  onLocationValidated: (travelCost: number, distance: number, available: boolean) => void;
  onUpdateAddress: (field: string, value: string) => void;
  
  // Category step callbacks
  onSelectCategory: (categoryId: string) => void;
  
  // Configuration callbacks
  onAreaRangeChange: (range: string) => void;
  onProductToggle: (serviceId: string, qty: number, price: number) => void;
  onPackageSelect: (packageId: string | null) => void;
  onAddOnToggle: (addOnId: string) => void;
  onSchedulingChange: (data: SchedulingData) => void;
  onSpecialInstructionsChange: (text: string) => void;
  onTermsChange: (agb: boolean, privacy: boolean) => void;
}

/**
 * Centralized step routing component for the order wizard
 * Replaces nested conditionals with a clean switch-based approach
 */
export const OrderStepRouter = ({
  orderState,
  services,
  categoryLabel,
  onLocationValidated,
  onUpdateAddress,
  onSelectCategory,
  onAreaRangeChange,
  onProductToggle,
  onPackageSelect,
  onAddOnToggle,
  onSchedulingChange,
  onSpecialInstructionsChange,
  onTermsChange
}: OrderStepRouterProps) => {
  const navigate = useNavigate();
  const { step, selectedCategory } = orderState;

  // Step 1: Location Check (always first)
  if (step === 1) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <LocationCheckStep
          address={orderState.address}
          onUpdateAddress={onUpdateAddress}
          onLocationValidated={onLocationValidated}
          onBack={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // Step 2: Category Selection (always second)
  if (step === 2) {
    return (
      <div className="w-full px-[15%]">
        <CategorySelectionStep
          services={services}
          onSelectCategory={onSelectCategory}
          selectedCategory={selectedCategory || undefined}
        />
      </div>
    );
  }

  // Photography Flow (steps 3-6)
  if (selectedCategory === 'onsite') {
    switch (step) {
      case 3:
        return (
          <div className="w-full">
            <PhotographyPackageSelectionStep
              selectedPackage={orderState.selectedPackage}
              onPackageSelect={onPackageSelect}
            />
          </div>
        );
      
      case 4:
        return (
          <div className="w-full">
            <PhotographyAddOnsStep
              selectedAddOns={orderState.selectedAddOns}
              onAddOnToggle={onAddOnToggle}
            />
          </div>
        );
      
      case 5:
        return (
          <div className="w-full">
            <PhotographySchedulingStep
              primaryDate={orderState.primaryDate}
              primaryTime={orderState.primaryTime}
              alternativeDate={orderState.alternativeDate}
              alternativeTime={orderState.alternativeTime}
              onPrimaryDateChange={(date) => onSchedulingChange({ primaryDate: date })}
              onPrimaryTimeChange={(time) => onSchedulingChange({ primaryTime: time })}
              onAlternativeDateChange={(date) => onSchedulingChange({ alternativeDate: date })}
              onAlternativeTimeChange={(time) => onSchedulingChange({ alternativeTime: time })}
            />
          </div>
        );
      
      case 6:
        return (
          <div className="w-full">
            <PhotographySummaryStep
              selectedPackage={orderState.selectedPackage}
              selectedAddOns={orderState.selectedAddOns}
              travelCost={orderState.travelCost}
              primaryDate={orderState.primaryDate}
              primaryTime={orderState.primaryTime}
              alternativeDate={orderState.alternativeDate}
              alternativeTime={orderState.alternativeTime}
              address={orderState.address}
              specialInstructions={orderState.specialInstructions}
              agbAccepted={orderState.agbAccepted}
              privacyAccepted={orderState.privacyAccepted}
              onSpecialInstructionsChange={onSpecialInstructionsChange}
              onAgbChange={(checked) => onTermsChange(checked, orderState.privacyAccepted)}
              onPrivacyChange={(checked) => onTermsChange(orderState.agbAccepted, checked)}
            />
          </div>
        );
      
      default:
        return null;
    }
  }

  // Other Categories (step 3): Two-column layout with sidebar
  if (step === 3) {
    return (
      <div className="flex gap-8 container mx-auto max-w-7xl p-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <ProductConfigurationStep
            category={selectedCategory}
            services={services}
            selectedAreaRange={orderState.selectedAreaRange}
            selectedProducts={orderState.selectedProducts}
            selectedPackage={orderState.selectedPackage}
            travelCost={orderState.travelCost}
            onAreaRangeChange={onAreaRangeChange}
            onProductToggle={onProductToggle}
            onPackageSelect={onPackageSelect}
          />
        </div>

        {/* Sticky Sidebar (Desktop Only) */}
        <OrderSummarySidebar 
          orderState={orderState}
          categoryLabel={categoryLabel}
        />
      </div>
    );
  }

  return null;
};
