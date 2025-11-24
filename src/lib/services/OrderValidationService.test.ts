import { describe, it, expect } from 'vitest';
import { OrderValidationService } from './OrderValidationService';
import type { OrderState } from '@/lib/hooks/useOrderState';

describe('OrderValidationService', () => {
  const service = new OrderValidationService();

  const createMockOrderState = (overrides?: Partial<OrderState>): OrderState => ({
    step: 1,
    selectedCategory: null,
    photographyAvailable: true,
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
    specialInstructions: '',
    agbAccepted: false,
    privacyAccepted: false,
    ...overrides
  });

  describe('validateLocationStep', () => {
    it('should return invalid if address fields are missing', () => {
      const orderState = createMockOrderState();
      const result = service.validateLocationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Straße ist erforderlich');
      expect(result.errors).toContain('Hausnummer ist erforderlich');
      expect(result.errors).toContain('PLZ ist erforderlich');
      expect(result.errors).toContain('Stadt ist erforderlich');
    });

    it('should return invalid if location is not validated', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '12345',
          stadt: 'Teststadt',
          additional_info: ''
        },
        locationValidated: false
      });

      const result = service.validateLocationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Standort muss validiert werden');
    });

    it('should return valid for complete location', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '12345',
          stadt: 'Teststadt',
          additional_info: ''
        },
        locationValidated: true
      });

      const result = service.validateLocationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateCategoryStep', () => {
    it('should return invalid if no category selected', () => {
      const orderState = createMockOrderState();
      const result = service.validateCategoryStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Kategorie muss ausgewählt werden');
    });

    it('should return valid if category is selected', () => {
      const orderState = createMockOrderState({
        selectedCategory: 'onsite'
      });

      const result = service.validateCategoryStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateConfigurationStep', () => {
    it('should return invalid if no products or packages selected', () => {
      const orderState = createMockOrderState();
      const result = service.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mindestens ein Produkt oder Paket muss ausgewählt werden');
    });

    it('should return valid if products are selected', () => {
      const orderState = createMockOrderState({
        selectedProducts: {
          'service-1': { quantity: 2, unitPrice: 50, totalPrice: 100 }
        }
      });

      const result = service.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid if package is selected', () => {
      const orderState = createMockOrderState({
        selectedPackage: 'basic-package'
      });

      const result = service.validateConfigurationStep(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateOrder', () => {
    it('should aggregate all validation errors', () => {
      const orderState = createMockOrderState();
      const result = service.validateOrder(orderState);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return valid for complete order', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '12345',
          stadt: 'Teststadt',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite',
        selectedPackage: 'basic-package'
      });

      const result = service.validateOrder(orderState);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('canSubmitOrder', () => {
    it('should return false for incomplete order', () => {
      const orderState = createMockOrderState();
      const canSubmit = service.canSubmitOrder(orderState);

      expect(canSubmit).toBe(false);
    });

    it('should return true for complete order', () => {
      const orderState = createMockOrderState({
        address: {
          strasse: 'Teststraße',
          hausnummer: '123',
          plz: '12345',
          stadt: 'Teststadt',
          additional_info: ''
        },
        locationValidated: true,
        selectedCategory: 'onsite',
        selectedPackage: 'basic-package'
      });

      const canSubmit = service.canSubmitOrder(orderState);

      expect(canSubmit).toBe(true);
    });
  });
});
