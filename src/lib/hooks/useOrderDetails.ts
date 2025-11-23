import { useState, useEffect } from 'react';
import { 
  orderDetailService, 
  type OrderDetails, 
  type Photographer, 
  type Assignment 
} from '@/lib/services/OrderDetailService';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for managing order detail data and operations
 */
export const useOrderDetails = (orderId: string, open: boolean) => {
  const [details, setDetails] = useState<OrderDetails>({
    items: [],
    uploads: [],
    deliverables: [],
    addresses: [],
  });
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, orderId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orderDetails, photographersList, assignment] = await Promise.all([
        orderDetailService.fetchOrderDetails(orderId),
        orderDetailService.fetchPhotographers(),
        orderDetailService.fetchAssignment(orderId),
      ]);

      setDetails(orderDetails);
      setPhotographers(photographersList);
      setCurrentAssignment(assignment);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast({
        title: 'Fehler',
        description: 'Bestelldetails konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshDetails = async () => {
    const orderDetails = await orderDetailService.fetchOrderDetails(orderId);
    setDetails(orderDetails);
  };

  const refreshAssignment = async () => {
    const assignment = await orderDetailService.fetchAssignment(orderId);
    setCurrentAssignment(assignment);
  };

  return {
    details,
    photographers,
    currentAssignment,
    loading,
    refreshDetails,
    refreshAssignment,
  };
};
