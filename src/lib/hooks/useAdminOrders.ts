import { useState, useEffect } from 'react';
import { adminOrderService, type Order, type DashboardStats } from '@/lib/services/AdminOrderService';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for managing admin order data and operations
 */
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = adminOrderService.filterOrders(orders, searchQuery, statusFilter);
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.fetchAllOrders();
      setOrders(data);
      
      const calculatedStats = adminOrderService.calculateStats(data);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Fehler',
        description: 'Bestellungen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  return {
    orders,
    filteredOrders,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshOrders,
  };
};
