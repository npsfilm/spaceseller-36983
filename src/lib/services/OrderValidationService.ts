import type { OrderState } from '@/lib/hooks/useOrderState';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Service for validating order state and completeness
 */
export class OrderValidationService {
  /**
   * Validate if location step is complete
   */
  validateLocationStep(orderState: OrderState): ValidationResult {
    const errors: string[] = [];

    if (!orderState.address.strasse) {
      errors.push('Straße ist erforderlich');
    }

    if (!orderState.address.hausnummer) {
      errors.push('Hausnummer ist erforderlich');
    }

    if (!orderState.address.plz) {
      errors.push('PLZ ist erforderlich');
    }

    if (!orderState.address.stadt) {
      errors.push('Stadt ist erforderlich');
    }

    if (!orderState.locationValidated) {
      errors.push('Standort muss validiert werden');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate if category step is complete
   */
  validateCategoryStep(orderState: OrderState): ValidationResult {
    const errors: string[] = [];

    if (!orderState.selectedCategory) {
      errors.push('Kategorie muss ausgewählt werden');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate if configuration step is complete
   */
  validateConfigurationStep(orderState: OrderState): ValidationResult {
    const errors: string[] = [];

    const hasProducts = Object.keys(orderState.selectedProducts).length > 0;
    const hasPackage = orderState.selectedPackage !== null;

    if (!hasProducts && !hasPackage) {
      errors.push('Mindestens ein Produkt oder Paket muss ausgewählt werden');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate entire order before submission
   */
  validateOrder(orderState: OrderState): ValidationResult {
    const locationValidation = this.validateLocationStep(orderState);
    const categoryValidation = this.validateCategoryStep(orderState);
    const configValidation = this.validateConfigurationStep(orderState);

    const allErrors = [
      ...locationValidation.errors,
      ...categoryValidation.errors,
      ...configValidation.errors
    ];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Check if navigation to next step is allowed
   */
  canNavigateToStep(currentStep: number, orderState: OrderState): boolean {
    switch (currentStep) {
      case 1:
        return this.validateLocationStep(orderState).isValid;
      case 2:
        return (
          this.validateLocationStep(orderState).isValid &&
          this.validateCategoryStep(orderState).isValid
        );
      case 3:
        return (
          this.validateLocationStep(orderState).isValid &&
          this.validateCategoryStep(orderState).isValid
        );
      default:
        return false;
    }
  }

  /**
   * Check if order can be submitted
   */
  canSubmitOrder(orderState: OrderState): boolean {
    return this.validateOrder(orderState).isValid;
  }
}

// Export singleton instance
export const orderValidationService = new OrderValidationService();
