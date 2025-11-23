import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignmentDataService, Assignment } from './AssignmentDataService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({ data: [], error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null }))
      })),
      insert: vi.fn(() => ({ error: null }))
    }))
  }
}));

describe('AssignmentDataService', () => {
  let service: AssignmentDataService;

  beforeEach(() => {
    service = new AssignmentDataService();
    vi.clearAllMocks();
  });

  const createMockAssignment = (overrides = {}): Assignment => ({
    id: '1',
    order_id: 'order-1',
    status: 'pending',
    scheduled_date: '2025-02-15',
    scheduled_time: '14:00',
    admin_notes: null,
    photographer_notes: null,
    responded_at: null,
    orders: {
      order_number: 'SS-2025-0001',
      special_instructions: null,
      user_id: 'user-1',
      total_amount: 200,
      profiles: {
        vorname: 'John',
        nachname: 'Doe',
        email: 'john@example.com',
        telefon: '+49123456789'
      }
    },
    addresses: [{
      strasse: 'Teststraße',
      hausnummer: '123',
      plz: '86152',
      stadt: 'Augsburg',
      land: 'Deutschland'
    }],
    order_items: [{
      quantity: 2,
      total_price: 200,
      services: { name: 'Interior Photography' }
    }],
    ...overrides
  });

  describe('calculateStats', () => {
    it('should calculate correct statistics', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ status: 'pending' }),
        createMockAssignment({ id: '2', status: 'pending' }),
        createMockAssignment({ id: '3', status: 'accepted' }),
        createMockAssignment({ id: '4', status: 'completed' }),
        createMockAssignment({ id: '5', status: 'declined' })
      ];

      const stats = service.calculateStats(assignments);

      expect(stats.pending).toBe(2);
      expect(stats.accepted).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.declined).toBe(1);
      expect(stats.total).toBe(5);
    });

    it('should return zero stats for empty array', () => {
      const stats = service.calculateStats([]);

      expect(stats.pending).toBe(0);
      expect(stats.accepted).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.declined).toBe(0);
      expect(stats.total).toBe(0);
    });
  });

  describe('filterByStatus', () => {
    it('should filter assignments by status', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ status: 'pending' }),
        createMockAssignment({ id: '2', status: 'accepted' }),
        createMockAssignment({ id: '3', status: 'pending' })
      ];

      const pending = service.filterByStatus(assignments, 'pending');
      const accepted = service.filterByStatus(assignments, 'accepted');

      expect(pending).toHaveLength(2);
      expect(accepted).toHaveLength(1);
    });

    it('should return empty array when no matches', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ status: 'pending' })
      ];

      const completed = service.filterByStatus(assignments, 'completed');
      expect(completed).toHaveLength(0);
    });
  });

  describe('groupByStatus', () => {
    it('should group assignments by status', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ status: 'pending' }),
        createMockAssignment({ id: '2', status: 'accepted' }),
        createMockAssignment({ id: '3', status: 'pending' }),
        createMockAssignment({ id: '4', status: 'completed' })
      ];

      const grouped = service.groupByStatus(assignments);

      expect(grouped.pending).toHaveLength(2);
      expect(grouped.accepted).toHaveLength(1);
      expect(grouped.completed).toHaveLength(1);
      expect(grouped.declined).toHaveLength(0);
    });
  });

  describe('getCustomerName', () => {
    it('should return formatted customer name', () => {
      const assignment = createMockAssignment();
      const name = service.getCustomerName(assignment);
      expect(name).toBe('John Doe');
    });

    it('should handle missing vorname', () => {
      const assignment = createMockAssignment({
        orders: {
          ...createMockAssignment().orders,
          profiles: { vorname: '', nachname: 'Doe', email: 'test@test.com', telefon: null }
        }
      });
      const name = service.getCustomerName(assignment);
      expect(name).toBe('Doe');
    });
  });

  describe('getFormattedAddress', () => {
    it('should return formatted address', () => {
      const assignment = createMockAssignment();
      const address = service.getFormattedAddress(assignment);
      expect(address).toBe('Teststraße 123, 86152 Augsburg');
    });

    it('should return default message when no addresses', () => {
      const assignment = createMockAssignment({ addresses: [] });
      const address = service.getFormattedAddress(assignment);
      expect(address).toBe('Keine Adresse');
    });
  });

  describe('formatScheduledDateTime', () => {
    it('should format date and time', () => {
      const assignment = createMockAssignment({
        scheduled_date: '2025-02-15',
        scheduled_time: '14:00'
      });
      
      const formatted = service.formatScheduledDateTime(assignment);
      expect(formatted).toContain('Februar');
      expect(formatted).toContain('2025');
      expect(formatted).toContain('14:00');
    });

    it('should format date only when no time', () => {
      const assignment = createMockAssignment({
        scheduled_date: '2025-02-15',
        scheduled_time: null
      });
      
      const formatted = service.formatScheduledDateTime(assignment);
      expect(formatted).toContain('Februar');
      expect(formatted).not.toContain('um');
    });

    it('should return null when no scheduled date', () => {
      const assignment = createMockAssignment({ scheduled_date: null });
      const formatted = service.formatScheduledDateTime(assignment);
      expect(formatted).toBeNull();
    });
  });

  describe('isOverdue', () => {
    it('should return false for pending assignments', () => {
      const assignment = createMockAssignment({ 
        status: 'pending',
        scheduled_date: '2020-01-01' 
      });
      expect(service.isOverdue(assignment)).toBe(false);
    });

    it('should return false when no scheduled date', () => {
      const assignment = createMockAssignment({ 
        status: 'accepted',
        scheduled_date: null 
      });
      expect(service.isOverdue(assignment)).toBe(false);
    });

    it('should return true for accepted assignment with past date', () => {
      const assignment = createMockAssignment({ 
        status: 'accepted',
        scheduled_date: '2020-01-01' 
      });
      expect(service.isOverdue(assignment)).toBe(true);
    });

    it('should return false for accepted assignment with future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const assignment = createMockAssignment({ 
        status: 'accepted',
        scheduled_date: futureDate.toISOString() 
      });
      expect(service.isOverdue(assignment)).toBe(false);
    });
  });

  describe('sortByScheduledDate', () => {
    it('should sort by date ascending', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ id: '1', scheduled_date: '2025-03-15' }),
        createMockAssignment({ id: '2', scheduled_date: '2025-01-15' }),
        createMockAssignment({ id: '3', scheduled_date: '2025-02-15' })
      ];

      const sorted = service.sortByScheduledDate(assignments, true);
      
      expect(sorted[0].id).toBe('2'); // Jan
      expect(sorted[1].id).toBe('3'); // Feb
      expect(sorted[2].id).toBe('1'); // Mar
    });

    it('should sort by date descending', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ id: '1', scheduled_date: '2025-01-15' }),
        createMockAssignment({ id: '2', scheduled_date: '2025-03-15' }),
        createMockAssignment({ id: '3', scheduled_date: '2025-02-15' })
      ];

      const sorted = service.sortByScheduledDate(assignments, false);
      
      expect(sorted[0].id).toBe('2'); // Mar
      expect(sorted[1].id).toBe('3'); // Feb
      expect(sorted[2].id).toBe('1'); // Jan
    });

    it('should handle null dates (put at end)', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ id: '1', scheduled_date: '2025-02-15' }),
        createMockAssignment({ id: '2', scheduled_date: null }),
        createMockAssignment({ id: '3', scheduled_date: '2025-01-15' })
      ];

      const sorted = service.sortByScheduledDate(assignments, true);
      
      expect(sorted[2].id).toBe('2'); // null at end
    });

    it('should not mutate original array', () => {
      const assignments: Assignment[] = [
        createMockAssignment({ id: '1', scheduled_date: '2025-03-15' }),
        createMockAssignment({ id: '2', scheduled_date: '2025-01-15' })
      ];
      
      const original = [...assignments];
      service.sortByScheduledDate(assignments);
      expect(assignments).toEqual(original);
    });
  });

  describe('fetchPhotographerAssignments', () => {
    it('should fetch assignments successfully', async () => {
      const mockAssignments = [createMockAssignment()];

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({ data: mockAssignments, error: null }))
          }))
        }))
      } as any);

      const result = await service.fetchPhotographerAssignments('photographer-123');
      expect(result).toEqual(mockAssignments);
    });

    it('should handle empty result', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({ data: null, error: null }))
          }))
        }))
      } as any);

      const result = await service.fetchPhotographerAssignments('photographer-123');
      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({ data: null, error: new Error('Database error') }))
          }))
        }))
      } as any);

      await expect(service.fetchPhotographerAssignments('photographer-123'))
        .rejects.toThrow('Failed to fetch assignments');
    });
  });

  describe('acceptAssignment', () => {
    it('should accept assignment successfully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: null }))
        }))
      } as any);

      await expect(service.acceptAssignment('assignment-123')).resolves.not.toThrow();
    });

    it('should throw error on update failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: new Error('Update error') }))
        }))
      } as any);

      await expect(service.acceptAssignment('assignment-123'))
        .rejects.toThrow('Failed to accept assignment');
    });
  });

  describe('declineAssignment', () => {
    it('should decline assignment with reason', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: null }))
        }))
      } as any);

      await expect(service.declineAssignment('assignment-123', 'Not available'))
        .resolves.not.toThrow();
    });

    it('should throw error on update failure', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: new Error('Update error') }))
        }))
      } as any);

      await expect(service.declineAssignment('assignment-123', 'reason'))
        .rejects.toThrow('Failed to decline assignment');
    });
  });
});
