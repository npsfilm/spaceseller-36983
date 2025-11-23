import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/utils';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { OrderWizard } from '../OrderWizard';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [
            {
              id: 'service-1',
              name: 'Interior Photography',
              category: 'onsite',
              base_price: 150,
              is_active: true
            },
            {
              id: 'service-2',
              name: 'Photo Editing',
              category: 'editing',
              base_price: 50,
              is_active: true
            }
          ],
          error: null
        })),
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'draft-order-123', order_number: 'SS-2025-0001' },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null }))
      }))
    })),
    functions: {
      invoke: vi.fn((name) => {
        if (name === 'find-available-photographers') {
          return Promise.resolve({
            data: {
              available: true,
              photographers: [{ id: 'photographer-1' }],
              travelCost: 25,
              distance: 50
            },
            error: null
          });
        }
        return Promise.resolve({ data: null, error: null });
      })
    }
  }
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123', email: 'test@example.com' },
    session: { access_token: 'token' }
  })
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('OrderFlow Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Complete Photography Order Flow', () => {
    it('should complete full photography order from location check to submission', async () => {
      render(<OrderWizard />);

      // Step 1: Location Check
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      // Fill in address
      const streetInput = screen.getByLabelText(/Straße/i);
      const houseNumberInput = screen.getByLabelText(/Hausnummer/i);
      const postalCodeInput = screen.getByLabelText(/PLZ/i);
      const cityInput = screen.getByLabelText(/Stadt/i);

      await user.type(streetInput, 'Teststraße');
      await user.type(houseNumberInput, '123');
      await user.type(postalCodeInput, '86152');
      await user.type(cityInput, 'Augsburg');

      // Validate location
      const validateButton = screen.getByRole('button', { name: /Standort validieren/i });
      await user.click(validateButton);

      // Wait for validation success
      await waitFor(() => {
        expect(screen.getByText(/verfügbar/i)).toBeInTheDocument();
      });

      // Click next
      const nextButton = screen.getByRole('button', { name: /Weiter/i });
      await user.click(nextButton);

      // Step 2: Category Selection
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihre perfekte Dienstleistung/i)).toBeInTheDocument();
      });

      // Select photography category
      const photographyCard = screen.getByText(/Aufnahme vor Ort/i).closest('div[role="button"]');
      expect(photographyCard).toBeInTheDocument();
      await user.click(photographyCard!);

      // Click next
      const categoryNextButton = screen.getByRole('button', { name: /Weiter/i });
      await user.click(categoryNextButton);

      // Step 3: Photography Configuration
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihr Aufnahmepaket/i)).toBeInTheDocument();
      });

      // Select a package
      const basicPackage = screen.getByText(/Basic/i).closest('button');
      expect(basicPackage).toBeInTheDocument();
      await user.click(basicPackage!);

      // Submit order
      const submitButton = screen.getByRole('button', { name: /Bestellung aufgeben/i });
      await user.click(submitButton);

      // Verify navigation to confirmation
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation/draft-order-123');
      });
    });

    it('should handle out-of-area location gracefully', async () => {
      // Mock out-of-area response
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { available: false, photographers: [] },
        error: null
      });

      render(<OrderWizard />);

      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      // Fill in address
      await user.type(screen.getByLabelText(/Straße/i), 'Ferne Straße');
      await user.type(screen.getByLabelText(/Hausnummer/i), '999');
      await user.type(screen.getByLabelText(/PLZ/i), '99999');
      await user.type(screen.getByLabelText(/Stadt/i), 'Weitweg');

      // Validate location
      const validateButton = screen.getByRole('button', { name: /Standort validieren/i });
      await user.click(validateButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/außerhalb unseres aktuellen Servicebereichs/i)).toBeInTheDocument();
      });

      // Next button should remain disabled
      const nextButton = screen.getByRole('button', { name: /Weiter/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Photo Editing Order Flow', () => {
    it('should complete photo editing order with file uploads', async () => {
      render(<OrderWizard />);

      // Complete Step 1: Location Check
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/Straße/i), 'Teststraße');
      await user.type(screen.getByLabelText(/Hausnummer/i), '123');
      await user.type(screen.getByLabelText(/PLZ/i), '86152');
      await user.type(screen.getByLabelText(/Stadt/i), 'Augsburg');

      const validateButton = screen.getByRole('button', { name: /Standort validieren/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/verfügbar/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      // Step 2: Select Photo Editing Category
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihre perfekte Dienstleistung/i)).toBeInTheDocument();
      });

      const editingCard = screen.getByText(/Fotobearbeitung/i).closest('div[role="button"]');
      await user.click(editingCard!);
      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      // Step 3: Photo Editing Configuration
      await waitFor(() => {
        expect(screen.getByText(/Bilder hochladen/i)).toBeInTheDocument();
      });

      // Create mock file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/Bilder hochladen/i);
      
      await user.upload(fileInput, file);

      // Select editing options
      const colorCorrectionOption = screen.getByText(/Farbkorrektur/i).closest('div[role="button"]');
      await user.click(colorCorrectionOption!);

      // Submit order
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Bestellung aufgeben/i });
        expect(submitButton).not.toBeDisabled();
        return user.click(submitButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/order-confirmation/'));
      });
    });
  });

  describe('Navigation and Validation', () => {
    it('should prevent navigation to next step without completing current step', async () => {
      render(<OrderWizard />);

      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      // Try to click next without filling address
      const nextButton = screen.getByRole('button', { name: /Weiter/i });
      expect(nextButton).toBeDisabled();

      // Fill partial address
      await user.type(screen.getByLabelText(/Straße/i), 'Teststraße');

      // Next should still be disabled
      expect(nextButton).toBeDisabled();
    });

    it('should allow navigation back through steps', async () => {
      render(<OrderWizard />);

      // Complete Step 1
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/Straße/i), 'Teststraße');
      await user.type(screen.getByLabelText(/Hausnummer/i), '123');
      await user.type(screen.getByLabelText(/PLZ/i), '86152');
      await user.type(screen.getByLabelText(/Stadt/i), 'Augsburg');

      await user.click(screen.getByRole('button', { name: /Standort validieren/i }));

      await waitFor(() => {
        expect(screen.getByText(/verfügbar/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      // Now at Step 2
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihre perfekte Dienstleistung/i)).toBeInTheDocument();
      });

      // Go back
      const backButton = screen.getByRole('button', { name: /Zurück/i });
      await user.click(backButton);

      // Should be back at Step 1
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });
    });

    it('should preserve state when navigating back and forth', async () => {
      render(<OrderWizard />);

      // Complete Step 1
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      const testAddress = {
        street: 'Teststraße',
        number: '123',
        postal: '86152',
        city: 'Augsburg'
      };

      await user.type(screen.getByLabelText(/Straße/i), testAddress.street);
      await user.type(screen.getByLabelText(/Hausnummer/i), testAddress.number);
      await user.type(screen.getByLabelText(/PLZ/i), testAddress.postal);
      await user.type(screen.getByLabelText(/Stadt/i), testAddress.city);

      await user.click(screen.getByRole('button', { name: /Standort validieren/i }));
      await waitFor(() => expect(screen.getByText(/verfügbar/i)).toBeInTheDocument());
      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      // Select category
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihre perfekte Dienstleistung/i)).toBeInTheDocument();
      });

      const photographyCard = screen.getByText(/Aufnahme vor Ort/i).closest('div[role="button"]');
      await user.click(photographyCard!);

      // Go back
      await user.click(screen.getByRole('button', { name: /Zurück/i }));

      // Verify address is preserved
      await waitFor(() => {
        expect(screen.getByDisplayValue(testAddress.street)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testAddress.number)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testAddress.postal)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testAddress.city)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service loading errors gracefully', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: new Error('Failed to load services')
          }))
        }))
      } as any);

      render(<OrderWizard />);

      await waitFor(() => {
        expect(screen.getByText(/Fehler/i)).toBeInTheDocument();
      });
    });

    it('should handle order submission errors', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      render(<OrderWizard />);

      // Complete Steps 1 & 2
      await waitFor(() => {
        expect(screen.getByText(/Standort prüfen/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/Straße/i), 'Teststraße');
      await user.type(screen.getByLabelText(/Hausnummer/i), '123');
      await user.type(screen.getByLabelText(/PLZ/i), '86152');
      await user.type(screen.getByLabelText(/Stadt/i), 'Augsburg');

      await user.click(screen.getByRole('button', { name: /Standort validieren/i }));
      await waitFor(() => expect(screen.getByText(/verfügbar/i)).toBeInTheDocument());
      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihre perfekte Dienstleistung/i)).toBeInTheDocument();
      });

      const photographyCard = screen.getByText(/Aufnahme vor Ort/i).closest('div[role="button"]');
      await user.click(photographyCard!);
      await user.click(screen.getByRole('button', { name: /Weiter/i }));

      // Mock submission error
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({ error: new Error('Submission failed') }))
        }))
      } as any);

      // Try to submit
      await waitFor(() => {
        expect(screen.getByText(/Wählen Sie Ihr Aufnahmepaket/i)).toBeInTheDocument();
      });

      const basicPackage = screen.getByText(/Basic/i).closest('button');
      await user.click(basicPackage!);

      const submitButton = screen.getByRole('button', { name: /Bestellung aufgeben/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Fehler/i)).toBeInTheDocument();
      });

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
