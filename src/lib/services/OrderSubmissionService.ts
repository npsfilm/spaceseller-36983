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

      // Update draft order to submitted status with requested dates and special instructions
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: totalAmount,
          requested_date: orderState.primaryDate ? new Date(orderState.primaryDate).toISOString().split('T')[0] : null,
          requested_time: orderState.primaryTime || null,
          alternative_date: orderState.alternativeDate ? new Date(orderState.alternativeDate).toISOString().split('T')[0] : null,
          alternative_time: orderState.alternativeTime || null,
          special_instructions: orderState.specialInstructions || null
        })
        .eq('id', orderState.draftOrderId);

      if (orderError) throw orderError;

      // Create order items
      await this.createOrderItems(userId, orderState, categoryId);

      // Create order upgrades (add-ons)
      await this.createOrderUpgrades(orderState);

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
   * Create order items for the order
   */
  private async createOrderItems(userId: string, orderState: OrderState, categoryId: string): Promise<void> {
    if (categoryId === 'onsite' && orderState.selectedPackage) {
      // Photography: Find the package service by name match
      const packageData = PACKAGE_TIERS.find(p => p.id === orderState.selectedPackage);
      if (packageData) {
        const { data: service } = await supabase
          .from('services')
          .select('id')
          .eq('category', 'photography')
          .eq('name', packageData.name)
          .eq('unit', 'per_shoot')
          .single();

        if (service) {
          const packageMetadata = JSON.stringify({
            package_id: packageData.id,
            package_type: packageData.type,
            photo_count: packageData.photoCount,
            tier: packageData.tier
          });

          await supabase.from('order_items').insert({
            order_id: orderState.draftOrderId,
            service_id: service.id,
            quantity: 1,
            unit_price: packageData.price,
            total_price: packageData.price,
            item_notes: packageMetadata
          });
        }
      }
    } else {
      // Other categories: iterate through selectedProducts
      const items = Object.entries(orderState.selectedProducts).map(([serviceId, product]) => ({
        order_id: orderState.draftOrderId,
        service_id: serviceId,
        quantity: product.quantity,
        unit_price: product.unitPrice,
        total_price: product.totalPrice
      }));

      if (items.length > 0) {
        await supabase.from('order_items').insert(items);
      }
    }
  }

  /**
   * Create order upgrades (add-ons) for photography orders
   */
  private async createOrderUpgrades(orderState: OrderState): Promise<void> {
    if (orderState.selectedAddOns.length === 0) return;

    const upgradeItems = [];
    
    for (const addOnId of orderState.selectedAddOns) {
      const addOnData = ADD_ONS.find(a => a.id === addOnId);
      if (!addOnData) continue;

      // Find upgrade by name match
      const { data: upgrade } = await supabase
        .from('upgrades')
        .select('id')
        .eq('category', 'photography')
        .eq('name', addOnData.name)
        .single();

      if (upgrade) {
        upgradeItems.push({
          order_id: orderState.draftOrderId,
          upgrade_id: upgrade.id,
          quantity: 1,
          unit_price: addOnData.price,
          total_price: addOnData.price
        });
      }
    }

    if (upgradeItems.length > 0) {
      await supabase.from('order_upgrades').insert(upgradeItems);
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
