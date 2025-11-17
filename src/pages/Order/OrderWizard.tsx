import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderLayout } from '@/components/OrderLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LocationCheckStep } from './steps/LocationCheckStep';
import { CategorySelectionStep } from './steps/CategorySelectionStep';
import { ProductConfigurationStep } from './steps/ProductConfigurationStep';

export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  base_price: number;
  unit: string;
  features: string[];
}

export interface OrderState {
  step: number;
  selectedCategory: string | null;
  photographyAvailable: boolean;
  address: {
    strasse: string;
    hausnummer: string;
    plz: string;
    stadt: string;
    additional_info: string;
  };
  draftOrderId: string | null;
  travelCost: number;
  distance: number;
  locationValidated: boolean;
  selectedAreaRange: string | null;
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  selectedPackage: string | null;
}

const STEPS = [
  { number: 1, title: 'Standort', description: 'Adresseingabe' },
  { number: 2, title: 'Kategorie', description: 'Dienstleistungsart' },
  { number: 3, title: 'Konfiguration', description: 'Produkt- und Paketauswahl' }
];

export const OrderWizard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [orderState, setOrderState] = useState<OrderState>({
    step: 1,
    selectedCategory: null,
    photographyAvailable: true,
    address: {
      strasse: '',
      hausnummer: '',
      plz: '',
      stadt: '',
      additional_info: ''
    },
    draftOrderId: null,
    travelCost: 0,
    distance: 0,
    locationValidated: false,
    selectedAreaRange: null,
    selectedProducts: {},
    selectedPackage: null
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    createDraftOrder();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('base_price');
    
    if (data) {
      const formattedServices = data.map(service => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : []
      })) as Service[];
      setServices(formattedServices);
    }
  };

  const createDraftOrder = async () => {
    if (!user) return;

    const orderNumber = await generateOrderNumber();
    const { data } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'draft'
      })
      .select()
      .single();

    if (data) {
      setOrderState(prev => ({ ...prev, draftOrderId: data.id }));
    }
  };

  const generateOrderNumber = async (): Promise<string> => {
    const { data } = await supabase.rpc('generate_order_number');
    return data || `SS-${new Date().getFullYear()}-${Date.now()}`;
  };

  const nextStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.min(prev.step + 1, 3) }));
  };

  const prevStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const handleUpdateAddressField = (field: string, value: string) => {
    setOrderState(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const submitSimplifiedOrder = async (categoryId: string) => {
    if (!user || !orderState.draftOrderId) return;

    try {
      // Update draft order to submitted status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: orderState.travelCost
        })
        .eq('id', orderState.draftOrderId);

      if (orderError) throw orderError;

      // Create address record
      await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          order_id: orderState.draftOrderId,
          address_type: 'shooting_location',
          strasse: orderState.address.strasse,
          hausnummer: orderState.address.hausnummer,
          plz: orderState.address.plz,
          stadt: orderState.address.stadt,
          additional_info: orderState.address.additional_info
        });

      // Trigger admin notification
      await supabase.functions.invoke('trigger-zapier-webhook', {
        body: {
          event: 'new_order',
          order_id: orderState.draftOrderId,
          user_id: user.id,
          category: categoryId
        }
      });

      // Create admin notification
      const { data: admins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (admins) {
        await Promise.all(
          admins.map(admin =>
            supabase.from('notifications').insert({
              user_id: admin.user_id,
              type: 'new_order',
              title: 'Neue Bestellung',
              message: `Neue Bestellung wurde aufgegeben.`,
              link: `/admin-backend`
            })
          )
        );
      }

      toast({
        title: "Bestellung erfolgreich!",
        description: "Ihre Bestellung wurde erfolgreich aufgegeben."
      });

      navigate(`/order-confirmation?orderId=${orderState.draftOrderId}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Fehler",
        description: "Beim Aufgeben der Bestellung ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  return (
    <OrderLayout>
      <div className="h-full flex flex-col">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={STEPS}
          currentStep={orderState.step}
          onStepClick={() => {}}
        />

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl p-6">
            {/* Step 1: Location Check */}
            {orderState.step === 1 && (
              <LocationCheckStep
                address={orderState.address}
                onUpdateAddress={handleUpdateAddressField}
                onLocationValidated={(travelCost, distance, photographyAvailable) => {
                  setOrderState(prev => ({
                    ...prev,
                    travelCost,
                    distance,
                    photographyAvailable,
                    locationValidated: true
                  }));
                  nextStep();
                }}
                onBack={() => navigate('/dashboard')}
              />
            )}

            {/* Step 2: Category Selection */}
            {orderState.step === 2 && (
              <CategorySelectionStep
                services={services}
                onSelectCategory={(categoryId) => {
                  setOrderState(prev => ({
                    ...prev,
                    selectedCategory: categoryId
                  }));
                  nextStep();
                }}
                selectedCategory={orderState.selectedCategory || undefined}
              />
            )}

            {/* Step 3: Product Configuration */}
            {orderState.step === 3 && (
              <ProductConfigurationStep
                category={orderState.selectedCategory}
                services={services}
                selectedAreaRange={orderState.selectedAreaRange}
                selectedProducts={orderState.selectedProducts}
                selectedPackage={orderState.selectedPackage}
                travelCost={orderState.travelCost}
                onAreaRangeChange={(range) => setOrderState(prev => ({ ...prev, selectedAreaRange: range }))}
                onProductToggle={(serviceId, quantity, unitPrice) => {
                  setOrderState(prev => {
                    const newProducts = { ...prev.selectedProducts };
                    if (quantity === 0) {
                      delete newProducts[serviceId];
                    } else {
                      newProducts[serviceId] = { quantity, unitPrice, totalPrice: quantity * unitPrice };
                    }
                    return { ...prev, selectedProducts: newProducts };
                  });
                }}
                onPackageSelect={(packageId) => setOrderState(prev => ({ ...prev, selectedPackage: packageId }))}
              />
            )}
          </div>
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
              <Button variant="cta" onClick={nextStep} disabled={!orderState.locationValidated} className="gap-2">
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
              <Button variant="cta" onClick={() => submitSimplifiedOrder(orderState.selectedCategory!)} 
                disabled={Object.keys(orderState.selectedProducts).length === 0 && !orderState.selectedPackage} className="gap-2">
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
