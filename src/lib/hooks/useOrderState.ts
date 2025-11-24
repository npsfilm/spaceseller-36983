import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const initialOrderState: OrderState = {
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
};

/**
 * Custom hook for managing order wizard state and operations
 */
export const useOrderState = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [orderState, setOrderState] = useState<OrderState>(initialOrderState);
  const { user } = useAuth();

  useEffect(() => {
    loadServices();
    createDraftOrder();
  }, []);

  /**
   * Load available services from database
   */
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

  /**
   * Create a draft order for the current user
   */
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

  /**
   * Generate unique order number
   */
  const generateOrderNumber = async (): Promise<string> => {
    const { data } = await supabase.rpc('generate_order_number');
    return data || `SS-${new Date().getFullYear()}-${Date.now()}`;
  };

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.min(prev.step + 1, 3) }));
  };

  /**
   * Navigate to previous step
   */
  const prevStep = () => {
    setOrderState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  /**
   * Update a specific address field
   */
  const updateAddressField = (field: string, value: string) => {
    setOrderState(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  /**
   * Update location validation results
   */
  const setLocationValidation = (
    travelCost: number,
    distance: number,
    photographyAvailable: boolean
  ) => {
    setOrderState(prev => ({
      ...prev,
      travelCost,
      distance,
      photographyAvailable,
      locationValidated: true
    }));
  };

  /**
   * Set selected category
   */
  const setCategory = (categoryId: string) => {
    setOrderState(prev => ({
      ...prev,
      selectedCategory: categoryId
    }));
  };

  /**
   * Set selected area range
   */
  const setAreaRange = (range: string) => {
    setOrderState(prev => ({ ...prev, selectedAreaRange: range }));
  };

  /**
   * Toggle product selection
   */
  const toggleProduct = (serviceId: string, quantity: number, unitPrice: number) => {
    setOrderState(prev => {
      const newProducts = { ...prev.selectedProducts };
      if (quantity === 0) {
        delete newProducts[serviceId];
      } else {
        newProducts[serviceId] = { 
          quantity, 
          unitPrice, 
          totalPrice: quantity * unitPrice 
        };
      }
      return { ...prev, selectedProducts: newProducts };
    });
  };

  /**
   * Set selected package
   */
  const setPackage = (packageId: string) => {
    setOrderState(prev => ({ ...prev, selectedPackage: packageId }));
  };

  /**
   * Navigate to specific step (for progress indicator interaction)
   */
  const goToStep = (stepNumber: number) => {
    setOrderState(prev => ({ ...prev, step: stepNumber }));
  };

  return {
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
    goToStep
  };
};
