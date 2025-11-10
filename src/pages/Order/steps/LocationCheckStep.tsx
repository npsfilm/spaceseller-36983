import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const BASE_ADDRESS = "Zum Fuchsloch 22, 86551 Aichach";
const COST_PER_KM = 0.65;
const COST_PER_KM_OVER_200 = 0.85;
const FREE_TRAVEL_THRESHOLD = 20;

export const LocationCheckStep = ({ 
  address, 
  onUpdateAddress, 
  onLocationValidated,
  onBack 
}: LocationCheckStepProps) => {
  console.log('🗺️ LocationCheckStep RENDERING');
  console.log('📍 Current address:', address);
  console.log('✅ Street field should be visible at lines 177-184');
  
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    travelCost: number;
    distance: number;
    message: string;
  } | null>(null);

  const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_TOKEN });
  const directionsClient = mbxDirections({ accessToken: MAPBOX_TOKEN });

  const handleChange = (field: string, value: string) => {
    onUpdateAddress(field, value);
    setValidationResult(null);
  };

  const calculateTravelCost = (distanceKm: number): number => {
    let cost: number;
    
    if (distanceKm <= 200) {
      cost = distanceKm * COST_PER_KM;
    } else {
      cost = (200 * COST_PER_KM) + ((distanceKm - 200) * COST_PER_KM_OVER_200);
    }
    
    // Round up to nearest 5 euros
    cost = Math.ceil(cost / 5) * 5;
    
    // Free if under threshold
    if (cost < FREE_TRAVEL_THRESHOLD) {
      return 0;
    }
    
    return cost;
  };

  const validateLocation = async () => {
    if (!address.strasse || !address.plz || !address.stadt) {
      return;
    }

    setIsValidating(true);
    
    try {
      const destinationAddress = `${address.strasse} ${address.hausnummer || ''}, ${address.plz} ${address.stadt}, Deutschland`.trim();
      
      // Geocode base address
      const baseResponse = await geocodingClient.forwardGeocode({
        query: BASE_ADDRESS,
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
      const travelCost = calculateTravelCost(distanceKm);
      
      setValidationResult({
        valid: true,
        travelCost,
        distance: distanceKm,
        message: travelCost === 0 
          ? `Perfekt! Wir bieten Fotografie in ${address.stadt} an. Anfahrt inklusive!`
          : `Super! Wir bieten Fotografie in ${address.stadt} an. Entfernung: ${distanceKm} km, Anfahrtskosten: ${travelCost} €`
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

  const canValidate = address.strasse && address.plz && address.stadt;
  const canProceed = validationResult?.valid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* DEBUG INFO */}
      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg mb-4 text-xs font-mono">
        <div className="font-bold mb-2">🐛 DEBUG INFO:</div>
        <div>Street (strasse): "{address.strasse}"</div>
        <div>House Nr (hausnummer): "{address.hausnummer}"</div>
        <div>PLZ: "{address.plz}"</div>
        <div>City (stadt): "{address.stadt}"</div>
        <div className="mt-2 text-green-700">✅ This component IS rendering. If you see this, the issue is NOT a rendering problem.</div>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Wo befindet sich die Immobilie?</h2>
        <p className="text-muted-foreground">
          Geben Sie die Adresse ein, um Verfügbarkeit und Anfahrtskosten zu prüfen
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="strasse">Straße *</Label>
              <Input
                id="strasse"
                value={address.strasse}
                onChange={(e) => handleChange('strasse', e.target.value)}
                placeholder="Musterstraße"
                disabled={isValidating}
              />
            </div>
            <div>
              <Label htmlFor="hausnummer">Hausnr.</Label>
              <Input
                id="hausnummer"
                value={address.hausnummer}
                onChange={(e) => handleChange('hausnummer', e.target.value)}
                placeholder="123"
                disabled={isValidating}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plz">PLZ *</Label>
              <Input
                id="plz"
                value={address.plz}
                onChange={(e) => handleChange('plz', e.target.value)}
                placeholder="80331"
                maxLength={5}
                disabled={isValidating}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="stadt">Stadt *</Label>
              <Input
                id="stadt"
                value={address.stadt}
                onChange={(e) => handleChange('stadt', e.target.value)}
                placeholder="München"
                disabled={isValidating}
              />
            </div>
          </div>
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
