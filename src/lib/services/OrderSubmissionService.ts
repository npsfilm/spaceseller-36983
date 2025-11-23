import { supabase } from '@/integrations/supabase/client';
import type { OrderState } from '@/lib/hooks/useOrderState';

export interface SubmissionResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Service for handling order submission operations
 */
export class OrderSubmissionService {
  /**
   * Submit an order by updating draft to submitted status
   */
  async submitOrder(
    userId: string,
    orderState: OrderState,
    categoryId: string
  ): Promise<SubmissionResult> {
    if (!orderState.draftOrderId) {
      return { success: false, error: 'No draft order ID found' };
    }

    try {
      // Update draft order to submitted status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: orderState.travelCost
        })
        .eq('id', orderState.draftOrderId);

      if (orderError) throw orderError;

      // Create address record
      await this.createOrderAddress(userId, orderState);

      // Trigger webhooks and notifications in parallel
      await Promise.all([
        this.triggerZapierWebhook(orderState.draftOrderId, userId, categoryId),
        this.createAdminNotifications(orderState.draftOrderId)
      ]);

      return { 
        success: true, 
        orderId: orderState.draftOrderId 
      };
    } catch (error) {
      console.error('Error submitting order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create address record for the order
   */
  private async createOrderAddress(userId: string, orderState: OrderState): Promise<void> {
    await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        order_id: orderState.draftOrderId,
        address_type: 'shooting_location',
        strasse: orderState.address.strasse,
        hausnummer: orderState.address.hausnummer,
        plz: orderState.address.plz,
        stadt: orderState.address.stadt,
        additional_info: orderState.address.additional_info
      });
  }

  /**
   * Trigger Zapier webhook for new order
   */
  private async triggerZapierWebhook(
    orderId: string,
    userId: string,
    categoryId: string
  ): Promise<void> {
    try {
      await supabase.functions.invoke('trigger-zapier-webhook', {
        body: {
          event: 'new_order',
          order_id: orderId,
          user_id: userId,
          category: categoryId
        }
      });
    } catch (error) {
      // Don't fail the order submission if webhook fails
      console.error('Zapier webhook failed:', error);
    }
  }

  /**
   * Create notifications for all admin users
   */
  private async createAdminNotifications(orderId: string): Promise<void> {
    const { data: admins } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (admins && admins.length > 0) {
      await Promise.all(
        admins.map(admin =>
          supabase.from('notifications').insert({
            user_id: admin.user_id,
            type: 'new_order',
            title: 'Neue Bestellung',
            message: `Neue Bestellung wurde aufgegeben.`,
            link: `/admin-backend`
          })
        )
      );
    }
  }
}

// Export singleton instance
export const orderSubmissionService = new OrderSubmissionService();
