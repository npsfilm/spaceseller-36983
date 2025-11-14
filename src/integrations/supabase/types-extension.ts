// Temporary type extensions until types.ts regenerates
// This file extends the auto-generated types with new tables from recent migrations

import { Database } from './types';

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface OrderAssignmentRow {
  id: string;
  order_id: string;
  photographer_id: string;
  assigned_by: string;
  assigned_at: string;
  status: string;
  admin_notes: string | null;
  photographer_notes: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  estimated_duration: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

// Extended database type
export interface ExtendedDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      notifications: {
        Row: NotificationRow;
        Insert: Omit<NotificationRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<NotificationRow, 'id' | 'created_at'>>;
      };
      order_assignments: {
        Row: OrderAssignmentRow;
        Insert: Omit<OrderAssignmentRow, 'id' | 'created_at' | 'updated_at' | 'assigned_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          assigned_at?: string;
        };
        Update: Partial<Omit<OrderAssignmentRow, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: Database['public']['Functions'] & {
      is_photographer: {
        Args: { _user_id: string };
        Returns: boolean;
      };
    };
  };
}
