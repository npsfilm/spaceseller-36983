import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProgressIndicator } from './components/ProgressIndicator';
import { CategorySelectionStep } from './steps/CategorySelectionStep';
import { LocationCheckStep } from './steps/LocationCheckStep';
import { ServiceSelectionStep } from './steps/ServiceSelectionStep';
import { UpgradesStep } from './steps/UpgradesStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { PropertyDetailsStep } from './steps/PropertyDetailsStep';
import { FileUploadStep } from './steps/FileUploadStep';
import { ReviewStep } from './steps/ReviewStep';
import { PricingCalculator } from './components/PricingCalculator';

export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  base_price: number;
  unit: string;
  features: string[];
}

export interface ServiceConfig {
  serviceId: string;
  quantity: number;
  preferredDate?: string;
  turnaround?: 'standard' | 'express';
  notes?: string;
}

export interface SelectedUpgrade {
  upgradeId: string;
  quantity: number;
  price: number;
}

export interface OrderState {
  step: number;
  selectedCategory: string | null;
  selectedServices: Record<string, ServiceConfig>;
  selectedUpgrades: SelectedUpgrade[];
  virtualStagingCount: number;
  address: {
    strasse: string;
    hausnummer: string;
    plz: string;
    stadt: string;
    additional_info: string;
  };
  uploads: any[];
  specialInstructions: string;
  draftOrderId: string | null;
  travelCost: number;
  distance: number;
  locationValidated: boolean;
}

const STEPS = [
  { number: 1, title: 'Services', description: 'Wählen Sie Services' },
  { number: 2, title: 'Upgrades', description: 'Optionale Extras' },
  { number: 3, title: 'Konfiguration', description: 'Details angeben' },
  { number: 4, title: 'Adresse', description: 'Objektdetails' },
  { number: 5, title: 'Upload', description: 'Bilder hochladen' },
  { number: 6, title: 'Prüfung', description: 'Bestellung prüfen' }
];

