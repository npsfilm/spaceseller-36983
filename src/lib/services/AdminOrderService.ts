import { supabase } from '@/integrations/supabase/client';

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  profiles?: {
    email: string;
    vorname: string;
    nachname: string;
    firma: string;
    telefon?: string;
  };
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedToday: number;
}

/**
 * Service for managing admin order operations
 */
export class AdminOrderService {
  /**
   * Fetch all orders with customer profile information
   */
  async fetchAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          email,
          vorname,
          nachname,
          firma,
          telefon
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  /**
   * Calculate dashboard statistics from orders
   */
  calculateStats(orders: Order[]): DashboardStats {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'submitted').length,
      inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
      completedToday: orders.filter(o => {
        const orderDate = new Date(o.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return o.status === 'completed' && orderDate.getTime() === today.getTime();
      }).length,
    };
  }

  /**
   * Filter orders by search query and status
   */
  filterOrders(
    orders: Order[],
    searchQuery: string,
    statusFilter: string
  ): Order[] {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(query) ||
        order.profiles?.email.toLowerCase().includes(query) ||
        order.profiles?.firma?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string, 
    newStatus: 'draft' | 'submitted' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  ): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) throw error;
  }
}

// Export singleton instance
export const adminOrderService = new AdminOrderService();
