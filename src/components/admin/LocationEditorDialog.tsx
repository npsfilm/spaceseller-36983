import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/mapbox';
import MapboxClient from '@mapbox/mapbox-sdk';
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

interface Photographer {
  id: string;
  vorname: string | null;
  nachname: string | null;
  email: string;
  stadt: string | null;
  location_lat: number | null;
  location_lng: number | null;
  service_radius_km: number | null;
}

interface LocationEditorDialogProps {
  photographer: Photographer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const mapboxClient = MapboxClient({ accessToken: MAPBOX_CONFIG.accessToken });
const geocodingService = MapboxGeocoding(mapboxClient);

export const LocationEditorDialog = ({ photographer, open, onOpenChange, onSave }: LocationEditorDialogProps) => {
  const [address, setAddress] = useState("");
  const [serviceRadius, setServiceRadius] = useState(photographer.service_radius_km || 50);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    place_name: string;
  } | null>(
    photographer.location_lat && photographer.location_lng
      ? {
          lat: photographer.location_lat,
          lng: photographer.location_lng,
          place_name: photographer.stadt || "",
        }
      : null
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (photographer.stadt) {
      setAddress(photographer.stadt);
    }
  }, [photographer]);

  useEffect(() => {
    if (!open || !mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    const centerLng = selectedLocation?.lng || 10.897790;
    const centerLat = selectedLocation?.lat || 48.370544;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [centerLng, centerLat],
      zoom: 9,
    });

    map.current.on('load', () => {
      updateMapCircle();
    });

    if (selectedLocation) {
      marker.current = new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
        .setLngLat([selectedLocation.lng, selectedLocation.lat])
        .addTo(map.current);
    }

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [open]);

  useEffect(() => {
    updateMapCircle();
  }, [serviceRadius, selectedLocation]);

  const updateMapCircle = () => {
    if (!map.current || !selectedLocation) return;

    if (map.current.getSource('service-area')) {
      map.current.removeLayer('service-area-fill');
      map.current.removeLayer('service-area-outline');
      map.current.removeSource('service-area');
    }

    const center = turf.point([selectedLocation.lng, selectedLocation.lat]);
    const circle = turf.circle(center, serviceRadius, { steps: 64, units: 'kilometers' });

    map.current.addSource('service-area', {
      type: 'geojson',
      data: circle,
    });

    map.current.addLayer({
      id: 'service-area-fill',
      type: 'fill',
      source: 'service-area',
      paint: {
        'fill-color': 'hsl(var(--primary))',
        'fill-opacity': 0.15,
      },
    });

    map.current.addLayer({
      id: 'service-area-outline',
      type: 'line',
      source: 'service-area',
      paint: {
        'line-color': 'hsl(var(--primary))',
        'line-width': 2,
      },
    });

    // Fit bounds to circle
    const bbox = turf.bbox(circle);
    map.current.fitBounds(bbox as [number, number, number, number], { padding: 50 });
  };

  const handleAddressSearch = async (query: string) => {
    setAddress(query);

    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await geocodingService
        .forwardGeocode({
          query,
          countries: ['DE'],
          types: ['place', 'locality', 'address'],
          limit: 5,
        })
        .send();

      setSuggestions(response.body.features);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    const [lng, lat] = suggestion.center;
    setSelectedLocation({
      lat,
      lng,
      place_name: suggestion.place_name,
    });
    setAddress(suggestion.place_name);
    setShowSuggestions(false);

    if (map.current && marker.current) {
      marker.current.setLngLat([lng, lat]);
      map.current.flyTo({ center: [lng, lat], zoom: 10 });
    } else if (map.current) {
      marker.current = new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
        .setLngLat([lng, lat])
        .addTo(map.current);
      map.current.flyTo({ center: [lng, lat], zoom: 10 });
    }
  };

  const handleSave = async () => {
    if (!selectedLocation) {
      toast.error('Bitte wählen Sie einen Standort aus');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          location_lat: selectedLocation.lat,
          location_lng: selectedLocation.lng,
          service_radius_km: serviceRadius,
          stadt: selectedLocation.place_name.split(',')[0], // Extract city name
        })
        .eq('id', photographer.id);

      if (error) throw error;

      toast.success('Standort erfolgreich gespeichert');
      onSave();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Fehler beim Speichern des Standorts');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Standort bearbeiten: {photographer.vorname} {photographer.nachname}
          </DialogTitle>
          <DialogDescription>
            Konfigurieren Sie den Standort und Service-Radius des Fotografen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse / Stadt</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="address"
                value={address}
                onChange={(e) => handleAddressSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="z.B. München, Augsburg, Berlin..."
              />

              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-2 bg-card border rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-0"
                    >
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion.place_name}</span>
                    </button>
                  ))}
                </div>
              )}

              {isLoadingSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Service Radius Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Service-Radius</Label>
              <span className="text-sm font-semibold text-primary">{serviceRadius} km</span>
            </div>
            <Slider
              value={[serviceRadius]}
              onValueChange={(value) => setServiceRadius(value[0])}
              min={10}
              max={150}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Legen Sie fest, wie weit der Fotograf für Aufträge reisen kann
            </p>
          </div>

          {/* Map Preview */}
          <div className="space-y-2">
            <Label>Karten-Vorschau</Label>
            <div
              ref={mapContainer}
              className="w-full h-[400px] rounded-lg overflow-hidden border"
            />
            {!selectedLocation && (
              <p className="text-sm text-muted-foreground">
                Wählen Sie eine Adresse aus, um die Karten-Vorschau zu sehen
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!selectedLocation || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                'Standort speichern'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
