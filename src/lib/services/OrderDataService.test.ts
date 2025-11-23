import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDataService, Order } from './OrderDataService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          neq: vi.fn(() => ({
            order: vi.fn(() => ({ data: [], error: null }))
          }))
        }))
      }))
    }))
  }
}));

describe('OrderDataService', () => {
  let service: OrderDataService;

  beforeEach(() => {
    service = new OrderDataService();
    vi.clearAllMocks();
  });

  describe('filterOrders', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        order_number: 'SS-2025-0002',
        status: 'completed',
        total_amount: 200,
        created_at: '2025-01-16T10:00:00Z'
      }
    ];

    it('should return all orders when search term is empty', () => {
      const result = service.filterOrders(mockOrders, '');
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockOrders);
    });

    it('should filter orders by order number (case insensitive)', () => {
      const result = service.filterOrders(mockOrders, '0001');
      expect(result).toHaveLength(1);
      expect(result[0].order_number).toBe('SS-2025-0001');
    });

    it('should handle uppercase search terms', () => {
      const result = service.filterOrders(mockOrders, 'SS-2025');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches found', () => {
      const result = service.filterOrders(mockOrders, '9999');
      expect(result).toHaveLength(0);
    });

    it('should handle whitespace in search term', () => {
      const result = service.filterOrders(mockOrders, '  ');
      expect(result).toHaveLength(2);
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for each status', () => {
      expect(service.getStatusColor('draft')).toBe('bg-gray-500');
      expect(service.getStatusColor('submitted')).toBe('bg-blue-500');
      expect(service.getStatusColor('in_progress')).toBe('bg-yellow-500');
      expect(service.getStatusColor('completed')).toBe('bg-green-500');
      expect(service.getStatusColor('delivered')).toBe('bg-teal-500');
      expect(service.getStatusColor('cancelled')).toBe('bg-red-500');
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct German label for each status', () => {
      expect(service.getStatusLabel('draft')).toBe('Entwurf');
      expect(service.getStatusLabel('submitted')).toBe('Eingereicht');
      expect(service.getStatusLabel('in_progress')).toBe('In Bearbeitung');
      expect(service.getStatusLabel('completed')).toBe('Abgeschlossen');
      expect(service.getStatusLabel('delivered')).toBe('Geliefert');
      expect(service.getStatusLabel('cancelled')).toBe('Storniert');
    });
  });

  describe('formatDate', () => {
    it('should format date in German locale (long format)', () => {
      const result = service.formatDate('2025-01-15T10:00:00Z');
      expect(result).toContain('Januar');
      expect(result).toContain('2025');
    });
  });

  describe('formatShortDate', () => {
    it('should format date in German locale (short format)', () => {
      const result = service.formatShortDate('2025-01-15T10:00:00Z');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with Euro symbol', () => {
      expect(service.formatCurrency(100)).toBe('€100,00');
      expect(service.formatCurrency(1234.56)).toBe('€1.234,56');
    });

    it('should handle zero amount', () => {
      expect(service.formatCurrency(0)).toBe('€0,00');
    });

    it('should handle large amounts', () => {
      expect(service.formatCurrency(999999.99)).toBe('€999.999,99');
    });
  });

  describe('canDownloadOrder', () => {
    it('should return true for delivered orders', () => {
      const order: Order = {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'delivered',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z'
      };
      expect(service.canDownloadOrder(order)).toBe(true);
    });

    it('should return false for non-delivered orders', () => {
      const statuses: Order['status'][] = ['draft', 'submitted', 'in_progress', 'completed', 'cancelled'];
      
      statuses.forEach(status => {
        const order: Order = {
          id: '1',
          order_number: 'SS-2025-0001',
          status,
          total_amount: 100,
          created_at: '2025-01-15T10:00:00Z'
        };
        expect(service.canDownloadOrder(order)).toBe(false);
      });
    });
  });

  describe('getTotalItemsCount', () => {
    it('should return total quantity of all items', () => {
      const order: Order = {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z',
        order_items: [
          { id: '1', quantity: 2, services: { name: 'Service A' } },
          { id: '2', quantity: 3, services: { name: 'Service B' } }
        ]
      };

      expect(service.getTotalItemsCount(order)).toBe(5);
    });

    it('should return 0 when no items exist', () => {
      const order: Order = {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z'
      };

      expect(service.getTotalItemsCount(order)).toBe(0);
    });

    it('should return 0 for empty items array', () => {
      const order: Order = {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z',
        order_items: []
      };

      expect(service.getTotalItemsCount(order)).toBe(0);
    });
  });

  describe('sortOrdersByDate', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        order_number: 'SS-2025-0002',
        status: 'completed',
        total_amount: 200,
        created_at: '2025-01-17T10:00:00Z'
      },
      {
        id: '3',
        order_number: 'SS-2025-0003',
        status: 'in_progress',
        total_amount: 150,
        created_at: '2025-01-16T10:00:00Z'
      }
    ];

    it('should sort orders by date descending (newest first) by default', () => {
      const result = service.sortOrdersByDate(mockOrders);
      expect(result[0].id).toBe('2'); // Jan 17
      expect(result[1].id).toBe('3'); // Jan 16
      expect(result[2].id).toBe('1'); // Jan 15
    });

    it('should sort orders by date ascending when specified', () => {
      const result = service.sortOrdersByDate(mockOrders, true);
      expect(result[0].id).toBe('1'); // Jan 15
      expect(result[1].id).toBe('3'); // Jan 16
      expect(result[2].id).toBe('2'); // Jan 17
    });

    it('should not mutate original array', () => {
      const original = [...mockOrders];
      service.sortOrdersByDate(mockOrders);
      expect(mockOrders).toEqual(original);
    });
  });

  describe('groupOrdersByStatus', () => {
    it('should group orders by their status', () => {
      const mockOrders: Order[] = [
        { id: '1', order_number: 'SS-2025-0001', status: 'submitted', total_amount: 100, created_at: '2025-01-15T10:00:00Z' },
        { id: '2', order_number: 'SS-2025-0002', status: 'completed', total_amount: 200, created_at: '2025-01-16T10:00:00Z' },
        { id: '3', order_number: 'SS-2025-0003', status: 'submitted', total_amount: 150, created_at: '2025-01-17T10:00:00Z' },
        { id: '4', order_number: 'SS-2025-0004', status: 'delivered', total_amount: 180, created_at: '2025-01-18T10:00:00Z' }
      ];

      const result = service.groupOrdersByStatus(mockOrders);

      expect(result.submitted).toHaveLength(2);
      expect(result.completed).toHaveLength(1);
      expect(result.delivered).toHaveLength(1);
      expect(result.in_progress).toHaveLength(0);
      expect(result.draft).toHaveLength(0);
      expect(result.cancelled).toHaveLength(0);
    });

    it('should return empty arrays for statuses with no orders', () => {
      const mockOrders: Order[] = [];
      const result = service.groupOrdersByStatus(mockOrders);

      expect(result.submitted).toHaveLength(0);
      expect(result.completed).toHaveLength(0);
      expect(result.delivered).toHaveLength(0);
      expect(result.in_progress).toHaveLength(0);
      expect(result.draft).toHaveLength(0);
      expect(result.cancelled).toHaveLength(0);
    });
  });

  describe('fetchUserOrders', () => {
    it('should fetch orders successfully', async () => {
      const mockOrders = [
        { id: '1', order_number: 'SS-2025-0001', status: 'submitted', total_amount: 100, created_at: '2025-01-15T10:00:00Z' }
      ];

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({
              order: vi.fn(() => ({ data: mockOrders, error: null }))
            }))
          }))
        }))
      } as any);

      const result = await service.fetchUserOrders('user-123');
      expect(result).toEqual(mockOrders);
    });

    it('should handle empty result', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({
              order: vi.fn(() => ({ data: null, error: null }))
            }))
          }))
        }))
      } as any);

      const result = await service.fetchUserOrders('user-123');
      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({
              order: vi.fn(() => ({ data: null, error: new Error('Database error') }))
            }))
          }))
        }))
      } as any);

      await expect(service.fetchUserOrders('user-123')).rejects.toThrow('Failed to fetch orders');
    });
  });
});
