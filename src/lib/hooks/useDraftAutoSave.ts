import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { OrderState } from './useOrderState';

interface AutoSaveOptions {
  enabled: boolean;
  intervalMs?: number;
}

/**
 * Custom hook for auto-saving draft order progress
 * Saves to database every 30 seconds and shows toast notifications
 */
export const useDraftAutoSave = (
  orderState: OrderState,
  options: AutoSaveOptions = { enabled: true, intervalMs: 30000 }
) => {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const previousStateRef = useRef<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveDraftOrder = async () => {
    if (!orderState.draftOrderId || isSaving) return;

    // Check if state has actually changed
    const currentStateString = JSON.stringify({
      category: orderState.selectedCategory,
      products: orderState.selectedProducts,
      package: orderState.selectedPackage,
      address: orderState.address,
      step: orderState.step
    });

    if (currentStateString === previousStateRef.current) {
      return; // No changes, skip save
    }

    try {
      setIsSaving(true);

      // Calculate total amount from selected products and package
      let totalAmount = 0;
      
      // Add package price if selected
      if (orderState.selectedPackage) {
        // Would need to look up package price - for now using a placeholder
        totalAmount += 0; // Package price would be calculated here
      }
      
      // Add products total
      Object.values(orderState.selectedProducts).forEach(product => {
        totalAmount += product.totalPrice;
      });

      // Add travel cost
      totalAmount += orderState.travelCost;

      // Update the draft order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          total_amount: totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderState.draftOrderId);

      if (orderError) throw orderError;

      // Update address if filled
      if (orderState.address.strasse && orderState.address.plz) {
        const { data: existingAddress } = await supabase
          .from('addresses')
          .select('id')
          .eq('order_id', orderState.draftOrderId)
          .maybeSingle();

        if (existingAddress) {
          // Update existing address
          await supabase
            .from('addresses')
            .update({
              strasse: orderState.address.strasse,
              hausnummer: orderState.address.hausnummer || '',
              plz: orderState.address.plz,
              stadt: orderState.address.stadt,
              additional_info: orderState.address.additional_info || '',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingAddress.id);
        }
      }

      // Update state reference
      previousStateRef.current = currentStateString;
      const now = new Date();
      setLastSaved(now);

      // Show success toast
      toast({
        title: 'Entwurf gespeichert',
        description: `Zuletzt gespeichert: ${now.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Silently fail - don't interrupt user experience
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!options.enabled || !orderState.draftOrderId) {
      return;
    }

    // Initial save after 5 seconds
    const initialTimeout = setTimeout(() => {
      saveDraftOrder();
    }, 5000);

    // Set up interval for periodic saves
    intervalRef.current = setInterval(() => {
      saveDraftOrder();
    }, options.intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    orderState.selectedCategory,
    orderState.selectedProducts,
    orderState.selectedPackage,
    orderState.address,
    orderState.step,
    orderState.draftOrderId,
    options.enabled
  ]);

  // Manual save function that can be called programmatically
  const saveNow = async () => {
    await saveDraftOrder();
  };

  return {
    lastSaved,
    isSaving,
    saveNow
  };
};
