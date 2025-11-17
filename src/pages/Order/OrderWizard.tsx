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
}

const STEPS = [
  { number: 1, title: 'Standort', description: 'Adresseingabe' },
  { number: 2, title: 'Kategorie', description: 'Dienstleistungsart' }
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
    locationValidated: false
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
    setOrderState(prev => ({ ...prev, step: Math.min(prev.step + 1, 2) }));
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

            {/* Step 2: Category Selection - Auto-submit after selection */}
            {orderState.step === 2 && (
              <CategorySelectionStep
                services={services}
                onSelectCategory={async (categoryId) => {
                  setOrderState(prev => ({
                    ...prev,
                    selectedCategory: categoryId
                  }));
                  
                  // Auto-submit order after category selection
                  await submitSimplifiedOrder(categoryId);
                }}
                selectedCategory={orderState.selectedCategory}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-border bg-card p-4">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            {/* Back Button - only show in step 2 */}
            {orderState.step === 2 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
            ) : (
              <div />
            )}

            {/* Next Button - Step 1 only (Step 2 auto-submits) */}
            {orderState.step === 1 && (
              <Button
                variant="cta"
                onClick={nextStep}
                disabled={!orderState.locationValidated}
                className="gap-2"
              >
                Weiter
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </OrderLayout>
  );
};
