import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';

export interface OrderWithDetails extends Order {
  requested_date?: string | null;
  requested_time?: string | null;
  alternative_date?: string | null;
  alternative_time?: string | null;
  order_items?: Array<{
    id: string;
    quantity: number;
    services: {
      name: string;
    };
  }>;
  addresses?: Array<{
    id: string;
    strasse: string;
    hausnummer: string | null;
    plz: string;
    stadt: string;
    additional_info: string | null;
  }>;
  uploads?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    uploaded_at: string | null;
  }>;
  deliverables?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    delivered_at: string | null;
  }>;
  assignment?: {
    id: string;
    photographer_id: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    photographer?: {
      vorname: string | null;
      nachname: string | null;
    };
  } | null;
}

export class OrderFileService {
  /**
   * Fetch order with all related details including files and assignment
   */
  async fetchOrderWithDetails(orderId: string, userId: string): Promise<OrderWithDetails | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          services (name)
        ),
        addresses:addresses!order_id (
          id,
          strasse,
          hausnummer,
          plz,
          stadt,
          additional_info
        ),
        uploads:order_uploads (
          id,
          file_name,
          file_path,
          file_size,
          file_type,
          uploaded_at
        ),
        deliverables:order_deliverables (
          id,
          file_name,
          file_path,
          delivered_at
        ),
        assignment:order_assignments (
          id,
          photographer_id,
          scheduled_date,
          scheduled_time,
          photographer:profiles!photographer_id (
            vorname,
            nachname
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching order details:', error);
      return null;
    }

    // Flatten the assignment array to a single object
    const formattedData = {
      ...data,
      assignment: Array.isArray(data.assignment) && data.assignment.length > 0 
        ? {
            ...data.assignment[0],
            photographer: Array.isArray(data.assignment[0].photographer) && data.assignment[0].photographer.length > 0
              ? data.assignment[0].photographer[0]
              : null
          }
        : null
    };

    return formattedData;
  }

  /**
   * Download a file from storage
   */
  async downloadFile(filePath: string, fileName: string): Promise<void> {
    const { data, error } = await supabase.storage
      .from('order-deliverables')
      .download(filePath);

    if (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get signed URL for file preview
   */
  async getFilePreviewUrl(filePath: string, bucket: 'order-uploads' | 'order-deliverables'): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  }

  /**
   * Download all deliverables as individual files
   */
  async downloadAllDeliverables(orderId: string): Promise<void> {
    const { data: deliverables, error } = await supabase
      .from('order_deliverables')
      .select('file_path, file_name')
      .eq('order_id', orderId);

    if (error) {
      throw new Error(`Failed to fetch deliverables: ${error.message}`);
    }

    if (!deliverables || deliverables.length === 0) {
      throw new Error('No deliverables found');
    }

    // Download each file sequentially
    for (const deliverable of deliverables) {
      await this.downloadFile(deliverable.file_path, deliverable.file_name);
      // Small delay between downloads to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

export const orderFileService = new OrderFileService();
