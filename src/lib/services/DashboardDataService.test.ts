import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardDataService, OrderSummary } from './DashboardDataService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          neq: vi.fn(() => ({ data: [], error: null }))
        }))
      }))
    }))
  }
}));

describe('DashboardDataService', () => {
  let service: DashboardDataService;

  beforeEach(() => {
    service = new DashboardDataService();
    vi.clearAllMocks();
  });

  describe('calculateStats', () => {
    it('should calculate correct statistics for empty orders', () => {
      const orders: OrderSummary[] = [];
      const stats = service.calculateStats(orders);

      expect(stats.totalOrders).toBe(0);
      expect(stats.activeOrders).toBe(0);
      expect(stats.completedThisMonth).toBe(0);
      expect(stats.totalSpent).toBe(0);
    });

    it('should calculate total orders correctly', () => {
      const orders: OrderSummary[] = [
        { status: 'completed', total_amount: 100, created_at: '2025-01-15T10:00:00Z' },
        { status: 'submitted', total_amount: 200, created_at: '2025-01-16T10:00:00Z' },
        { status: 'in_progress', total_amount: 150, created_at: '2025-01-17T10:00:00Z' }
      ];

      const stats = service.calculateStats(orders);
      expect(stats.totalOrders).toBe(3);
    });

    it('should count active orders (submitted + in_progress)', () => {
      const orders: OrderSummary[] = [
        { status: 'submitted', total_amount: 100, created_at: '2025-01-15T10:00:00Z' },
        { status: 'in_progress', total_amount: 200, created_at: '2025-01-16T10:00:00Z' },
        { status: 'completed', total_amount: 150, created_at: '2025-01-17T10:00:00Z' },
        { status: 'delivered', total_amount: 180, created_at: '2025-01-18T10:00:00Z' }
      ];

      const stats = service.calculateStats(orders);
      expect(stats.activeOrders).toBe(2);
    });

    it('should count completed orders from current month only', () => {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15).toISOString();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString();

      const orders: OrderSummary[] = [
        { status: 'completed', total_amount: 100, created_at: thisMonth },
        { status: 'completed', total_amount: 200, created_at: thisMonth },
        { status: 'completed', total_amount: 150, created_at: lastMonth }
      ];

      const stats = service.calculateStats(orders);
      expect(stats.completedThisMonth).toBe(2);
    });

    it('should calculate total spent correctly', () => {
      const orders: OrderSummary[] = [
        { status: 'completed', total_amount: 100, created_at: '2025-01-15T10:00:00Z' },
        { status: 'submitted', total_amount: 200.50, created_at: '2025-01-16T10:00:00Z' },
        { status: 'delivered', total_amount: 150.25, created_at: '2025-01-17T10:00:00Z' }
      ];

      const stats = service.calculateStats(orders);
      expect(stats.totalSpent).toBe(450.75);
    });

    it('should handle string amounts correctly', () => {
      const orders: OrderSummary[] = [
        { status: 'completed', total_amount: 100 as any, created_at: '2025-01-15T10:00:00Z' },
        { status: 'submitted', total_amount: '200.50' as any, created_at: '2025-01-16T10:00:00Z' }
      ];

      const stats = service.calculateStats(orders);
      expect(stats.totalSpent).toBe(300.50);
    });
  });

  describe('getUserStatus', () => {
    it('should identify user with no orders', () => {
      const status = service.getUserStatus(0);
      expect(status.hasNoOrders).toBe(true);
      expect(status.isNewUser).toBe(true);
    });

    it('should identify new user (< 3 orders)', () => {
      const status1 = service.getUserStatus(1);
      expect(status1.hasNoOrders).toBe(false);
      expect(status1.isNewUser).toBe(true);

      const status2 = service.getUserStatus(2);
      expect(status2.hasNoOrders).toBe(false);
      expect(status2.isNewUser).toBe(true);
    });

    it('should identify experienced user (>= 3 orders)', () => {
      const status = service.getUserStatus(3);
      expect(status.hasNoOrders).toBe(false);
      expect(status.isNewUser).toBe(false);
    });

    it('should handle large order counts', () => {
      const status = service.getUserStatus(100);
      expect(status.hasNoOrders).toBe(false);
      expect(status.isNewUser).toBe(false);
    });
  });

  describe('fetchUserOrders', () => {
    it('should fetch orders successfully', async () => {
      const mockOrders = [
        { status: 'completed', total_amount: 100, created_at: '2025-01-15T10:00:00Z' },
        { status: 'submitted', total_amount: 200, created_at: '2025-01-16T10:00:00Z' }
      ];

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ data: mockOrders, error: null }))
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
            neq: vi.fn(() => ({ data: null, error: null }))
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
            neq: vi.fn(() => ({ data: null, error: new Error('Database error') }))
          }))
        }))
      } as any);

      await expect(service.fetchUserOrders('user-123')).rejects.toThrow('Failed to fetch orders');
    });
  });

  describe('countUserOrders', () => {
    it('should count orders successfully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ count: 5, error: null }))
          }))
        }))
      } as any);

      const result = await service.countUserOrders('user-123');
      expect(result).toBe(5);
    });

    it('should handle zero count', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ count: 0, error: null }))
          }))
        }))
      } as any);

      const result = await service.countUserOrders('user-123');
      expect(result).toBe(0);
    });

    it('should handle null count', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ count: null, error: null }))
          }))
        }))
      } as any);

      const result = await service.countUserOrders('user-123');
      expect(result).toBe(0);
    });

    it('should throw error on database failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ count: null, error: new Error('Database error') }))
          }))
        }))
      } as any);

      await expect(service.countUserOrders('user-123')).rejects.toThrow('Failed to count orders');
    });
  });

  describe('fetchDashboardStats', () => {
    it('should fetch and calculate stats in one call', async () => {
      const mockOrders = [
        { status: 'submitted', total_amount: 100, created_at: new Date().toISOString() },
        { status: 'completed', total_amount: 200, created_at: new Date().toISOString() }
      ];

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({ data: mockOrders, error: null }))
          }))
        }))
      } as any);

      const result = await service.fetchDashboardStats('user-123');
      
      expect(result.totalOrders).toBe(2);
      expect(result.totalSpent).toBe(300);
      expect(result.activeOrders).toBe(1);
    });
  });
});
