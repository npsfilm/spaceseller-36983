import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedThisMonth: number;
  totalSpent: number;
}

export interface OrderSummary {
  status: string;
  total_amount: number;
  created_at: string;
}

export class DashboardDataService {
  /**
   * Fetch all orders for a user (excluding drafts)
   */
  async fetchUserOrders(userId: string): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount, created_at')
      .eq('user_id', userId)
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Count non-draft orders for a user
   */
  async countUserOrders(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to count orders: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Calculate dashboard statistics from order data
   */
  calculateStats(orders: OrderSummary[]): DashboardStats {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalOrders = orders.length;
    
    const activeOrders = orders.filter(
      o => o.status === 'submitted' || o.status === 'in_progress'
    ).length;
    
    const completedThisMonth = orders.filter(
      o => o.status === 'completed' && new Date(o.created_at) >= startOfThisMonth
    ).length;
    
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total_amount), 
      0
    );

    return {
      totalOrders,
      activeOrders,
      completedThisMonth,
      totalSpent
    };
  }

  /**
   * Fetch and calculate dashboard statistics for a user
   */
  async fetchDashboardStats(userId: string): Promise<DashboardStats> {
    const orders = await this.fetchUserOrders(userId);
    return this.calculateStats(orders);
  }

  /**
   * Determine user status based on order count
   */
  getUserStatus(orderCount: number): {
    hasNoOrders: boolean;
    isNewUser: boolean;
  } {
    return {
      hasNoOrders: orderCount === 0,
      isNewUser: orderCount < 3
    };
  }
}

export const dashboardDataService = new DashboardDataService();
