import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { orderDataService, Order } from '@/lib/services/OrderDataService';
import { useState, useMemo } from 'react';

export const useUserOrders = () => {
  const { user } = useAuth();

  return useQuery<Order[]>({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return orderDataService.fetchUserOrders(user.id);
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

export const useOrderSearch = (orders: Order[] = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orderDataService.filterOrders(orders, searchTerm);
  }, [orders, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredOrders
  };
};

export const useOrderStats = (orders: Order[] = []) => {
  return useMemo(() => {
    const grouped = orderDataService.groupOrdersByStatus(orders);
    
    return {
      total: orders.length,
      submitted: grouped.submitted.length,
      inProgress: grouped.in_progress.length,
      completed: grouped.completed.length,
      delivered: grouped.delivered.length,
      cancelled: grouped.cancelled.length,
      grouped
    };
  }, [orders]);
};
