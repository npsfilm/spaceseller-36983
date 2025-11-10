import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions';
import { MAPBOX_CONFIG } from '@/config/mapbox';

interface AddressSuggestion {
  place_name: string;
  center: [number, number];
  text: string;
  address?: string;
  context?: Array<{ id: string; text: string }>;
}

interface LocationCheckStepProps {
  address: {
    strasse: string;
    hausnummer: string;
    plz: string;
    stadt: string;
  };
  onUpdateAddress: (field: string, value: string) => void;
  onLocationValidated: (travelCost: number, distance: number) => void;
  onBack: () => void;
}

export const LocationCheckStep = ({ 
  address, 
  onUpdateAddress, 
  onLocationValidated,
  onBack 
}: LocationCheckStepProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    travelCost: number;
    distance: number;
    message: string;
  } | null>(null);
  
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize address input from existing address
  useEffect(() => {
    if (address.strasse || address.hausnummer || address.plz || address.stadt) {
      const fullAddress = [
        address.strasse,
        address.hausnummer,
        address.plz,
        address.stadt
      ].filter(Boolean).join(' ');
      setAddressInput(fullAddress);
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseAddressFromSuggestion = (suggestion: AddressSuggestion) => {
    // Extract house number from address field
    const houseNumber = suggestion.address || '';
    
    // Extract street name from text
    const streetName = suggestion.text || '';
    
    // Extract city and postal code from context
    let city = '';
    let postalCode = '';
    
    if (suggestion.context) {
      for (const ctx of suggestion.context) {
        if (ctx.id.startsWith('postcode')) {
          postalCode = ctx.text;
        } else if (ctx.id.startsWith('place')) {
          city = ctx.text;
        }
      }
    }
    
    return { streetName, houseNumber, city, postalCode };
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_CONFIG.accessToken });
      const response = await geocodingClient.forwardGeocode({
        query: `${query}, Deutschland`,
        limit: 5,
        countries: ['de'],
        types: ['address']
      }).send();

      if (response.body.features) {
        setSuggestions(response.body.features as AddressSuggestion[]);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAddressInputChange = (value: string) => {
    setAddressInput(value);
    setValidationResult(null);
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    const { streetName, houseNumber, city, postalCode } = parseAddressFromSuggestion(suggestion);
    
    setAddressInput(suggestion.place_name);
    setShowSuggestions(false);
    
    // Update all address fields
    onUpdateAddress('strasse', streetName);
    onUpdateAddress('hausnummer', houseNumber);
    onUpdateAddress('stadt', city);
    onUpdateAddress('plz', postalCode);
    
    // Validate if house number is present
    if (!houseNumber) {
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        message: 'Bitte geben Sie eine vollständige Adresse mit Hausnummer ein.'
      });
    }
  };

  const calculateTravelCost = (distanceKm: number): number => {
    let cost: number;
    
    if (distanceKm <= 200) {
      cost = distanceKm * MAPBOX_CONFIG.costPerKm;
    } else {
      cost = (200 * MAPBOX_CONFIG.costPerKm) + ((distanceKm - 200) * MAPBOX_CONFIG.costPerKmOver200);
    }
    
    // Round up to nearest 5 euros
    cost = Math.ceil(cost / 5) * 5;
    
    // Free if under threshold
    if (cost < MAPBOX_CONFIG.freeTravelThreshold) {
      return 0;
    }
    
    return cost;
  };

  const validateLocation = async () => {
    if (!address.strasse || !address.plz || !address.stadt) {
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        message: 'Bitte geben Sie eine vollständige Adresse ein.'
      });
      return;
    }

    if (!address.hausnummer) {
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        message: 'Bitte geben Sie eine Adresse mit Hausnummer ein.'
      });
      return;
    }

    // Check if Mapbox token is configured
    if (!MAPBOX_CONFIG.accessToken || MAPBOX_CONFIG.accessToken === 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE') {
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        message: 'Mapbox Token nicht konfiguriert. Bitte fügen Sie Ihren Mapbox Token in src/config/mapbox.ts hinzu.'
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Lazy initialize Mapbox clients
      const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_CONFIG.accessToken });
      const directionsClient = mbxDirections({ accessToken: MAPBOX_CONFIG.accessToken });
      const destinationAddress = `${address.strasse} ${address.hausnummer || ''}, ${address.plz} ${address.stadt}, Deutschland`.trim();
      
      // Geocode base address
      const baseResponse = await geocodingClient.forwardGeocode({
        query: MAPBOX_CONFIG.baseAddress,
        limit: 1
      }).send();
      
      // Geocode destination address
      const destResponse = await geocodingClient.forwardGeocode({
        query: destinationAddress,
        limit: 1
      }).send();
      
      if (!baseResponse.body.features.length || !destResponse.body.features.length) {
        setValidationResult({
          valid: false,
          travelCost: 0,
          distance: 0,
          message: 'Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.'
        });
        setIsValidating(false);
        return;
      }
      
      const baseCoords = baseResponse.body.features[0].geometry.coordinates;
      const destCoords = destResponse.body.features[0].geometry.coordinates;
      
      // Calculate route
      const routeResponse = await directionsClient.getDirections({
        profile: 'driving',
        waypoints: [
          { coordinates: baseCoords },
          { coordinates: destCoords }
        ]
      }).send();
      
      if (!routeResponse.body.routes.length) {
        setValidationResult({
          valid: false,
          travelCost: 0,
          distance: 0,
          message: 'Keine Route gefunden. Bitte kontaktieren Sie uns für weitere Informationen.'
        });
        setIsValidating(false);
        return;
      }
      
      const distanceMeters = routeResponse.body.routes[0].distance;
      const distanceKm = Math.round(distanceMeters / 1000);
      
      // Check if within service area (max 120km)
      if (distanceKm > 120) {
        setValidationResult({
          valid: false,
          travelCost: 0,
          distance: distanceKm,
          message: "Dieser Standort liegt außerhalb unseres aktuellen Servicebereichs für Fotografie. Wir arbeiten stetig am Ausbau unseres Servicebereichs. Unsere digitalen Dienstleistungen bieten wir deutschlandweit an."
        });
        setIsValidating(false);
        return;
      }
      
      const travelCost = calculateTravelCost(distanceKm);
      
      setValidationResult({
        valid: true,
        travelCost,
        distance: distanceKm,
        message: `Perfekt! Wir bieten Fotografie in ${address.stadt} an.`
      });
      
    } catch (error) {
      console.error('Location validation error:', error);
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        message: 'Fehler bei der Adressvalidierung. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const canValidate = addressInput.length > 0 && address.strasse && address.plz && address.stadt && address.hausnummer;
  const canProceed = validationResult?.valid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Wo befindet sich die Immobilie?</h2>
        <p className="text-muted-foreground">
          Geben Sie die vollständige Adresse mit Hausnummer ein
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <Label htmlFor="address">Adresse mit Hausnummer *</Label>
          <Input
            ref={inputRef}
            id="address"
            value={addressInput}
            onChange={(e) => handleAddressInputChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="z.B. Musterstraße 123, 80331 München"
            disabled={isValidating}
            className="w-full"
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 border-b border-border last:border-0"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <span className="text-sm">{suggestion.place_name}</span>
                </button>
              ))}
            </div>
          )}
          
          {isLoadingSuggestions && (
            <div className="absolute right-3 top-9">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <Button
          onClick={validateLocation}
          disabled={!canValidate || isValidating}
          className="w-full"
          size="lg"
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Prüfe Verfügbarkeit...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Verfügbarkeit prüfen
            </>
          )}
        </Button>

        {validationResult && (
          <Alert variant={validationResult.valid ? 'default' : 'destructive'}>
            {validationResult.valid ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{validationResult.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={onBack} className="w-32">
          Zurück
        </Button>
        <Button
          onClick={() => onLocationValidated(validationResult!.travelCost, validationResult!.distance)}
          disabled={!canProceed}
          className="flex-1"
          size="lg"
        >
          Weiter zu Services
        </Button>
      </div>
    </motion.div>
  );
};
