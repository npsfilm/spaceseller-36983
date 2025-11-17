import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Plus, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { PhotographerMapView } from "@/components/admin/PhotographerMapView";
import { LocationEditorDialog } from "@/components/admin/LocationEditorDialog";

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

export default function PhotographerLocations() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      
      // Fetch photographers from user_roles and join with profiles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'photographer');

      if (roleError) throw roleError;

      if (!roleData || roleData.length === 0) {
        setPhotographers([]);
        return;
      }

      const photographerIds = roleData.map(r => r.user_id);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, vorname, nachname, email, stadt, location_lat, location_lng, service_radius_km')
        .in('id', photographerIds);

      if (profileError) throw profileError;

      setPhotographers(profileData || []);
    } catch (error) {
      console.error('Error fetching photographers:', error);
      toast.error('Fehler beim Laden der Fotografen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const handleEdit = (photographer: Photographer) => {
    setSelectedPhotographer(photographer);
    setShowEditor(true);
  };

  const handleSave = async () => {
    await fetchPhotographers();
    setShowEditor(false);
    setSelectedPhotographer(null);
  };

  const photographersWithLocation = photographers.filter(
    p => p.location_lat && p.location_lng && p.service_radius_km
  );

  const photographersWithoutLocation = photographers.filter(
    p => !p.location_lat || !p.location_lng || !p.service_radius_km
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Fotografen-Standorte & Service-Bereiche</h2>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Standorte und Service-Radien Ihrer Fotografen
            </p>
          </div>
          <Button onClick={() => setShowMap(!showMap)} variant="outline">
            <MapIcon className="mr-2 h-4 w-4" />
            {showMap ? 'Karte ausblenden' : 'Karte anzeigen'}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt Fotografen</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photographers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mit Standort</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{photographersWithLocation.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ohne Standort</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{photographersWithoutLocation.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        {showMap && photographersWithLocation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service-Bereiche Übersicht</CardTitle>
              <CardDescription>
                Visualisierung aller Fotografen-Standorte mit ihren Service-Radien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotographerMapView photographers={photographersWithLocation} />
            </CardContent>
          </Card>
        )}

        {/* Photographers with Location */}
        {photographersWithLocation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fotografen mit konfigurierten Standorten</CardTitle>
              <CardDescription>
                Diese Fotografen haben einen Standort und Service-Radius konfiguriert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {photographersWithLocation.map((photographer) => (
                  <div
                    key={photographer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {photographer.vorname} {photographer.nachname}
                        </div>
                        <div className="text-sm text-muted-foreground">{photographer.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {photographer.stadt && (
                            <Badge variant="secondary">{photographer.stadt}</Badge>
                          )}
                          <Badge variant="outline">
                            {photographer.service_radius_km} km Radius
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit(photographer)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photographers without Location */}
        {photographersWithoutLocation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fotografen ohne Standort</CardTitle>
              <CardDescription>
                Diese Fotografen benötigen eine Standort-Konfiguration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {photographersWithoutLocation.map((photographer) => (
                  <div
                    key={photographer.id}
                    className="flex items-center justify-between p-4 border border-dashed rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {photographer.vorname} {photographer.nachname}
                        </div>
                        <div className="text-sm text-muted-foreground">{photographer.email}</div>
                        <Badge variant="secondary" className="mt-1">Standort fehlt</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit(photographer)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Standort hinzufügen
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Lade Fotografen...
            </CardContent>
          </Card>
        )}

        {!loading && photographers.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Keine Fotografen gefunden
            </CardContent>
          </Card>
        )}

        {/* Location Editor Dialog */}
        {showEditor && selectedPhotographer && (
          <LocationEditorDialog
            photographer={selectedPhotographer}
            open={showEditor}
            onOpenChange={setShowEditor}
            onSave={handleSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}
