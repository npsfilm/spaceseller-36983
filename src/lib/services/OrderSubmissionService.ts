import { supabase } from '@/integrations/supabase/client';
import type { OrderState } from '@/lib/hooks/useOrderState';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';

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
      // Calculate total amount based on order category
      const totalAmount = this.calculateTotalAmount(orderState, categoryId);

      // Update draft order to submitted status with requested dates
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: totalAmount,
          requested_date: orderState.primaryDate ? new Date(orderState.primaryDate).toISOString().split('T')[0] : null,
          requested_time: orderState.primaryTime || null,
          alternative_date: orderState.alternativeDate ? new Date(orderState.alternativeDate).toISOString().split('T')[0] : null,
          alternative_time: orderState.alternativeTime || null
        })
        .eq('id', orderState.draftOrderId);

      if (orderError) throw orderError;

      // Create address record
      await this.createOrderAddress(userId, orderState);

      // Create admin notifications
      await this.createAdminNotifications(orderState.draftOrderId);

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
   * Calculate total amount based on order category and selections
   */
  private calculateTotalAmount(orderState: OrderState, categoryId: string): number {
    let subtotal = 0;

    // Calculate based on category
    if (categoryId === 'onsite' && orderState.selectedPackage) {
      // Photography: package price + add-ons + travel cost
      const selectedPackage = PACKAGE_TIERS.find(pkg => pkg.id === orderState.selectedPackage);
      if (selectedPackage) {
        subtotal = selectedPackage.price;
      }
      
      // Add-ons
      if (orderState.selectedAddOns.length > 0) {
        const addOnsTotal = orderState.selectedAddOns.reduce((sum, addOnId) => {
          const addOn = ADD_ONS.find(a => a.id === addOnId);
          return sum + (addOn?.price || 0);
        }, 0);
        subtotal += addOnsTotal;
      }
      
      // Travel cost
      subtotal += orderState.travelCost || 0;
    } else if (categoryId === 'photo_editing') {
      // Photo editing: calculate from selectedProducts
      subtotal = Object.values(orderState.selectedProducts).reduce(
        (sum, product) => sum + product.totalPrice,
        0
      );
    } else if (categoryId === 'virtual_staging') {
      // Virtual staging: calculate from selectedProducts
      subtotal = Object.values(orderState.selectedProducts).reduce(
        (sum, product) => sum + product.totalPrice,
        0
      );
    } else if (categoryId === 'energy_certificate') {
      // Energy certificate: calculate from selectedProducts
      subtotal = Object.values(orderState.selectedProducts).reduce(
        (sum, product) => sum + product.totalPrice,
        0
      );
    }

    // Prices already include tax (net prices are gross in this system)
    return Math.round(subtotal * 100) / 100; // Round to 2 decimals
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
