import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderLayout } from '@/components/OrderLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOrderState, type Service, type OrderState } from '@/lib/hooks/useOrderState';
import { orderSubmissionService } from '@/lib/services/OrderSubmissionService';
import { orderValidationService } from '@/lib/services/OrderValidationService';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LocationCheckStep } from './steps/LocationCheckStep';
import { CategorySelectionStep } from './steps/CategorySelectionStep';
import { ProductConfigurationStep } from './steps/ProductConfigurationStep';
import { OrderSummarySidebar } from '@/components/order/OrderSummarySidebar';

// Re-export types for backward compatibility
export type { Service, OrderState };

// Dynamic step configurations based on category
const getStepsForCategory = (category: string | null) => {
  if (category === 'onsite') {
    return [
      { number: 1, title: 'Standort', description: 'Objektadresse' },
      { number: 2, title: 'Kategorie', description: 'Dienstleistung' },
      { number: 3, title: 'Konfiguration', description: 'Aufnahmepaket' }
    ];
  } else if (category === 'photo_editing') {
    return [
      { number: 1, title: 'Standort', description: 'Adresseingabe' },
      { number: 2, title: 'Kategorie', description: 'Dienstleistung' },
      { number: 3, title: 'Konfiguration', description: 'Bild-Upload & Optionen' }
    ];
  } else if (category === 'virtual_staging') {
    return [
      { number: 1, title: 'Standort', description: 'Adresseingabe' },
      { number: 2, title: 'Kategorie', description: 'Dienstleistung' },
      { number: 3, title: 'Konfiguration', description: 'Raum-Upload & Stil' }
    ];
  } else if (category === 'energy_certificate') {
    return [
      { number: 1, title: 'Standort', description: 'Objektadresse' },
      { number: 2, title: 'Kategorie', description: 'Dienstleistung' },
      { number: 3, title: 'Konfiguration', description: 'Dokumenten-Upload' }
    ];
  }
  
  return [
    { number: 1, title: 'Standort', description: 'Adresseingabe' },
    { number: 2, title: 'Kategorie', description: 'Dienstleistungsart' },
    { number: 3, title: 'Konfiguration', description: 'Auswahl' }
  ];
};

export const OrderWizard = () => {
  const {
    services,
    orderState,
    nextStep,
    prevStep,
    updateAddressField,
    setLocationValidation,
    setCategory,
    setAreaRange,
    toggleProduct,
    setPackage
  } = useOrderState();

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLocationValidated = (
    travelCost: number,
    distance: number,
    photographyAvailable: boolean
  ) => {
    setLocationValidation(travelCost, distance, photographyAvailable);
    nextStep();
  };

  const handleSubmitOrder = async () => {
    if (!user || !orderState.selectedCategory) return;

    // Validate order before submission
    if (!orderValidationService.canSubmitOrder(orderState)) {
      const validation = orderValidationService.validateOrder(orderState);
      toast({
        title: "Unvollständige Bestellung",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    const result = await orderSubmissionService.submitOrder(
      user.id,
      orderState,
      orderState.selectedCategory
    );

    if (result.success) {
      toast({
        title: "Bestellung erfolgreich!",
        description: "Ihre Bestellung wurde erfolgreich aufgegeben."
      });
      navigate(`/order-confirmation?orderId=${result.orderId}`);
    } else {
      toast({
        title: "Fehler",
        description: result.error || "Beim Aufgeben der Bestellung ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  // Get category label for sidebar
  const getCategoryLabel = () => {
    if (!orderState.selectedCategory) return 'Dienstleistung';
    const labels: Record<string, string> = {
      onsite: 'Aufnahme vor Ort',
      photo_editing: 'Fotobearbeitung',
      virtual_staging: 'Virtuelles Staging',
      energy_certificate: 'Energieausweis'
    };
    return labels[orderState.selectedCategory] || 'Dienstleistung';
  };

  return (
    <OrderLayout>
      <div className="h-full flex flex-col">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={getStepsForCategory(orderState.selectedCategory)}
          currentStep={orderState.step}
          onStepClick={() => {}}
        />

        {/* Step Content with Sidebar Layout */}
        <div className="flex-1 overflow-y-auto">
          {orderState.step === 3 ? (
            // Step 3: Two-column layout with sticky sidebar on desktop
            <div className="flex gap-8 container mx-auto max-w-7xl p-6">
              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <ProductConfigurationStep
                  category={orderState.selectedCategory}
                  services={services}
                  selectedAreaRange={orderState.selectedAreaRange}
                  selectedProducts={orderState.selectedProducts}
                  selectedPackage={orderState.selectedPackage}
                  travelCost={orderState.travelCost}
                  onAreaRangeChange={setAreaRange}
                  onProductToggle={toggleProduct}
                  onPackageSelect={setPackage}
                />
              </div>

              {/* Sticky Sidebar (Desktop Only) */}
              <OrderSummarySidebar 
                orderState={orderState}
                categoryLabel={getCategoryLabel()}
              />
            </div>
          ) : (
            // Steps 1 & 2: Full-width layout without sidebar
            <div className={orderState.step === 2 ? "w-full px-[15%]" : "container mx-auto max-w-4xl p-6"}>
              {/* Step 1: Location Check */}
              {orderState.step === 1 && (
                <LocationCheckStep
                  address={orderState.address}
                  onUpdateAddress={updateAddressField}
                  onLocationValidated={handleLocationValidated}
                  onBack={() => navigate('/dashboard')}
                />
              )}

              {/* Step 2: Category Selection */}
              {orderState.step === 2 && (
                <CategorySelectionStep
                  services={services}
                  onSelectCategory={setCategory}
                  selectedCategory={orderState.selectedCategory || undefined}
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-border bg-card p-4">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            {orderState.step > 1 ? (
              <Button variant="outline" onClick={prevStep} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
            ) : <div />}

            {orderState.step === 1 && (
              <Button 
                variant="cta" 
                onClick={nextStep} 
                disabled={!orderValidationService.canNavigateToStep(1, orderState)} 
                className="gap-2"
              >
                Weiter
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {orderState.step === 2 && orderState.selectedCategory && (
              <Button variant="cta" onClick={nextStep} className="gap-2">
                Weiter
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {orderState.step === 3 && (
              <Button 
                variant="cta" 
                onClick={handleSubmitOrder} 
                disabled={!orderValidationService.canSubmitOrder(orderState)} 
                className="gap-2"
              >
                Bestellung aufgeben
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </OrderLayout>
  );
};
