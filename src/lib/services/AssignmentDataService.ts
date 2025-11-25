import { supabase } from '@/integrations/supabase/client';

export interface Assignment {
  id: string;
  order_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  scheduled_date: string | null;
  scheduled_time: string | null;
  admin_notes: string | null;
  photographer_notes: string | null;
  photographer_id: string;
  payment_amount: number | null;
  travel_cost: number | null;
  responded_at: string | null;
  created_at: string | null;
  orders: {
    order_number: string;
    special_instructions: string | null;
    user_id: string;
    total_amount: number;
    profiles: {
      vorname: string;
      nachname: string;
      email: string;
      telefon: string | null;
    };
    addresses: Array<{
      strasse: string;
      hausnummer: string | null;
      plz: string;
      stadt: string;
      land: string;
    }>;
    order_items: Array<{
      quantity: number;
      total_price: number;
      services: {
        name: string;
      };
    }>;
  };
}

export interface AssignmentStats {
  pending: number;
  accepted: number;
  completed: number;
  declined: number;
  total: number;
}

export class AssignmentDataService {
  /**
   * Fetch all assignments for a photographer
   */
  async fetchPhotographerAssignments(photographerId: string): Promise<Assignment[]> {
    console.log('[AssignmentDataService] Fetching assignments for photographer:', photographerId);
    
    const { data, error } = await supabase
      .from('order_assignments')
      .select(`
        *,
        orders(
          order_number,
          special_instructions,
          user_id,
          total_amount,
          profiles!orders_user_id_fkey(
            vorname,
            nachname,
            email,
            telefon
          ),
          addresses(
            strasse,
            hausnummer,
            plz,
            stadt,
            land
          ),
          order_items(
            quantity,
            total_price,
            services(name)
          )
        )
      `)
      .eq('photographer_id', photographerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AssignmentDataService] Error fetching assignments:', error);
      throw new Error(`Failed to fetch assignments: ${error.message}`);
    }

    console.log('[AssignmentDataService] Fetched assignments:', data?.length || 0, 'records');
    
    // Filter out assignments with null orders (shouldn't happen but defensive)
    const validAssignments = (data || []).filter(assignment => assignment.orders);
    
    if (validAssignments.length < (data?.length || 0)) {
      console.warn('[AssignmentDataService] Some assignments had null orders:', 
        (data?.length || 0) - validAssignments.length);
    }

    // Type assertion is safe here because the select query structure matches Assignment interface
    return validAssignments as unknown as Assignment[];
  }

  /**
   * Accept an assignment
   */
  async acceptAssignment(assignmentId: string): Promise<void> {
    const { error } = await supabase
      .from('order_assignments')
      .update({ 
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', assignmentId);

    if (error) {
      throw new Error(`Failed to accept assignment: ${error.message}`);
    }
  }

  /**
   * Decline an assignment with reason
   */
  async declineAssignment(assignmentId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('order_assignments')
      .update({ 
        status: 'declined',
        responded_at: new Date().toISOString(),
        photographer_notes: reason
      })
      .eq('id', assignmentId);

    if (error) {
      throw new Error(`Failed to decline assignment: ${error.message}`);
    }
  }

  /**
   * Create notification for admins
   */
  async createAdminNotification(type: string, title: string, message: string, link: string): Promise<void> {
    const { data: adminRoles, error: fetchError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (fetchError) {
      throw new Error(`Failed to fetch admin roles: ${fetchError.message}`);
    }

    if (adminRoles && adminRoles.length > 0) {
      const notifications = adminRoles.map(admin => ({
        user_id: admin.user_id,
        type,
        title,
        message,
        link
      }));
      
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        throw new Error(`Failed to create notifications: ${insertError.message}`);
      }
    }
  }

  /**
   * Calculate statistics from assignments
   */
  calculateStats(assignments: Assignment[]): AssignmentStats {
    return {
      pending: assignments.filter(a => a.status === 'pending').length,
      accepted: assignments.filter(a => a.status === 'accepted').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      declined: assignments.filter(a => a.status === 'declined').length,
      total: assignments.length
    };
  }

  /**
   * Filter assignments by status
   */
  filterByStatus(assignments: Assignment[], status: Assignment['status']): Assignment[] {
    return assignments.filter(a => a.status === status);
  }

  /**
   * Group assignments by status
   */
  groupByStatus(assignments: Assignment[]): Record<Assignment['status'], Assignment[]> {
    return {
      pending: this.filterByStatus(assignments, 'pending'),
      accepted: this.filterByStatus(assignments, 'accepted'),
      declined: this.filterByStatus(assignments, 'declined'),
      completed: this.filterByStatus(assignments, 'completed')
    };
  }

  /**
   * Get customer name from assignment
   */
  getCustomerName(assignment: Assignment): string {
    if (!assignment.orders?.profiles) {
      return 'Kunde';
    }
    const { vorname, nachname } = assignment.orders.profiles;
    return `${vorname || ''} ${nachname || ''}`.trim() || 'Kunde';
  }

  /**
   * Get formatted address from assignment
   */
  getFormattedAddress(assignment: Assignment): string {
    if (!assignment.orders?.addresses || assignment.orders.addresses.length === 0) {
      return 'Adresse wird geladen...';
    }

    const address = assignment.orders.addresses[0];
    return `${address.strasse} ${address.hausnummer || ''}, ${address.plz} ${address.stadt}`.trim();
  }

  /**
   * Format scheduled datetime
   */
  formatScheduledDateTime(assignment: Assignment): string | null {
    if (!assignment.scheduled_date) return null;

    const date = new Date(assignment.scheduled_date);
    const dateStr = date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    if (assignment.scheduled_time) {
      return `${dateStr} um ${assignment.scheduled_time}`;
    }

    return dateStr;
  }

  /**
   * Check if assignment is overdue (accepted but scheduled date passed)
   */
  isOverdue(assignment: Assignment): boolean {
    if (assignment.status !== 'accepted' || !assignment.scheduled_date) {
      return false;
    }

    const scheduled = new Date(assignment.scheduled_date);
    const now = new Date();
    
    return scheduled < now;
  }

  /**
   * Sort assignments by scheduled date
   */
  sortByScheduledDate(assignments: Assignment[], ascending = true): Assignment[] {
    return [...assignments].sort((a, b) => {
      if (!a.scheduled_date && !b.scheduled_date) return 0;
      if (!a.scheduled_date) return 1;
      if (!b.scheduled_date) return -1;

      const dateA = new Date(a.scheduled_date).getTime();
      const dateB = new Date(b.scheduled_date).getTime();
      
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
}

export const assignmentDataService = new AssignmentDataService();
