import { z } from 'zod';
import type { OrderUpload, OrderDeliverable } from './uploads';

/**
 * Order status enum matching database
 */
export type OrderStatus = 'draft' | 'submitted' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';

/**
 * Address type enum matching database
 */
export type AddressType = 'shooting_location' | 'billing_address';

/**
 * Complete order interface with all relations
 */
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string | null;
  delivery_deadline: string | null;
  special_instructions: string | null;
  profiles?: {
    email: string;
    vorname: string | null;
    nachname: string | null;
    firma: string | null;
    telefon: string | null;
  };
}

/**
 * Order item interface
 */
export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_notes: string | null;
  created_at: string | null;
  services: {
    name: string;
    category: string;
  };
}

/**
 * Address interface
 */
export interface Address {
  id: string;
  user_id: string;
  order_id: string | null;
  address_type: AddressType;
  strasse: string;
  hausnummer: string | null;
  plz: string;
  stadt: string;
  land: string;
  additional_info: string | null;
  latitude: number | null;
  longitude: number | null;
  geocoded_at: string | null;
  created_at: string | null;
}

/**
 * Complete order details with all relations
 */
export interface OrderDetails {
  order: Order;
  items: OrderItem[];
  addresses: Address[];
  uploads: OrderUpload[];
  deliverables: OrderDeliverable[];
}

/**
 * Zod schema for order submission validation
 */
export const orderSubmissionSchema = z.object({
  selectedCategory: z.string().min(1, 'Kategorie ist erforderlich'),
  address: z.object({
    strasse: z.string().min(1, 'Straße ist erforderlich'),
    hausnummer: z.string().min(1, 'Hausnummer ist erforderlich'),
    plz: z.string().min(4, 'PLZ ist erforderlich').max(10, 'PLZ zu lang'),
    stadt: z.string().min(1, 'Stadt ist erforderlich'),
    additional_info: z.string().optional()
  }),
  locationValidated: z.boolean().refine(val => val === true, {
    message: 'Standort muss validiert werden'
  })
});

export type OrderSubmissionValidation = z.infer<typeof orderSubmissionSchema>;
