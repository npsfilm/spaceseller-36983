import { useState } from 'react';
import { locationService } from '@/lib/services/LocationService';
import { travelCostCalculator } from '@/lib/services/TravelCostCalculator';
import { photographerMatchingService } from '@/lib/services/PhotographerMatchingService';
import { LocationService } from '@/lib/services/LocationService';

export interface ValidationResult {
  valid: boolean;
  travelCost: number;
  distance: number;
  photographyAvailable: boolean;
  message: string;
}

export interface Address {
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
}

/**
 * Custom hook for validating location and calculating travel costs
 */
export const useLocationValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateLocation = async (address: Address): Promise<ValidationResult> => {
    // Check for required fields
    if (!address.strasse || !address.plz || !address.stadt) {
      const result: ValidationResult = {
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
        message: 'Bitte geben Sie eine vollständige Adresse ein.'
      };
      setValidationResult(result);
      return result;
    }

    if (!address.hausnummer) {
      const result: ValidationResult = {
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
        message: 'Bitte geben Sie eine Adresse mit Hausnummer ein.'
      };
      setValidationResult(result);
      return result;
    }

    // Check Mapbox token configuration
    if (!LocationService.isTokenConfigured()) {
      const result: ValidationResult = {
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
        message: 'Mapbox Token nicht konfiguriert. Bitte fügen Sie Ihren Mapbox Token in src/config/mapbox.ts hinzu.'
      };
      setValidationResult(result);
      return result;
    }

    setIsValidating(true);
    
    try {
      // Geocode the address
      const geocodeResult = await locationService.geocodeAddress(address);
      
      if (!geocodeResult) {
        const result: ValidationResult = {
          valid: false,
          travelCost: 0,
          distance: 0,
          photographyAvailable: false,
          message: 'Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.'
        };
        setValidationResult(result);
        return result;
      }
      
      const [longitude, latitude] = geocodeResult.coordinates;
      
      // Find available photographers
      const photographerAvailability = await photographerMatchingService.findAvailablePhotographers(
        latitude,
        longitude,
        150 // max distance
      );

      if (!photographerAvailability.available) {
        // Photography not available, but allow digital services
        const result: ValidationResult = {
          valid: true,
          travelCost: 0,
          distance: 0,
          photographyAvailable: false,
          message: "✅ Fotografie vor Ort ist in Ihrer Region aktuell noch nicht verfügbar. Unsere digitalen Dienstleistungen bieten wir aber selbstverständlich für Sie an."
        };
        setValidationResult(result);
        return result;
      }

      // Photography available - calculate travel cost
      const nearestPhotographer = photographerAvailability.photographers[0];
      const travelCost = travelCostCalculator.calculateTravelCost(nearestPhotographer.distance_km);
      
      const result: ValidationResult = {
        valid: true,
        travelCost,
        distance: nearestPhotographer.distance_km,
        photographyAvailable: true,
        message: "Fotografie vor Ort in Ihrer Region verfügbar."
      };
      setValidationResult(result);
      return result;
      
    } catch (error) {
      console.error('Location validation error:', error);
      const result: ValidationResult = {
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
        message: 'Fehler bei der Adressvalidierung. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
      };
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
  };

  return {
    isValidating,
    validationResult,
    validateLocation,
    resetValidation
  };
};
