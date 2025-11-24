import { describe, it, expect } from 'vitest';
import { photographerPaymentCalculator } from './PhotographerPaymentCalculator';
import type { OrderItem } from './OrderDetailService';

describe('PhotographerPaymentCalculator', () => {
  describe('calculateSuggestedPayment', () => {
    it('should calculate payment for budget tier package', () => {
      const items: OrderItem[] = [
        {
          id: '1',
          quantity: 1,
          unit_price: 199,
          total_price: 199,
          item_notes: JSON.stringify({
            package_id: 'photo-basic-s',
            tier: 'budget',
            photo_count: 6
          }),
          services: { name: 'Basic S', category: 'photography' }
        }
      ];

      const payment = photographerPaymentCalculator.calculateSuggestedPayment(items);
      expect(payment).toBe(80);
    });

    it('should calculate payment for premium tier package', () => {
      const items: OrderItem[] = [
        {
          id: '1',
          quantity: 1,
          unit_price: 499,
          total_price: 499,
          item_notes: JSON.stringify({
            package_id: 'photo-premium-m',
            tier: 'premium',
            photo_count: 18
          }),
          services: { name: 'Premium M', category: 'photography' }
        }
      ];

      const payment = photographerPaymentCalculator.calculateSuggestedPayment(items);
      expect(payment).toBe(180);
    });

    it('should add extra for large shoots (>20 photos)', () => {
      const items: OrderItem[] = [
        {
          id: '1',
          quantity: 1,
          unit_price: 699,
          total_price: 699,
          item_notes: JSON.stringify({
            package_id: 'photo-premium-l',
            tier: 'premium',
            photo_count: 25
          }),
          services: { name: 'Premium L', category: 'photography' }
        }
      ];

      const payment = photographerPaymentCalculator.calculateSuggestedPayment(items);
      expect(payment).toBe(210); // 180 + 30 for large shoot
    });

    it('should estimate from price when notes are missing', () => {
      const items: OrderItem[] = [
        {
          id: '1',
          quantity: 1,
          unit_price: 300,
          total_price: 300,
          item_notes: null,
          services: { name: 'Unknown Service', category: 'photography' }
        }
      ];

      const payment = photographerPaymentCalculator.calculateSuggestedPayment(items);
      expect(payment).toBe(135); // 300 * 0.45 = 135
    });

    it('should sum payments for multiple items', () => {
      const items: OrderItem[] = [
        {
          id: '1',
          quantity: 1,
          unit_price: 199,
          total_price: 199,
          item_notes: JSON.stringify({
            package_id: 'photo-basic-s',
            tier: 'budget',
            photo_count: 6
          }),
          services: { name: 'Basic S', category: 'photography' }
        },
        {
          id: '2',
          quantity: 1,
          unit_price: 499,
          total_price: 499,
          item_notes: JSON.stringify({
            package_id: 'photo-premium-m',
            tier: 'premium',
            photo_count: 18
          }),
          services: { name: 'Premium M', category: 'photography' }
        }
      ];

      const payment = photographerPaymentCalculator.calculateSuggestedPayment(items);
      expect(payment).toBe(260); // 80 + 180
    });
  });
});
