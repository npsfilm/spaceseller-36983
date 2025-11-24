import { describe, it, expect, beforeEach } from 'vitest';
import { OrderValidationService } from '@/lib/services/OrderValidationService';
import type { OrderState } from '@/lib/hooks/useOrderState';

describe('Order Validation Integration', () => {
  let validationService: OrderValidationService;

  beforeEach(() => {
    validationService = new OrderValidationService();
  });

  const createMockOrderState = (overrides: Partial<OrderState> = {}): OrderState => ({
    step: 1,
    selectedCategory: null,
    photographyAvailable: false,
    address: {
      strasse: '',
      hausnummer: '',
      plz: '',
      stadt: '',
      additional_info: ''
    },
    draftOrderId: null,
    travelCost: 0,
    distance: 0,
    locationValidated: false,
    selectedAreaRange: null,
    selectedProducts: {},
    selectedPackage: null,
    selectedAddOns: [],
    primaryDate: null,
    primaryTime: null,
    alternativeDate: null,
    alternativeTime: null,
    agbAccepted: false,
    privacyAccepted: false,
    ...overrides
  });

  describe('Location Step Validation', () => {
    it('should validate complete location data', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true
      });

      const result = validationService.validateLocationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with missing address fields', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: '',
          hausnummer: '',
          plz: '',
          stadt: '',
          additional_info: ''
        },
        locationValidated: false
      });

      const result = validationService.validateLocationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Straße ist erforderlich');
      expect(result.errors).toContain('Hausnummer ist erforderlich');
      expect(result.errors).toContain('PLZ ist erforderlich');
      expect(result.errors).toContain('Stadt ist erforderlich');
      expect(result.errors).toContain('Standort muss validiert werden');
    });

    it('should fail validation when location not validated', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: false
      });

      const result = validationService.validateLocationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Standort muss validiert werden');
    });
  });

  describe('Category Step Validation', () => {
    it('should validate selected category', () => {
      const orderState = createMockOrderState({
        selectedCategory: 'onsite'
      });

      const result = validationService.validateCategoryStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation without selected category', () => {
      const orderState = createMockOrderState({
        selectedCategory: null
      });

      const result = validationService.validateCategoryStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Kategorie muss ausgewählt werden');
    });
  });

  describe('Configuration Step Validation', () => {
    it('should validate with selected products', () => {
      const orderState = createMockOrderState({
        selectedProducts: {
          'service-1': {
            quantity: 1,
            unitPrice: 199,
            totalPrice: 199
          }
        }
      });

      const result = validationService.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with selected package', () => {
      const orderState = createMockOrderState({
        selectedPackage: 'basic-package'
      });

      const result = validationService.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation without products or package', () => {
      const orderState = createMockOrderState({
        selectedProducts: {},
        selectedPackage: null
      });

      const result = validationService.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mindestens ein Produkt oder Paket muss ausgewählt werden');
    });
  });

  describe('Complete Order Validation', () => {
    it('should validate complete order', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite',
        selectedPackage: 'basic-package'
      });

      const result = validationService.validateOrder(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should aggregate all validation errors', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: '',
          hausnummer: '',
          plz: '',
          stadt: '',
          additional_info: ''
        },
        locationValidated: false,
        selectedCategory: null,
        selectedProducts: {},
        selectedPackage: null
      });

      const result = validationService.validateOrder(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Straße ist erforderlich');
      expect(result.errors).toContain('Kategorie muss ausgewählt werden');
      expect(result.errors).toContain('Mindestens ein Produkt oder Paket muss ausgewählt werden');
    });
  });

  describe('Navigation Validation', () => {
    it('should allow navigation to step 2 with valid location', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true
      });

      const canNavigate = validationService.canNavigateToStep(1, orderState);

      expect(canNavigate).toBe(true);
    });

    it('should prevent navigation to step 2 without valid location', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: '',
          hausnummer: '',
          plz: '',
          stadt: '',
          additional_info: ''
        },
        locationValidated: false
      });

      const canNavigate = validationService.canNavigateToStep(1, orderState);

      expect(canNavigate).toBe(false);
    });

    it('should allow navigation to step 3 with valid location and category', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite'
      });

      const canNavigate = validationService.canNavigateToStep(2, orderState);

      expect(canNavigate).toBe(true);
    });
  });

  describe('Order Submission Readiness', () => {
    it('should allow submission with complete order', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite',
        selectedPackage: 'basic-package',
        draftOrderId: 'draft-123'
      });

      const canSubmit = validationService.canSubmitOrder(orderState);

      expect(canSubmit).toBe(true);
    });

    it('should prevent submission with incomplete order', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '86152',
          stadt: 'Augsburg',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite',
        selectedProducts: {},
        selectedPackage: null
      });

      const canSubmit = validationService.canSubmitOrder(orderState);

      expect(canSubmit).toBe(false);
    });
  });
});
