import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderState } from '@/lib/hooks/useOrderState';
import { orderValidationService } from '@/lib/services/OrderValidationService';
import { AutoSaveIndicator } from './AutoSaveIndicator';

interface OrderNavigationBarProps {
  orderState: OrderState;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

/**
 * Centralized navigation bar for the order wizard
 * Handles all navigation states and validation logic
 */
export const OrderNavigationBar = ({
  orderState,
  onPrevStep,
  onNextStep,
  onSubmit,
  isSaving = false,
  lastSaved = null
}: OrderNavigationBarProps) => {
  const { step, selectedCategory } = orderState;

  // Determine button visibility
  const showBackButton = step > 1;
  
  // Show "Weiter" button for steps 1-2 and photography steps 3-5
  const showNextButton = 
    step === 1 || 
    step === 2 || 
    (selectedCategory === 'onsite' && step >= 3 && step <= 5);
  
  // Show "Bestellung aufgeben" button
  const showSubmitButton = 
    (selectedCategory === 'onsite' && step === 6) || 
    (selectedCategory !== 'onsite' && step === 3);

  // Determine disabled states
  const getNextButtonDisabled = () => {
    switch (step) {
      case 1:
        return !orderValidationService.canNavigateToStep(1, orderState);
      case 2:
        return !selectedCategory;
      case 3:
        return selectedCategory === 'onsite' && !orderState.selectedPackage;
      case 5:
        return !orderState.primaryDate || !orderState.primaryTime;
      default:
        return false;
    }
  };

  const getSubmitButtonDisabled = () => {
    if (selectedCategory === 'onsite') {
      return !orderState.agbAccepted || !orderState.privacyAccepted;
    }
    return !orderValidationService.canSubmitOrder(orderState);
  };

  const handleNextClick = () => {
    if (step === 2) {
      console.log('Weiter button clicked - Category:', selectedCategory);
    }
    if (selectedCategory || step !== 2) {
      onNextStep();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        {/* Mobile Auto-Save Status */}
        {step > 1 && (
          <AutoSaveIndicator
            variant="mobile"
            isSaving={isSaving}
            lastSaved={lastSaved}
            onSaveNow={() => {}} // Mobile doesn't have manual save button
          />
        )}

        {/* Back Button */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button variant="outline" onClick={onPrevStep} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          ) : <div />}
        </div>

        {/* Next/Submit Button */}
        {showNextButton && (
          <Button 
            variant="cta" 
            onClick={handleNextClick} 
            disabled={getNextButtonDisabled()}
            className="gap-2"
          >
            Weiter
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {showSubmitButton && (
          <Button 
            variant="cta" 
            onClick={onSubmit} 
            disabled={getSubmitButtonDisabled()}
            className="gap-2"
          >
            Bestellung aufgeben
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