export const OrderWizard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [orderState, setOrderState] = useState<OrderState>({
    step: 1,
    selectedCategory: null,
    selectedServices: {},
    selectedUpgrades: [],
    virtualStagingCount: 0,
    address: {
      strasse: '',
      hausnummer: '',
      plz: '',
      stadt: '',
      additional_info: ''
    },
    uploads: [],
    specialInstructions: '',
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

  const calculateTotal = () => {
    // Service costs
    const servicesTotal = Object.values(orderState.selectedServices).reduce((total, config) => {
      const service = services.find(s => s.id === config.serviceId);
      const basePrice = (service?.base_price || 0) * config.quantity;
      const expressCharge = config.turnaround === 'express' ? 50 : 0;
      return total + basePrice + expressCharge;
    }, 0);
    
    // Upgrades costs
    const upgradesTotal = orderState.selectedUpgrades.reduce((total, upgrade) => {
      return total + (upgrade.price * upgrade.quantity);
    }, 0);

    // Virtual staging with package pricing
    let virtualStagingTotal = 0;
    if (orderState.virtualStagingCount > 0) {
      const count = orderState.virtualStagingCount;
      if (count === 1) virtualStagingTotal = 89;
      else if (count === 3) virtualStagingTotal = 249;
      else if (count >= 5) virtualStagingTotal = 399;
      else virtualStagingTotal = 89 * count;
    }
    
    return servicesTotal + upgradesTotal + virtualStagingTotal + orderState.travelCost;
  };

  const nextStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.min(prev.step + 1, 6) }));
  };

  const prevStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const goToStep = (step: number) => {
    if (step <= orderState.step) {
      setOrderState(prev => ({ ...prev, step }));
    }
  };

  const updateSelectedServices = (services: Record<string, ServiceConfig>) => {
    setOrderState(prev => ({ ...prev, selectedServices: services }));
  };

  const updateAddress = (address: OrderState['address']) => {
    setOrderState(prev => ({ ...prev, address }));
  };

  const updateUploads = (uploads: any[]) => {
    setOrderState(prev => ({ ...prev, uploads }));
  };

  const updateSpecialInstructions = (instructions: string) => {
    setOrderState(prev => ({ ...prev, specialInstructions: instructions }));
  };

  const updateUpgrades = (upgrades: SelectedUpgrade[]) => {
    setOrderState(prev => ({ ...prev, selectedUpgrades: upgrades }));
  };

  const updateVirtualStagingCount = (count: number) => {
    setOrderState(prev => ({ ...prev, virtualStagingCount: count }));
  };

  const selectCategory = (category: string) => {
    setOrderState(prev => ({ ...prev, selectedCategory: category }));
  };

  const backToCategories = () => {
    setOrderState(prev => ({ 
      ...prev, 
      selectedCategory: null,
      locationValidated: false,
      travelCost: 0,
      distance: 0
    }));
  };

  const handleLocationValidated = (travelCost: number, distance: number) => {
    setOrderState(prev => ({
      ...prev,
      locationValidated: true,
      travelCost,
      distance
    }));
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

  const backToLocationCheck = () => {
    setOrderState(prev => ({
      ...prev,
      locationValidated: false
    }));
  };

  const submitOrder = async () => {
    if (!orderState.draftOrderId) return;

    try {
      // Create order items
      const orderItems = Object.values(orderState.selectedServices).map(config => {
        const service = services.find(s => s.id === config.serviceId);
        const basePrice = service?.base_price || 0;
        const expressCharge = config.turnaround === 'express' ? 50 : 0;
        return {
          order_id: orderState.draftOrderId,
          service_id: config.serviceId,
          quantity: config.quantity,
          unit_price: basePrice,
          total_price: (basePrice * config.quantity) + expressCharge,
          item_notes: config.notes
        };
      });

      await supabase.from('order_items').insert(orderItems);

      // Create order upgrades
      if (orderState.selectedUpgrades.length > 0) {
        const orderUpgrades = orderState.selectedUpgrades.map(upgrade => ({
          order_id: orderState.draftOrderId,
          upgrade_id: upgrade.upgradeId,
          quantity: upgrade.quantity,
          unit_price: upgrade.price,
          total_price: upgrade.price * upgrade.quantity
        }));
        await supabase.from('order_upgrades').insert(orderUpgrades);
      }

      // Add virtual staging as upgrade if selected
      if (orderState.virtualStagingCount > 0) {
        const count = orderState.virtualStagingCount;
        let totalPrice = 0;
        let pricePerImage = 0;
        
        // Use package pricing
        if (count === 1) {
          totalPrice = 89;
          pricePerImage = 89;
        } else if (count === 3) {
          totalPrice = 249;
          pricePerImage = 83; // 249/3
        } else if (count >= 5) {
          totalPrice = 399;
          pricePerImage = 79.80; // 399/5
        } else {
          pricePerImage = 89;
          totalPrice = 89 * count;
        }

        // Get virtual staging upgrade ID
        const { data: stagingUpgrade } = await supabase
          .from('upgrades')
          .select('id')
          .eq('name', 'Virtual Staging')
          .single();

        if (stagingUpgrade) {
          await supabase.from('order_upgrades').insert({
            order_id: orderState.draftOrderId,
            upgrade_id: stagingUpgrade.id,
            quantity: orderState.virtualStagingCount,
            unit_price: pricePerImage,
            total_price: totalPrice
          });
        }
      }

      // Save address if provided
      const hasPhotography = Object.values(orderState.selectedServices).some(config => {
        const service = services.find(s => s.id === config.serviceId);
        return service?.category === 'photography';
      });

      if (hasPhotography && orderState.address.strasse) {
        await supabase.from('addresses').insert({
          order_id: orderState.draftOrderId,
          user_id: user?.id,
          address_type: 'shooting_location',
          ...orderState.address
        });
      }

      // Update order
      const deliveryDeadline = new Date();
      deliveryDeadline.setHours(deliveryDeadline.getHours() + 48);

      const { data: orderData } = await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: calculateTotal(),
          delivery_deadline: deliveryDeadline.toISOString(),
          special_instructions: orderState.specialInstructions
        })
        .eq('id', orderState.draftOrderId)
        .select()
        .single();

      // Notify all admins about the new order
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (adminRoles && adminRoles.length > 0) {
        const notifications = adminRoles.map(admin => ({
          user_id: admin.user_id,
          type: 'new_order',
          title: 'Neue Bestellung eingegangen',
          message: `Bestellung #${orderData?.order_number || 'N/A'} wurde soeben aufgegeben.`,
          link: '/admin-backend'
        }));
        
        await (supabase as any).from('notifications').insert(notifications);
      }

      toast({
        title: 'Bestellung erfolgreich!',
        description: 'Ihre Bestellung wurde aufgegeben'
      });

      navigate(`/order/confirmation/${orderState.draftOrderId}`);
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const hasSelectedServices = Object.keys(orderState.selectedServices).length > 0;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Progress Indicator */}
          <ProgressIndicator 
            steps={STEPS} 
            currentStep={orderState.step} 
            onStepClick={goToStep}
          />

          {/* Step Content */}
          <div className="mt-12">
            <AnimatePresence mode="wait" custom={orderState.step}>
              <motion.div
                key={orderState.step}
                custom={orderState.step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                {orderState.step === 1 && !orderState.selectedCategory && (
                  <CategorySelectionStep
                    services={services}
                    onSelectCategory={selectCategory}
                  />
                )}
                {orderState.step === 1 && orderState.selectedCategory === 'photography' && !orderState.locationValidated && (
                  <LocationCheckStep
                    address={orderState.address}
                    onUpdateAddress={handleUpdateAddressField}
                    onLocationValidated={handleLocationValidated}
                    onBack={backToCategories}
                  />
                )}
                {orderState.step === 1 && orderState.selectedCategory && (orderState.selectedCategory !== 'photography' || orderState.locationValidated) && (
                  <ServiceSelectionStep
                    services={services}
                    selectedServices={orderState.selectedServices}
                    onUpdateServices={updateSelectedServices}
                    onNext={nextStep}
                    category={orderState.selectedCategory}
                    onBackToCategories={orderState.selectedCategory === 'photography' ? backToLocationCheck : backToCategories}
                  />
                )}
                {orderState.step === 2 && (
                  <UpgradesStep
                    selectedUpgrades={orderState.selectedUpgrades}
                    onUpdateUpgrades={updateUpgrades}
                    virtualStagingCount={orderState.virtualStagingCount}
                    onUpdateVirtualStagingCount={updateVirtualStagingCount}
                    onNext={nextStep}
                    onBack={prevStep}
                    category={orderState.selectedCategory || ''}
                  />
                )}
                {orderState.step === 3 && (
                  <ConfigurationStep
                    services={services}
                    selectedServices={orderState.selectedServices}
                    onUpdateServices={updateSelectedServices}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}
                {orderState.step === 4 && (
                  <PropertyDetailsStep
                    address={orderState.address}
                    onUpdateAddress={updateAddress}
                    onNext={nextStep}
                    onBack={prevStep}
                    hasPhotography={Object.values(orderState.selectedServices).some(config => {
                      const service = services.find(s => s.id === config.serviceId);
                      return service?.category === 'photography';
                    })}
                  />
                )}
                {orderState.step === 5 && (
                  <FileUploadStep
                    orderId={orderState.draftOrderId || ''}
                    uploads={orderState.uploads}
                    onUpdateUploads={updateUploads}
                    onNext={nextStep}
                    onBack={prevStep}
                    hasEditingServices={Object.values(orderState.selectedServices).some(config => {
                      const service = services.find(s => s.id === config.serviceId);
                      return service?.category !== 'photography';
                    })}
                  />
                )}
                {orderState.step === 6 && (
                  <ReviewStep
                    services={services}
                    orderState={orderState}
                    onUpdateInstructions={updateSpecialInstructions}
                    onBack={prevStep}
                    onSubmit={submitOrder}
                    calculateTotal={calculateTotal}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Action Bar */}
          {hasSelectedServices && (
            <PricingCalculator
              selectedServices={orderState.selectedServices}
              services={services}
              total={calculateTotal()}
              step={orderState.step}
              travelCost={orderState.travelCost}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};
