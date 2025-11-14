import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PhotographerMatch {
  photographer_id: string;
  name: string;
  email: string;
  distance_km: number;
  is_available: boolean;
  city: string;
  service_radius_km: number;
}

interface PhotographerSuggestionsProps {
  orderId: string;
  shootingAddress: any;
  scheduledDate?: string;
  onSelectPhotographer: (photographerId: string) => void;
  selectedPhotographer?: string;
}

export function PhotographerSuggestions({
  orderId,
  shootingAddress,
  scheduledDate,
  onSelectPhotographer,
  selectedPhotographer,
}: PhotographerSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [photographers, setPhotographers] = useState<PhotographerMatch[]>([]);
  const [addressCoords, setAddressCoords] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    if (shootingAddress) {
      geocodeAndFind();
    }
  }, [shootingAddress, scheduledDate]);

  const geocodeAndFind = async () => {
    if (!shootingAddress) return;

    try {
      setGeocoding(true);

      // Check if address already has coordinates
      if (shootingAddress.latitude && shootingAddress.longitude) {
        setAddressCoords({
          lat: shootingAddress.latitude,
          lng: shootingAddress.longitude,
        });
        await findPhotographers(shootingAddress.latitude, shootingAddress.longitude);
        return;
      }

      // Geocode the address
      const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke(
        'geocode-address',
        {
          body: {
            address: shootingAddress.strasse + ' ' + (shootingAddress.hausnummer || ''),
            city: shootingAddress.stadt,
            postal_code: shootingAddress.plz,
            country: shootingAddress.land,
          },
        }
      );

      if (geocodeError) throw geocodeError;

      if (geocodeData.error) {
        toast.error('Adresse konnte nicht gefunden werden');
        return;
      }

      const { latitude, longitude } = geocodeData;
      setAddressCoords({ lat: latitude, lng: longitude });

      // Update address with coordinates
      await (supabase as any)
        .from('addresses')
        .update({
          latitude,
          longitude,
          geocoded_at: new Date().toISOString(),
        })
        .eq('id', shootingAddress.id);

      await findPhotographers(latitude, longitude);
    } catch (error) {
      console.error('Error geocoding:', error);
      toast.error('Fehler beim Geocoding');
    } finally {
      setGeocoding(false);
    }
  };

  const findPhotographers = async (lat: number, lng: number) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke(
        'find-available-photographers',
        {
          body: {
            latitude: lat,
            longitude: lng,
            scheduled_date: scheduledDate || null,
            max_distance_km: 100,
          },
        }
      );

      if (error) throw error;

      if (data.error) {
        toast.error('Fehler beim Suchen von Fotografen');
        return;
      }

      setPhotographers(data.photographers || []);
    } catch (error) {
      console.error('Error finding photographers:', error);
      toast.error('Fehler beim Suchen von Fotografen');
    } finally {
      setLoading(false);
    }
  };

  if (!shootingAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verfügbare Fotografen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keine Aufnahmeadresse angegeben
          </p>
        </CardContent>
      </Card>
    );
  }

  if (geocoding || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verfügbare Fotografen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {geocoding ? 'Adresse wird geokodiert...' : 'Fotografen werden gesucht...'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Verfügbare Fotografen</span>
          {addressCoords && (
            <Button
              variant="ghost"
              size="sm"
              onClick={geocodeAndFind}
              className="h-8 text-xs"
            >
              Neu laden
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {photographers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Keine Fotografen in der Nähe gefunden (Radius: 100 km)
          </p>
        ) : (
          <div className="space-y-3">
            {photographers.map((photographer) => (
              <div
                key={photographer.photographer_id}
                className={`p-3 rounded-lg border ${
                  selectedPhotographer === photographer.photographer_id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                } hover:border-primary/50 transition-colors cursor-pointer`}
                onClick={() => onSelectPhotographer(photographer.photographer_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{photographer.name}</span>
                      {photographer.is_available ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verfügbar
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Nicht verfügbar
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{photographer.city} • {photographer.distance_km} km entfernt</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Servicebereich: {photographer.service_radius_km} km</span>
                      </div>
                    </div>
                  </div>
                  {selectedPhotographer === photographer.photographer_id && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
