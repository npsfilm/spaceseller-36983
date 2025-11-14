import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function PhotographerSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Location settings
  const [strasse, setStrasse] = useState("");
  const [hausnummer, setHausnummer] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [serviceRadius, setServiceRadius] = useState([50]);
  
  // Availability settings
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [availabilityNotes, setAvailabilityNotes] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
      loadAvailability();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("strasse, plz, stadt, service_radius_km, city, postal_code")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setStrasse(data.strasse || "");
        setPlz(data.plz || data.postal_code || "");
        setStadt(data.stadt || data.city || "");
        setServiceRadius([data.service_radius_km || 50]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Fehler beim Laden der Daten");
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadAvailability = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("photographer_availability")
        .select("*")
        .eq("photographer_id", user?.id);

      if (error) throw error;

      if (data) {
        const unavailable = data
          .filter((a: any) => !a.is_available)
          .map((a: any) => new Date(a.date));
        setUnavailableDates(unavailable);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    }
  };

  const geocodeAddress = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("geocode-address", {
        body: { strasse, hausnummer, plz, stadt, land: "Deutschland" },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error geocoding:", error);
      return null;
    }
  };

  const handleSaveLocation = async () => {
    if (!strasse || !plz || !stadt) {
      toast.error("Bitte alle Adressfelder ausfüllen");
      return;
    }

    setLoading(true);
    try {
      // Geocode address
      const geocoded = await geocodeAddress();
      
      const updateData: any = {
        strasse,
        plz,
        stadt,
        postal_code: plz,
        city: stadt,
        service_radius_km: serviceRadius[0],
        updated_at: new Date().toISOString(),
      };

      if (geocoded?.latitude && geocoded?.longitude) {
        updateData.location_lat = geocoded.latitude;
        updateData.location_lng = geocoded.longitude;
      }

      const { error } = await (supabase as any)
        .from("profiles")
        .update(updateData)
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Standort erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Fehler beim Speichern des Standorts");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      // Delete existing future availability
      const today = new Date().toISOString().split('T')[0];
      await (supabase as any)
        .from("photographer_availability")
        .delete()
        .eq("photographer_id", user?.id)
        .gte("date", today);

      // Insert new unavailable dates
      if (unavailableDates.length > 0) {
        const availabilityData = unavailableDates.map(date => ({
          photographer_id: user?.id,
          date: format(date, "yyyy-MM-dd"),
          is_available: false,
          notes: availabilityNotes || null,
        }));

        const { error } = await (supabase as any)
          .from("photographer_availability")
          .insert(availabilityData);

        if (error) throw error;
      }

      toast.success("Verfügbarkeit erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Fehler beim Speichern der Verfügbarkeit");
    } finally {
      setLoading(false);
    }
  };

  const toggleDateAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isUnavailable = unavailableDates.some(
      d => format(d, "yyyy-MM-dd") === dateStr
    );

    if (isUnavailable) {
      setUnavailableDates(unavailableDates.filter(
        d => format(d, "yyyy-MM-dd") !== dateStr
      ));
    } else {
      setUnavailableDates([...unavailableDates, date]);
    }
  };

  if (loadingProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Lädt...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fotografen-Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihren Standort, Arbeitsradius und Verfügbarkeit
          </p>
        </div>

        <div className="space-y-6">
          {/* Location Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Standort & Arbeitsradius
              </CardTitle>
              <CardDescription>
                Legen Sie Ihren Standort und den Radius fest, in dem Sie arbeiten möchten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="strasse">Straße</Label>
                  <Input
                    id="strasse"
                    value={strasse}
                    onChange={(e) => setStrasse(e.target.value)}
                    placeholder="Musterstraße"
                  />
                </div>
                <div>
                  <Label htmlFor="hausnummer">Hausnr.</Label>
                  <Input
                    id="hausnummer"
                    value={hausnummer}
                    onChange={(e) => setHausnummer(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="plz">PLZ</Label>
                  <Input
                    id="plz"
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="stadt">Stadt</Label>
                  <Input
                    id="stadt"
                    value={stadt}
                    onChange={(e) => setStadt(e.target.value)}
                    placeholder="Berlin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Arbeitsradius: {serviceRadius[0]} km</Label>
                <Slider
                  value={serviceRadius}
                  onValueChange={setServiceRadius}
                  min={10}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Sie erhalten Aufträge, die bis zu {serviceRadius[0]} km von Ihrem Standort entfernt sind
                </p>
              </div>

              <Button onClick={handleSaveLocation} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Standort speichern
              </Button>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Verfügbarkeitskalender
              </CardTitle>
              <CardDescription>
                Markieren Sie Tage, an denen Sie NICHT verfügbar sind (z.B. Urlaub, andere Termine)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={unavailableDates}
                  onSelect={(dates) => setUnavailableDates(dates || [])}
                  disabled={(date) => date < new Date()}
                  locale={de}
                  className="rounded-md border pointer-events-auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notizen zur Verfügbarkeit (optional)</Label>
                <Textarea
                  id="notes"
                  value={availabilityNotes}
                  onChange={(e) => setAvailabilityNotes(e.target.value)}
                  placeholder="z.B. Urlaub vom 15.-30. Juni"
                  rows={3}
                />
              </div>

              {unavailableDates.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Nicht verfügbar an {unavailableDates.length} Tag(en):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unavailableDates.slice(0, 10).map((date, idx) => (
                      <span key={idx} className="text-xs bg-background px-2 py-1 rounded">
                        {format(date, "dd.MM.yyyy", { locale: de })}
                      </span>
                    ))}
                    {unavailableDates.length > 10 && (
                      <span className="text-xs text-muted-foreground">
                        +{unavailableDates.length - 10} weitere
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Button onClick={handleSaveAvailability} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Verfügbarkeit speichern
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
