import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Save, 
  User, 
  Building2, 
  CreditCard, 
  Award,
  AlertCircle 
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PhotographerSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Personal Information
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  
  // Location settings
  const [strasse, setStrasse] = useState("");
  const [hausnummer, setHausnummer] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [serviceRadius, setServiceRadius] = useState([50]);
  
  // Tax & Business Information
  const [rechtsform, setRechtsform] = useState("");
  const [umsatzsteuerPflichtig, setUmsatzsteuerPflichtig] = useState(false);
  const [umsatzsteuerId, setUmsatzsteuerId] = useState("");
  const [steuernummer, setSteuernummer] = useState("");
  const [kleinunternehmer, setKleinunternehmer] = useState(false);
  const [handelsregisterNr, setHandelsregisterNr] = useState("");
  
  // Banking Information
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [kontoinhaber, setKontoinhaber] = useState("");
  
  // Professional Information
  const [berufshaftpflichtBis, setBerufshaftpflichtBis] = useState("");
  const [equipment, setEquipment] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  
  // Availability settings
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        // Personal
        setVorname(data.vorname || "");
        setNachname(data.nachname || "");
        setTelefon(data.telefon || "");
        
        // Location
        setStrasse(data.strasse || "");
        setPlz(data.plz || data.postal_code || "");
        setStadt(data.stadt || data.city || "");
        setServiceRadius([data.service_radius_km || 50]);
        
        // Tax & Business
        setRechtsform(data.rechtsform || "");
        setUmsatzsteuerPflichtig(data.umsatzsteuer_pflichtig || false);
        setUmsatzsteuerId(data.umsatzsteuer_id || "");
        setSteuernummer(data.steuernummer || "");
        setKleinunternehmer(data.kleinunternehmer || false);
        setHandelsregisterNr(data.handelsregister_nr || "");
        
        // Banking
        setIban(data.iban || "");
        setBic(data.bic || "");
        setKontoinhaber(data.kontoinhaber || "");
        
        // Professional
        setBerufshaftpflichtBis(data.berufshaftpflicht_bis || "");
        setEquipment(data.equipment || "");
        setPortfolioUrl(data.portfolio_url || "");
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
      const { data, error } = await supabase
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

  const handleSavePersonal = async () => {
    if (!vorname || !nachname) {
      toast.error("Bitte Vor- und Nachname ausfüllen");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          vorname,
          nachname,
          telefon: telefon || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Persönliche Daten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving personal data:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTaxBusiness = async () => {
    // Validate VAT ID if VAT liable
    if (umsatzsteuerPflichtig && umsatzsteuerId && !/^DE\d{9}$/.test(umsatzsteuerId)) {
      toast.error("Ungültige USt-IdNr. (Format: DE123456789)");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          rechtsform: rechtsform || null,
          umsatzsteuer_pflichtig: umsatzsteuerPflichtig,
          umsatzsteuer_id: umsatzsteuerId || null,
          steuernummer: steuernummer || null,
          kleinunternehmer: kleinunternehmer,
          handelsregister_nr: handelsregisterNr || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Geschäftsdaten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving tax/business data:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanking = async () => {
    // Validate IBAN if provided
    if (iban && !/^DE\d{20}$/.test(iban)) {
      toast.error("Ungültige IBAN (Format: DE + 20 Ziffern)");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          iban: iban || null,
          bic: bic || null,
          kontoinhaber: kontoinhaber || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Bankverbindung erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving banking data:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!strasse || !plz || !stadt) {
      toast.error("Bitte alle Adressfelder ausfüllen");
      return;
    }

    setLoading(true);
    try {
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

      const { error } = await supabase
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

  const handleSaveProfessional = async () => {
    // Validate portfolio URL if provided
    if (portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl)) {
      toast.error("Ungültige URL (muss mit http:// oder https:// beginnen)");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          berufshaftpflicht_bis: berufshaftpflichtBis || null,
          equipment: equipment || null,
          portfolio_url: portfolioUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Qualifikationsdaten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving professional data:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from("photographer_availability")
        .delete()
        .eq("photographer_id", user?.id)
        .gte("date", today);

      if (unavailableDates.length > 0) {
        const availabilityData = unavailableDates.map(date => ({
          photographer_id: user?.id,
          date: format(date, "yyyy-MM-dd"),
          is_available: false,
          notes: availabilityNotes || null,
        }));

        const { error } = await supabase
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

  // Check if insurance is expired
  const isInsuranceExpired = berufshaftpflichtBis && new Date(berufshaftpflichtBis) < new Date();

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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fotografen-Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre persönlichen Daten, Geschäftsinformationen und Verfügbarkeit
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Persönlich</span>
            </TabsTrigger>
            <TabsTrigger value="business">
              <Building2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Geschäft</span>
            </TabsTrigger>
            <TabsTrigger value="banking">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Banking</span>
            </TabsTrigger>
            <TabsTrigger value="location">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Standort</span>
            </TabsTrigger>
            <TabsTrigger value="availability">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Verfügbar</span>
            </TabsTrigger>
            <TabsTrigger value="professional">
              <Award className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Qualifikation</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Persönliche Daten</CardTitle>
                <CardDescription>Ihre Kontaktinformationen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input
                      id="vorname"
                      value={vorname}
                      onChange={(e) => setVorname(e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input
                      id="nachname"
                      value={nachname}
                      onChange={(e) => setNachname(e.target.value)}
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefon">Telefonnummer</Label>
                  <Input
                    id="telefon"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="+49 123 456789"
                  />
                </div>

                <Button onClick={handleSavePersonal} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business & Tax Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Geschäftsdaten & Steuern</CardTitle>
                <CardDescription>Steuerrelevante Informationen für Rechnungsstellung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rechtsform">Rechtsform</Label>
                  <Select value={rechtsform} onValueChange={setRechtsform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="einzelunternehmen">Einzelunternehmen</SelectItem>
                      <SelectItem value="freiberufler">Freiberufler</SelectItem>
                      <SelectItem value="gbr">GbR</SelectItem>
                      <SelectItem value="ug">UG (haftungsbeschränkt)</SelectItem>
                      <SelectItem value="gmbh">GmbH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handelsregister">Handelsregisternummer (falls vorhanden)</Label>
                  <Input
                    id="handelsregister"
                    value={handelsregisterNr}
                    onChange={(e) => setHandelsregisterNr(e.target.value)}
                    placeholder="HRB 12345"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="kleinunternehmer">Kleinunternehmer nach §19 UStG</Label>
                    <p className="text-sm text-muted-foreground">
                      Keine Umsatzsteuer auf Rechnungen
                    </p>
                  </div>
                  <Switch
                    id="kleinunternehmer"
                    checked={kleinunternehmer}
                    onCheckedChange={setKleinunternehmer}
                  />
                </div>

                {!kleinunternehmer && (
                  <>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="umsatzsteuer">Umsatzsteuerpflichtig</Label>
                        <p className="text-sm text-muted-foreground">
                          Umsatzsteuer auf Rechnungen ausweisen
                        </p>
                      </div>
                      <Switch
                        id="umsatzsteuer"
                        checked={umsatzsteuerPflichtig}
                        onCheckedChange={setUmsatzsteuerPflichtig}
                      />
                    </div>

                    {umsatzsteuerPflichtig && (
                      <div className="space-y-2">
                        <Label htmlFor="ustid">Umsatzsteuer-Identifikationsnummer *</Label>
                        <Input
                          id="ustid"
                          value={umsatzsteuerId}
                          onChange={(e) => setUmsatzsteuerId(e.target.value.toUpperCase())}
                          placeholder="DE123456789"
                          maxLength={11}
                        />
                        <p className="text-sm text-muted-foreground">
                          Format: DE + 9 Ziffern
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="steuernummer">Steuernummer</Label>
                  <Input
                    id="steuernummer"
                    value={steuernummer}
                    onChange={(e) => setSteuernummer(e.target.value)}
                    placeholder="12/345/67890"
                  />
                </div>

                <Button onClick={handleSaveTaxBusiness} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Bankverbindung</CardTitle>
                <CardDescription>Für Zahlungsabwicklung und Auszahlungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kontoinhaber">Kontoinhaber</Label>
                  <Input
                    id="kontoinhaber"
                    value={kontoinhaber}
                    onChange={(e) => setKontoinhaber(e.target.value)}
                    placeholder="Max Mustermann"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="DE89370400440532013000"
                    maxLength={22}
                  />
                  <p className="text-sm text-muted-foreground">
                    Format: DE + 20 Ziffern (ohne Leerzeichen)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bic">BIC / SWIFT-Code</Label>
                  <Input
                    id="bic"
                    value={bic}
                    onChange={(e) => setBic(e.target.value.toUpperCase())}
                    placeholder="COBADEFFXXX"
                    maxLength={11}
                  />
                </div>

                <Button onClick={handleSaveBanking} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
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
                    <Label htmlFor="strasse">Straße *</Label>
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
                    <Label htmlFor="plz">PLZ *</Label>
                    <Input
                      id="plz"
                      value={plz}
                      onChange={(e) => setPlz(e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="stadt">Stadt *</Label>
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
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
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
                    className="rounded-md border"
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
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Qualifikation & Ausstattung</CardTitle>
                <CardDescription>Berufliche Informationen und Equipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isInsuranceExpired && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Ihre Berufshaftpflichtversicherung ist abgelaufen. Bitte aktualisieren Sie diese.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="versicherung">Berufshaftpflicht gültig bis</Label>
                  <Input
                    id="versicherung"
                    type="date"
                    value={berufshaftpflichtBis}
                    onChange={(e) => setBerufshaftpflichtBis(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Wichtig für professionelle Aufträge
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment & Ausstattung</Label>
                  <Textarea
                    id="equipment"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="z.B. Canon EOS R5, DJI Mavic 3 Pro, Profoto Lichtsystem..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio-Website / Instagram</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <Button onClick={handleSaveProfessional} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
