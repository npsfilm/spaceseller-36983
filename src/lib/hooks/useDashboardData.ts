import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardDataService, DashboardStats } from '@/lib/services/DashboardDataService';

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery<DashboardStats | null>({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return dashboardDataService.fetchDashboardStats(user.id);
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};

export const useOrderCount = () => {
  const { user } = useAuth();

  return useQuery<number>({
    queryKey: ['order-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return dashboardDataService.countUserOrders(user.id);
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};

export const useUserStatus = () => {
  const { data: orderCount, isLoading } = useOrderCount();

  const status = orderCount !== undefined 
    ? dashboardDataService.getUserStatus(orderCount)
    : { hasNoOrders: false, isNewUser: false };

  return {
    ...status,
    orderCount: orderCount || 0,
    isLoading
  };
};
