import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOrderState } from '@/lib/hooks/useOrderState';
import { ReactNode } from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [
            {
              id: 'service-1',
              name: 'Photography Service',
              category: 'onsite',
              base_price: 199,
              is_active: true
            }
          ],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'draft-order-123' },
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    session: { access_token: 'token' }
  })
}));

describe('Order State Management', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
        expect(result.current.orderState.selectedCategory).toBeNull();
        expect(result.current.orderState.selectedPackage).toBeNull();
        expect(result.current.orderState.locationValidated).toBe(false);
      });
    });

    it('should load services on mount', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.services).toHaveLength(1);
        expect(result.current.services[0].name).toBe('Photography Service');
      });
    });

    it('should create draft order on mount', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.draftOrderId).toBe('draft-order-123');
      });
    });
  });

  describe('Step Navigation', () => {
    it('should navigate to next step', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });

      result.current.nextStep();

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(2);
      });
    });

    it('should navigate to previous step', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });

      result.current.nextStep();
      
      await waitFor(() => {
        expect(result.current.orderState.step).toBe(2);
      });

      result.current.prevStep();

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });
    });

    it('should not go below step 1', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });

      result.current.prevStep();

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });
    });

    it('should not go above step 3', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(1);
      });

      // Go to step 3
      result.current.nextStep();
      result.current.nextStep();

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(3);
      });

      // Try to go further
      result.current.nextStep();

      await waitFor(() => {
        expect(result.current.orderState.step).toBe(3);
      });
    });
  });

  describe('Address Management', () => {
    it('should update address fields', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState).toBeDefined();
      });

      result.current.updateAddressField('strasse', 'Teststraße');
      result.current.updateAddressField('hausnummer', '123');
      result.current.updateAddressField('plz', '86152');
      result.current.updateAddressField('stadt', 'Augsburg');

      await waitFor(() => {
        expect(result.current.orderState.address.strasse).toBe('Teststraße');
        expect(result.current.orderState.address.hausnummer).toBe('123');
        expect(result.current.orderState.address.plz).toBe('86152');
        expect(result.current.orderState.address.stadt).toBe('Augsburg');
      });
    });
  });

  describe('Location Validation', () => {
    it('should update location validation state', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.locationValidated).toBe(false);
      });

      result.current.setLocationValidation(25, 50, true);

      await waitFor(() => {
        expect(result.current.orderState.locationValidated).toBe(true);
        expect(result.current.orderState.travelCost).toBe(25);
        expect(result.current.orderState.distance).toBe(50);
        expect(result.current.orderState.photographyAvailable).toBe(true);
      });
    });
  });

  describe('Category Selection', () => {
    it('should set selected category', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.selectedCategory).toBeNull();
      });

      result.current.setCategory('onsite');

      await waitFor(() => {
        expect(result.current.orderState.selectedCategory).toBe('onsite');
      });
    });
  });

  describe('Product Selection', () => {
    it('should toggle product selection', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(Object.keys(result.current.orderState.selectedProducts)).toHaveLength(0);
      });

      result.current.toggleProduct('service-1', 1, 199);

      await waitFor(() => {
        expect(result.current.orderState.selectedProducts['service-1']).toEqual({
          quantity: 1,
          unitPrice: 199,
          totalPrice: 199
        });
      });
    });

    it('should remove product when quantity is 0', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState).toBeDefined();
      });

      // Add product
      result.current.toggleProduct('service-1', 1, 199);

      await waitFor(() => {
        expect(result.current.orderState.selectedProducts['service-1']).toBeDefined();
      });

      // Remove product
      result.current.toggleProduct('service-1', 0, 199);

      await waitFor(() => {
        expect(result.current.orderState.selectedProducts['service-1']).toBeUndefined();
      });
    });

    it('should update product quantity', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState).toBeDefined();
      });

      result.current.toggleProduct('service-1', 2, 199);

      await waitFor(() => {
        expect(result.current.orderState.selectedProducts['service-1']).toEqual({
          quantity: 2,
          unitPrice: 199,
          totalPrice: 398
        });
      });
    });
  });

  describe('Package Selection', () => {
    it('should set selected package', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.selectedPackage).toBeNull();
      });

      result.current.setPackage('basic-package');

      await waitFor(() => {
        expect(result.current.orderState.selectedPackage).toBe('basic-package');
      });
    });

    it('should clear selected package when set to null', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState).toBeDefined();
      });

      result.current.setPackage('basic-package');

      await waitFor(() => {
        expect(result.current.orderState.selectedPackage).toBe('basic-package');
      });

      result.current.setPackage(null);

      await waitFor(() => {
        expect(result.current.orderState.selectedPackage).toBeNull();
      });
    });
  });

  describe('Area Range Selection', () => {
    it('should set area range', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState.selectedAreaRange).toBeNull();
      });

      result.current.setAreaRange('100-199');

      await waitFor(() => {
        expect(result.current.orderState.selectedAreaRange).toBe('100-199');
      });
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple updates', async () => {
      const { result } = renderHook(() => useOrderState(), { wrapper });

      await waitFor(() => {
        expect(result.current.orderState).toBeDefined();
      });

      // Perform multiple state updates
      result.current.updateAddressField('strasse', 'Teststraße');
      result.current.setLocationValidation(25, 50, true);
      result.current.setCategory('onsite');
      result.current.setPackage('basic-package');

      await waitFor(() => {
        expect(result.current.orderState.address.strasse).toBe('Teststraße');
        expect(result.current.orderState.locationValidated).toBe(true);
        expect(result.current.orderState.selectedCategory).toBe('onsite');
        expect(result.current.orderState.selectedPackage).toBe('basic-package');
      });
    });
  });
});
