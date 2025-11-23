import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDetailService } from './OrderDetailService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('OrderDetailService', () => {
  let service: OrderDetailService;

  beforeEach(() => {
    service = new OrderDetailService();
    vi.clearAllMocks();
  });

  describe('fetchOrderDetails', () => {
    it('should fetch all order details successfully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockResponse = {
        data: [{ id: '1', quantity: 1, total_price: 100 }],
        error: null,
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue(mockResponse),
        }),
      });

      const result = await service.fetchOrderDetails('order-123');

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('uploads');
      expect(result).toHaveProperty('deliverables');
      expect(result).toHaveProperty('addresses');
    });

    it('should return empty arrays on error', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockResponse = {
        data: null,
        error: null,
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue(mockResponse),
        }),
      });

      const result = await service.fetchOrderDetails('order-123');

      expect(result.items).toEqual([]);
      expect(result.uploads).toEqual([]);
      expect(result.deliverables).toEqual([]);
      expect(result.addresses).toEqual([]);
    });
  });

  describe('fetchPhotographers', () => {
    it('should return empty array when no photographers exist', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      const result = await service.fetchPhotographers();
      expect(result).toEqual([]);
    });

    it('should format photographer data correctly', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockRoles = [{ user_id: 'user-1', role: 'photographer' }];
      const mockProfiles = [
        { id: 'user-1', vorname: 'John', nachname: 'Doe', email: 'john@example.com' },
      ];

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: mockRoles, error: null }),
            }),
          };
        }
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({ data: mockProfiles, error: null }),
            }),
          };
        }
      });

      const result = await service.fetchPhotographers();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockUpdate = vi.fn().mockResolvedValue({ error: null });
      
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: mockUpdate,
        }),
      });

      await service.updateOrderStatus('order-123', 'completed');
      
      expect(supabase.from).toHaveBeenCalledWith('orders');
    });

    it('should throw error on update failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockError = new Error('Update failed');
      
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: mockError }),
        }),
      });

      await expect(
        service.updateOrderStatus('order-123', 'completed')
      ).rejects.toThrow('Update failed');
    });
  });

  describe('downloadFile', () => {
    it('should create download link and trigger download', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockBlob = new Blob(['test'], { type: 'text/plain' });
      
      (supabase.storage.from as any).mockReturnValue({
        download: vi.fn().mockResolvedValue({ data: mockBlob, error: null }),
      });

      // Mock DOM APIs
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
        click: mockClick,
        href: '',
        download: '',
      } as any);

      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;

      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
      global.URL.revokeObjectURL = vi.fn();

      await service.downloadFile('path/file.txt', 'file.txt', 'test-bucket');

      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();

      mockCreateElement.mockRestore();
    });
  });
});
