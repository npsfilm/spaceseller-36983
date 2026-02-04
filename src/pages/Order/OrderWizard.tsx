import { useNavigate } from 'react-router-dom';
import { OrderLayout } from '@/components/OrderLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOrderState, type Service, type OrderState } from '@/lib/hooks/useOrderState';
import { useDraftAutoSave } from '@/lib/hooks/useDraftAutoSave';
import { orderSubmissionService } from '@/lib/services/OrderSubmissionService';
import { orderValidationService } from '@/lib/services/OrderValidationService';
import { ProgressIndicator } from './components/ProgressIndicator';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';
import { OrderStepRouter } from './components/OrderStepRouter';
import { OrderNavigationBar } from './components/OrderNavigationBar';

// Re-export types for backward compatibility
export type { Service, OrderState };

// Dynamic step configurations based on category
const getStepsForCategory = (category: string | null) => {
  if (category === 'onsite') {
    return [
      { number: 1, title: 'Standort', description: 'Objektadresse' },
      { number: 2, title: 'Kategorie', description: 'Dienstleistung' },
      { number: 3, title: 'Paket', description: 'Aufnahmepaket wählen' },
      { number: 4, title: 'Zusatzleistungen', description: 'Optionale Services' },
      { number: 5, title: 'Termin', description: 'Wunschdatum' },
      { number: 6, title: 'Zusammenfassung', description: 'Bestellung abschließen' }
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
    setPackage,
    toggleAddOn,
    setScheduling,
    setSpecialInstructions,
    setTermsAcceptance,
    goToStep
  } = useOrderState();

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-save draft every 30 seconds
  const { lastSaved, isSaving, saveNow } = useDraftAutoSave(orderState, {
    enabled: true,
    intervalMs: 30000
  });

  const handleStepClick = (targetStep: number) => {
    if (targetStep < orderState.step) {
      goToStep(targetStep);
      toast({
        title: 'Schritt gewechselt',
        description: `Sie sind zurück zu Schritt ${targetStep}`,
        duration: 2000,
      });
    }
  };

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
      navigate(`/order/confirmation/${result.orderId}`);
    } else {
      toast({
        title: "Fehler",
        description: result.error || "Beim Aufgeben der Bestellung ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

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
        {/* Progress Indicator with Auto-Save Status */}
        <div className="relative">
          <ProgressIndicator
            steps={getStepsForCategory(orderState.selectedCategory)}
            currentStep={orderState.step}
            onStepClick={handleStepClick}
          />
          
          {orderState.step > 1 && (
            <AutoSaveIndicator
              variant="desktop"
              isSaving={isSaving}
              lastSaved={lastSaved}
              onSaveNow={saveNow}
            />
          )}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <OrderStepRouter
            orderState={orderState}
            services={services}
            categoryLabel={getCategoryLabel()}
            onLocationValidated={handleLocationValidated}
            onUpdateAddress={updateAddressField}
            onSelectCategory={setCategory}
            onAreaRangeChange={setAreaRange}
            onProductToggle={toggleProduct}
            onPackageSelect={setPackage}
            onAddOnToggle={toggleAddOn}
            onSchedulingChange={setScheduling}
            onSpecialInstructionsChange={setSpecialInstructions}
            onTermsChange={setTermsAcceptance}
          />
        </div>

        {/* Navigation */}
        <OrderNavigationBar
          orderState={orderState}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleSubmitOrder}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </div>
    </OrderLayout>
  );
};
