import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: string;
  quantity: number;
  services: {
    name: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  delivery_deadline?: string;
  order_items?: OrderItem[];
}

export const STATUS_COLORS = {
  draft: 'bg-gray-500',
  submitted: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  delivered: 'bg-teal-500',
  cancelled: 'bg-red-500'
} as const;

export const STATUS_LABELS = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
  delivered: 'Geliefert',
  cancelled: 'Storniert'
} as const;

export class OrderDataService {
  /**
   * Fetch all non-draft orders for a user with their items and services
   */
  async fetchUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          services (name)
        )
      `)
      .eq('user_id', userId)
      .neq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Filter orders by search term (order number)
   */
  filterOrders(orders: Order[], searchTerm: string): Order[] {
    if (!searchTerm.trim()) {
      return orders;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.order_number.toLowerCase().includes(lowerSearch)
    );
  }

  /**
   * Get status color class for a given order status
   */
  getStatusColor(status: Order['status']): string {
    return STATUS_COLORS[status] || STATUS_COLORS.draft;
  }

  /**
   * Get status label (German) for a given order status
   */
  getStatusLabel(status: Order['status']): string {
    return STATUS_LABELS[status] || STATUS_LABELS.draft;
  }

  /**
   * Format date in German locale
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  /**
   * Format short date in German locale
   */
  formatShortDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE');
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number): string {
    return `€${amount.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * Check if order can be downloaded (status is delivered)
   */
  canDownloadOrder(order: Order): boolean {
    return order.status === 'delivered';
  }

  /**
   * Get total items count for an order
   */
  getTotalItemsCount(order: Order): number {
    if (!order.order_items) return 0;
    return order.order_items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Sort orders by creation date
   */
  sortOrdersByDate(orders: Order[], ascending = false): Order[] {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group orders by status
   */
  groupOrdersByStatus(orders: Order[]): Record<Order['status'], Order[]> {
    const grouped: Record<string, Order[]> = {
      draft: [],
      submitted: [],
      in_progress: [],
      completed: [],
      delivered: [],
      cancelled: []
    };

    orders.forEach(order => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });

    return grouped as Record<Order['status'], Order[]>;
  }
}

export const orderDataService = new OrderDataService();
