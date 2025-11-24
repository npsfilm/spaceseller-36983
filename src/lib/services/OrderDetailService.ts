import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_notes?: string;
  services?: {
    name: string;
    category: string;
  };
}

export interface OrderUpload {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
}

export interface OrderDeliverable {
  id: string;
  file_name: string;
  file_path: string;
  delivered_at: string;
}

export interface OrderAddress {
  id: string;
  strasse: string;
  hausnummer?: string;
  plz: string;
  stadt: string;
  land: string;
  address_type: string;
  additional_info?: string;
  latitude?: number;
  longitude?: number;
}

export interface Photographer {
  id: string;
  name: string;
  email: string;
}

export interface Assignment {
  id: string;
  photographer_id: string;
  status: string;
  admin_notes?: string;
  photographer_notes?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  payment_amount?: number;
  travel_cost?: number;
  profiles?: {
    vorname: string;
    nachname: string;
    email: string;
  };
}

export interface OrderUpgrade {
  id: string;
  quantity: number;
  total_price: number;
  upgrades?: {
    name: string;
    description?: string;
  };
}

export interface OrderDetails {
  items: OrderItem[];
  upgrades: OrderUpgrade[];
  uploads: OrderUpload[];
  deliverables: OrderDeliverable[];
  addresses: OrderAddress[];
}

/**
 * Service for managing order detail operations
 */
export class OrderDetailService {
  /**
   * Fetch all order details (items, uploads, deliverables, addresses)
   */
  async fetchOrderDetails(orderId: string): Promise<OrderDetails> {
    const [itemsResult, upgradesResult, uploadsResult, deliverablesResult, addressesResult] = await Promise.all([
      supabase
        .from('order_items')
        .select(`
          *,
          services (
            name,
            category
          )
        `)
        .eq('order_id', orderId),
      
      supabase
        .from('order_upgrades')
        .select(`
          *,
          upgrades (
            name,
            description
          )
        `)
        .eq('order_id', orderId),
      
      supabase
        .from('order_uploads')
        .select('*')
        .eq('order_id', orderId),
      
      supabase
        .from('order_deliverables')
        .select('*')
        .eq('order_id', orderId),
      
      supabase
        .from('addresses')
        .select('*')
        .eq('order_id', orderId),
    ]);

    return {
      items: itemsResult.data || [],
      upgrades: upgradesResult.data || [],
      uploads: uploadsResult.data || [],
      deliverables: deliverablesResult.data || [],
      addresses: addressesResult.data || [],
    };
  }

  /**
   * Fetch all photographers
   */
  async fetchPhotographers(): Promise<Photographer[]> {
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'photographer');

    if (rolesError) throw rolesError;

    const photographerIds = rolesData?.map(r => r.user_id) || [];
    
    if (photographerIds.length === 0) {
      return [];
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, vorname, nachname, email')
      .in('id', photographerIds);

    if (profilesError) throw profilesError;

    return profilesData?.map(profile => ({
      id: profile.id,
      name: `${profile.vorname || ''} ${profile.nachname || ''}`.trim() || profile.email,
      email: profile.email
    })) || [];
  }

  /**
   * Fetch current photographer assignment for an order
   */
  async fetchAssignment(orderId: string): Promise<Assignment | null> {
    const { data, error } = await supabase
      .from('order_assignments')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) return null;

    // Fetch photographer profile separately
    if (data.photographer_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('vorname, nachname, email')
        .eq('id', data.photographer_id)
        .single();

      return {
        ...data,
        profiles: profile || undefined
      };
    }

    return data;
  }

  /**
   * Assign or update photographer assignment
   */
  async assignPhotographer(
    orderId: string,
    photographerId: string,
    adminNotes: string,
    scheduledDate: string,
    scheduledTime: string,
    paymentAmount: number,
    travelCost: number,
    currentAssignmentId?: string
  ): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    
    const assignmentData = {
      order_id: orderId,
      photographer_id: photographerId,
      assigned_by: userData?.user?.id,
      admin_notes: adminNotes,
      scheduled_date: scheduledDate || null,
      scheduled_time: scheduledTime || null,
      payment_amount: paymentAmount,
      travel_cost: travelCost,
      status: 'pending'
    };

    if (currentAssignmentId) {
      const { error } = await supabase
        .from('order_assignments')
        .update(assignmentData)
        .eq('id', currentAssignmentId);

      if (error) throw error;
      return currentAssignmentId;
    } else {
      const { data, error } = await supabase
        .from('order_assignments')
        .insert(assignmentData)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    }
  }

  /**
   * Create notification for photographer
   */
  async createPhotographerNotification(
    photographerId: string,
    orderNumber: string
  ): Promise<void> {
    await supabase.from('notifications').insert({
      user_id: photographerId,
      type: 'assignment_created',
      title: 'Neuer Auftrag zugewiesen',
      message: `Sie wurden für Auftrag #${orderNumber} zugewiesen.`,
      link: '/freelancer-dashboard'
    });
  }

  /**
   * Trigger Zapier webhook for assignment
   */
  async triggerZapierWebhook(
    orderNumber: string,
    orderId: string,
    assignmentId: string,
    photographerId: string,
    photographerEmail: string,
    scheduledDate: string,
    scheduledTime: string,
    adminNotes: string,
    totalAmount: number,
    paymentAmount: number,
    travelCost: number
  ): Promise<void> {
    try {
      await supabase.functions.invoke('trigger-zapier-webhook', {
        body: {
          assignmentData: {
            order_number: orderNumber,
            order_id: orderId,
            assignment_id: assignmentId,
            photographer_id: photographerId,
            photographer_email: photographerEmail,
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime,
            admin_notes: adminNotes,
            total_amount: totalAmount,
            payment_amount: paymentAmount,
            travel_cost: travelCost,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      // Don't fail the assignment if webhook fails
      console.error('Error triggering Zapier webhook:', error);
    }
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

  /**
   * Upload deliverable file
   */
  async uploadDeliverable(
    file: File,
    orderId: string,
    orderNumber: string
  ): Promise<void> {
    const fileName = `${orderNumber}/${Date.now()}-${file.name}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('order-deliverables')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create deliverable record
    const { error: dbError } = await supabase
      .from('order_deliverables')
      .insert({
        order_id: orderId,
        file_path: fileName,
        file_name: file.name,
      });

    if (dbError) throw dbError;
  }

  /**
   * Download file from storage
   */
  async downloadFile(filePath: string, fileName: string, bucket: string): Promise<void> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const orderDetailService = new OrderDetailService();
