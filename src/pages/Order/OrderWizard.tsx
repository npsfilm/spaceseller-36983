import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderLayout } from '@/components/OrderLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LocationCheckStep } from './steps/LocationCheckStep';
import { CategorySelectionStep } from './steps/CategorySelectionStep';
import { ServiceSelectionStep } from './steps/ServiceSelectionStep';
import { UpgradesStep } from './steps/UpgradesStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { PropertyDetailsStep } from './steps/PropertyDetailsStep';
import { FileUploadStep } from './steps/FileUploadStep';
import { ReviewStep } from './steps/ReviewStep';
import { PricingSidebar } from './components/PricingSidebar';

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
  photographyAvailable: boolean;
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
  { number: 1, title: 'Standort', description: 'Adresseingabe' },
  { number: 2, title: 'Kategorie', description: 'Dienstleistungsart' },
  { number: 3, title: 'Services', description: 'Auswahl' },
  { number: 4, title: 'Konfiguration', description: 'Details' },
  { number: 5, title: 'Objektdaten', description: 'Upload' },
  { number: 6, title: 'Prüfung', description: 'Abschluss' }
];

export const OrderWizard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [orderState, setOrderState] = useState<OrderState>({
    step: 1,
    selectedCategory: null,
    selectedServices: {},
    selectedUpgrades: [],
    virtualStagingCount: 0,
    photographyAvailable: true,
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

  const handleLocationValidated = (travelCost: number, distance: number, photographyAvailable: boolean) => {
    setOrderState(prev => ({
      ...prev,
      locationValidated: true,
      travelCost,
      distance,
      photographyAvailable
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
    <OrderLayout>
      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Indicator */}
          <ProgressIndicator 
            steps={STEPS}
            currentStep={orderState.step}
            onStepClick={goToStep}
          />

          {/* Content Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto max-w-6xl px-4 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={orderState.step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 1: Location Check (Address Input) */}
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
                      selectedCategory={orderState.selectedCategory}
                    />
                  )}

                  {/* Step 3: Service Selection */}
                  {orderState.step === 3 && (
                    <ServiceSelectionStep
                        services={services.filter(s => {
                          const category = orderState.selectedCategory;
                          if (category === 'onsite') {
                            return ['photography', 'drone', 'virtual_tour'].includes(s.category);
                          }
                          if (category === 'rendering_editing') {
                            return ['editing', 'floor_plan', 'rendering'].includes(s.category);
                          }
                          if (category === 'virtual_staging') {
                            return s.category === 'virtual_staging';
                          }
                          if (category === 'energy_certificate') {
                            return s.category === 'energy_certificate';
                          }
                          return true;
                        })}
                        selectedServices={orderState.selectedServices}
                        onUpdateServices={updateSelectedServices}
                        onNext={nextStep}
                      photographyAvailable={orderState.photographyAvailable}
                    />
                  )}

                  {/* Step 4: Configuration + Upgrades Combined */}
                  {orderState.step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Konfiguration & Upgrades</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Passen Sie Ihre Services an und wählen Sie optionale Extras
                        </p>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-4">
                        {/* Left: Configuration */}
                        <div className="space-y-3">
                          <h3 className="text-base font-semibold">Service-Details</h3>
                          <ConfigurationStep
                            services={services}
                            selectedServices={orderState.selectedServices}
                            onUpdateServices={updateSelectedServices}
                            onNext={nextStep}
                            onBack={prevStep}
                          />
                        </div>

                        {/* Right: Upgrades */}
                        <div className="space-y-3">
                          <h3 className="text-base font-semibold">Optionale Extras</h3>
                          <UpgradesStep
                            selectedUpgrades={orderState.selectedUpgrades}
                            onUpdateUpgrades={updateUpgrades}
                            virtualStagingCount={orderState.virtualStagingCount}
                            onUpdateVirtualStagingCount={updateVirtualStagingCount}
                            onNext={nextStep}
                            onBack={prevStep}
                            category={orderState.selectedCategory || ''}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Property Details + Upload Combined */}
                  {orderState.step === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Objektdaten</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Geben Sie die Objektadresse ein und laden Sie Dateien hoch
                        </p>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-4">
                        {/* Left: Address */}
                        <div className="space-y-3">
                          <h3 className="text-base font-semibold">Adresse</h3>
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
                        </div>

                        {/* Right: File Upload */}
                        <div className="space-y-3">
                          <h3 className="text-base font-semibold">Dateien hochladen</h3>
                          <FileUploadStep
                            orderId={orderState.draftOrderId || ''}
                            uploads={orderState.uploads}
                            onUpdateUploads={updateUploads}
                            onNext={nextStep}
                            onBack={prevStep}
                            hasEditingServices={Object.values(orderState.selectedServices).some(config => {
                              const service = services.find(s => s.id === config.serviceId);
                              return service?.category === 'editing' || service?.category === 'virtual_staging';
                            })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Review */}
                  {orderState.step === 6 && (
                    <motion.div
                      key="step-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="h-full"
                    >
                      <ReviewStep
                        services={services}
                        orderState={orderState}
                        onUpdateInstructions={updateSpecialInstructions}
                        onBack={prevStep}
                        onSubmit={submitOrder}
                        calculateTotal={calculateTotal}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Pricing Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <PricingSidebar
            selectedServices={orderState.selectedServices}
            services={services}
            total={calculateTotal()}
            step={orderState.step}
            travelCost={orderState.travelCost}
            address={orderState.address}
            locationValidated={orderState.locationValidated}
          />
        </div>
      </div>

      {/* Mobile Pricing Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Gesamt</p>
            <p className="text-lg font-bold text-primary">€{calculateTotal().toFixed(2)}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(orderState.selectedServices).length} Services
          </p>
        </div>
      </div>
    </OrderLayout>
  );
};
