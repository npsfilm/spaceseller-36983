import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminOrderService } from './AdminOrderService';
import type { Order } from './AdminOrderService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('AdminOrderService', () => {
  let service: AdminOrderService;

  beforeEach(() => {
    service = new AdminOrderService();
    vi.clearAllMocks();
  });

  describe('calculateStats', () => {
    it('should calculate correct statistics from orders', () => {
      const today = new Date();
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'SS-2025-0001',
          status: 'submitted',
          total_amount: 100,
          created_at: new Date().toISOString(),
          user_id: 'user1',
        },
        {
          id: '2',
          order_number: 'SS-2025-0002',
          status: 'in_progress',
          total_amount: 200,
          created_at: new Date().toISOString(),
          user_id: 'user2',
        },
        {
          id: '3',
          order_number: 'SS-2025-0003',
          status: 'completed',
          total_amount: 300,
          created_at: today.toISOString(),
          user_id: 'user3',
        },
      ];

      const stats = service.calculateStats(mockOrders);

      expect(stats.totalOrders).toBe(3);
      expect(stats.pendingOrders).toBe(1);
      expect(stats.inProgressOrders).toBe(1);
      expect(stats.completedToday).toBe(1);
    });

    it('should return zero stats for empty array', () => {
      const stats = service.calculateStats([]);

      expect(stats.totalOrders).toBe(0);
      expect(stats.pendingOrders).toBe(0);
      expect(stats.inProgressOrders).toBe(0);
      expect(stats.completedToday).toBe(0);
    });
  });

  describe('filterOrders', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        order_number: 'SS-2025-0001',
        status: 'submitted',
        total_amount: 100,
        created_at: new Date().toISOString(),
        user_id: 'user1',
        profiles: {
          email: 'test@example.com',
          vorname: 'John',
          nachname: 'Doe',
          firma: 'Test GmbH',
        },
      },
      {
        id: '2',
        order_number: 'SS-2025-0002',
        status: 'in_progress',
        total_amount: 200,
        created_at: new Date().toISOString(),
        user_id: 'user2',
        profiles: {
          email: 'jane@company.com',
          vorname: 'Jane',
          nachname: 'Smith',
          firma: 'Company AG',
        },
      },
    ];

    it('should filter by status', () => {
      const filtered = service.filterOrders(mockOrders, '', 'submitted');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('submitted');
    });

    it('should filter by search query (order number)', () => {
      const filtered = service.filterOrders(mockOrders, '0001', 'all');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].order_number).toBe('SS-2025-0001');
    });

    it('should filter by search query (email)', () => {
      const filtered = service.filterOrders(mockOrders, 'jane@company', 'all');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].profiles?.email).toBe('jane@company.com');
    });

    it('should filter by search query (company name)', () => {
      const filtered = service.filterOrders(mockOrders, 'test gmbh', 'all');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].profiles?.firma).toBe('Test GmbH');
    });

    it('should combine status and search filters', () => {
      const filtered = service.filterOrders(mockOrders, 'test', 'submitted');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].order_number).toBe('SS-2025-0001');
    });

    it('should return all orders when no filters applied', () => {
      const filtered = service.filterOrders(mockOrders, '', 'all');
      expect(filtered).toHaveLength(2);
    });
  });

  describe('fetchAllOrders', () => {
    it('should handle errors gracefully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ 
            data: null, 
            error: new Error('Database error') 
          }),
        }),
      });

      await expect(service.fetchAllOrders()).rejects.toThrow('Database error');
    });
  });
});
