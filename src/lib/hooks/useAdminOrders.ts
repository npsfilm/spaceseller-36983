import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminOrderService, type Order, type DashboardStats } from '@/lib/services/AdminOrderService';
import { QUERY_KEYS, STALE_TIMES, GC_TIMES } from '@/lib/queryConfig';
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing admin order data and operations
 * Migrated to React Query for better caching and state management
 */
export const useAdminOrders = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch orders using React Query
  const { 
    data: orders = [], 
    isLoading: loading,
    error 
  } = useQuery({
    queryKey: QUERY_KEYS.adminOrders(),
    queryFn: () => adminOrderService.fetchAllOrders(),
    staleTime: STALE_TIMES.orders,
    gcTime: GC_TIMES.default,
  });

  // Calculate stats from orders (memoized)
  const stats = useMemo<DashboardStats>(() => {
    return adminOrderService.calculateStats(orders);
  }, [orders]);

  // Filter orders based on search and status (memoized)
  const filteredOrders = useMemo(() => {
    return adminOrderService.filterOrders(orders, searchQuery, statusFilter);
  }, [orders, searchQuery, statusFilter]);

  // Refresh function that invalidates the cache
  const refreshOrders = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminOrders() });
  };

  return {
    orders,
    filteredOrders,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshOrders,
  };
};
