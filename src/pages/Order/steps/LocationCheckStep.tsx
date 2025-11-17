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
import { supabase } from '@/integrations/supabase/client';

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
  onLocationValidated: (travelCost: number, distance: number, photographyAvailable: boolean) => void;
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
    photographyAvailable: boolean;
    message: string;
  } | null>(null);
  
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
    
    // Cancel previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
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
        photographyAvailable: false,
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
        photographyAvailable: false,
        message: 'Bitte geben Sie eine vollständige Adresse ein.'
      });
      return;
    }

    if (!address.hausnummer) {
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
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
        photographyAvailable: false,
        message: 'Mapbox Token nicht konfiguriert. Bitte fügen Sie Ihren Mapbox Token in src/config/mapbox.ts hinzu.'
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Lazy initialize Mapbox clients
      const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_CONFIG.accessToken });
      const destinationAddress = `${address.strasse} ${address.hausnummer || ''}, ${address.plz} ${address.stadt}, Deutschland`.trim();
      
      // Geocode destination address
      const destResponse = await geocodingClient.forwardGeocode({
        query: destinationAddress,
        limit: 1
      }).send();
      
      if (!destResponse.body.features.length) {
        setValidationResult({
          valid: false,
          travelCost: 0,
          distance: 0,
          photographyAvailable: false,
          message: 'Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.'
        });
        setIsValidating(false);
        return;
      }
      
      const destCoords = destResponse.body.features[0].geometry.coordinates;
      
      // Call find-available-photographers edge function
      const { data: photographersData, error: photographersError } = await supabase.functions.invoke(
        'find-available-photographers',
        {
          body: {
            latitude: destCoords[1],
            longitude: destCoords[0],
            max_distance_km: 150 // Maximum search radius
          }
        }
      );

      if (photographersError) {
        console.error('Error finding photographers:', photographersError);
        setValidationResult({
          valid: false,
          travelCost: 0,
          distance: 0,
          photographyAvailable: false,
          message: 'Fehler bei der Fotografen-Suche. Bitte versuchen Sie es erneut.'
        });
        setIsValidating(false);
        return;
      }

      const photographyAvailable = photographersData?.photographers?.length > 0;

      if (!photographyAvailable) {
        // Photography not available, BUT digital services are
        setValidationResult({
          valid: true, // Allow proceeding
          travelCost: 0,
          distance: 0,
          photographyAvailable: false,
          message: "✅ Fotografie vor Ort ist in Ihrer Region aktuell noch nicht verfügbar. Unsere digitalen Dienstleistungen bieten wir aber selbstverständlich für Sie an."
        });
      } else {
        // Photography available
        const nearest = photographersData.photographers[0];
        const travelCost = calculateTravelCost(nearest.distance_km);
        
        setValidationResult({
          valid: true,
          travelCost,
          distance: nearest.distance_km,
          photographyAvailable: true,
          message: "✅ Fotografie vor Ort in Ihrer Region verfügbar."
        });
      }
      
    } catch (error) {
      console.error('Location validation error:', error);
      setValidationResult({
        valid: false,
        travelCost: 0,
        distance: 0,
        photographyAvailable: false,
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
      className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4"
    >
      <div className="w-full max-w-3xl">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/10 mb-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Wo befindet sich Ihre Immobilie?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Geben Sie die vollständige Adresse inkl. Hausnummer ein, um zu starten
            </p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <Label htmlFor="address" className="text-base font-semibold">
              Adresse mit Hausnummer *
            </Label>
            
            <div className="relative">
              <Input
                ref={inputRef}
                id="address"
                value={addressInput}
                onChange={(e) => handleAddressInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="z.B. Musterstraße 123, 80331 München"
                disabled={isValidating}
                className="h-14 text-base px-5 rounded-xl border-2 focus:border-primary transition-all duration-200"
              />
          
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-2 bg-card/95 backdrop-blur-lg border-2 border-border rounded-xl shadow-2xl max-h-80 overflow-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-5 py-4 text-left hover:bg-primary/10 transition-all duration-200 flex items-start gap-4 border-b border-border/50 last:border-0 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-base pt-1.5">{suggestion.place_name}</span>
                    </button>
                  ))}
                </div>
              )}
          
              {isLoadingSuggestions && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={validateLocation}
            disabled={!canValidate || isValidating}
            className="w-full h-14 text-base font-semibold rounded-xl"
            size="lg"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Prüfe Verfügbarkeit...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                Verfügbarkeit prüfen
              </>
            )}
          </Button>

          {validationResult && (
            <Alert 
              variant={validationResult.valid ? 'default' : 'destructive'}
              className="border-2 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                {validationResult.valid ? (
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                )}
                <AlertDescription className="text-base pt-1.5">
                  {validationResult.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="h-14 text-base font-semibold rounded-xl flex-1 sm:flex-none sm:min-w-[200px]"
            size="lg"
          >
            Zurück zum Dashboard
          </Button>
          
          <Button
            onClick={() => onLocationValidated(validationResult!.travelCost, validationResult!.distance, validationResult!.photographyAvailable)}
            disabled={!canProceed}
            className="h-14 text-base font-semibold rounded-xl flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            size="lg"
          >
            Weiter zur Service-Auswahl
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
