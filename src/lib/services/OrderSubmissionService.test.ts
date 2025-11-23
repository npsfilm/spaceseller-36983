import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderSubmissionService } from './OrderSubmissionService';
import type { OrderState } from '@/lib/hooks/useOrderState';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null }))
      })),
      insert: vi.fn(() => ({ error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ data: [{ user_id: 'admin-1' }], error: null }))
      }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }
  }
}));

describe('OrderSubmissionService', () => {
  let service: OrderSubmissionService;
  let mockOrderState: OrderState;

  beforeEach(() => {
    service = new OrderSubmissionService();
    mockOrderState = {
      step: 3,
      selectedCategory: 'onsite',
      photographyAvailable: true,
      address: {
        strasse: 'Teststraße',
        hausnummer: '123',
        plz: '12345',
        stadt: 'Teststadt',
        additional_info: ''
      },
      draftOrderId: 'order-123',
      travelCost: 25,
      distance: 50,
      locationValidated: true,
      selectedAreaRange: '100-199',
      selectedProducts: {},
      selectedPackage: 'basic-package'
    };
  });

  describe('submitOrder', () => {
    it('should successfully submit an order', async () => {
      const result = await service.submitOrder('user-123', mockOrderState, 'onsite');

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('order-123');
      expect(result.error).toBeUndefined();
    });

    it('should fail if no draft order ID exists', async () => {
      mockOrderState.draftOrderId = null;

      const result = await service.submitOrder('user-123', mockOrderState, 'onsite');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No draft order ID found');
    });

    it('should handle submission errors gracefully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: new Error('Database error') }))
        }))
      } as any);

      const result = await service.submitOrder('user-123', mockOrderState, 'onsite');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
