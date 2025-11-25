import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { 
  User, 
  Lock, 
  Save, 
  Shield, 
  Building2, 
  CreditCard, 
  MapPin, 
  Calendar as CalendarIcon,
  Award,
  AlertCircle 
} from 'lucide-react';
import { z } from 'zod';
import { GDPRSection } from '@/components/settings/GDPRSection';
import { format } from 'date-fns';

const profileSchema = z.object({
  vorname: z.string().trim().min(1).max(100),
  nachname: z.string().trim().min(1).max(100),
  telefon: z.string().trim().min(1).max(50),
  firma: z.string().trim().min(1).max(200),
  strasse: z.string().trim().max(200),
  plz: z.string().trim().max(10),
  stadt: z.string().trim().max(100)
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"]
});

interface NavItem {
  id: string;
  label: string;
  icon: any;
  photographerOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Sicherheit', icon: Lock },
  { id: 'privacy', label: 'Datenschutz', icon: Shield },
  { id: 'photographer-personal', label: 'Persönliche Daten', icon: User, photographerOnly: true },
  { id: 'photographer-business', label: 'Geschäft & Steuern', icon: Building2, photographerOnly: true },
  { id: 'photographer-banking', label: 'Bankverbindung', icon: CreditCard, photographerOnly: true },
  { id: 'photographer-location', label: 'Standort & Radius', icon: MapPin, photographerOnly: true },
  { id: 'photographer-availability', label: 'Verfügbarkeit', icon: CalendarIcon, photographerOnly: true },
  { id: 'photographer-professional', label: 'Qualifikation', icon: Award, photographerOnly: true },
];

function SettingsContent() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const { user } = useAuth();
  const { toast } = useToast();
  const { role } = useUserRole();
  const isPhotographer = role === 'photographer';

  // Photographer-specific state
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [serviceRadius, setServiceRadius] = useState([50]);
  const [rechtsform, setRechtsform] = useState("");
  const [umsatzsteuerPflichtig, setUmsatzsteuerPflichtig] = useState(false);
  const [umsatzsteuerId, setUmsatzsteuerId] = useState("");
  const [steuernummer, setSteuernummer] = useState("");
  const [kleinunternehmer, setKleinunternehmer] = useState(false);
  const [handelsregisterNr, setHandelsregisterNr] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [kontoinhaber, setKontoinhaber] = useState("");
  const [berufshaftpflichtBis, setBerufshaftpflichtBis] = useState("");
  const [equipment, setEquipment] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [availabilityNotes, setAvailabilityNotes] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
      if (isPhotographer) {
        loadAvailability();
      }
    }
  }, [user, isPhotographer]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .filter(item => !item.photographerOnly || isPhotographer)
        .map(item => item.id);
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const scrollContainer = document.getElementById('settings-scroll-area');
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [isPhotographer]);

  const loadProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        
        if (isPhotographer) {
          setVorname(data.vorname || "");
          setNachname(data.nachname || "");
          setTelefon(data.telefon || "");
          setStrasse(data.strasse || "");
          setPlz(data.plz || data.postal_code || "");
          setStadt(data.stadt || data.city || "");
          setServiceRadius([data.service_radius_km || 50]);
          setRechtsform(data.rechtsform || "");
          setUmsatzsteuerPflichtig(data.umsatzsteuer_pflichtig || false);
          setUmsatzsteuerId(data.umsatzsteuer_id || "");
          setSteuernummer(data.steuernummer || "");
          setKleinunternehmer(data.kleinunternehmer || false);
          setHandelsregisterNr(data.handelsregister_nr || "");
          setIban(data.iban || "");
          setBic(data.bic || "");
          setKontoinhaber(data.kontoinhaber || "");
          setBerufshaftpflichtBis(data.berufshaftpflicht_bis || "");
          setEquipment(data.equipment || "");
          setPortfolioUrl(data.portfolio_url || "");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      profileSchema.parse(profile);

      const { error } = await supabase
        .from('profiles')
        .update({
          vorname: profile.vorname,
          nachname: profile.nachname,
          telefon: profile.telefon,
          firma: profile.firma,
          strasse: profile.strasse,
          plz: profile.plz,
          stadt: profile.stadt
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Änderungen wurden gespeichert'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Profil konnte nicht aktualisiert werden',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      passwordSchema.parse(passwordData);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: 'Passwort geändert',
        description: 'Ihr Passwort wurde erfolgreich aktualisiert'
      });

      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Passwort konnte nicht geändert werden',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonal = async () => {
    if (!vorname || !nachname) {
      sonnerToast.error("Bitte Vor- und Nachname ausfüllen");
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
      sonnerToast.success("Persönliche Daten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving personal data:", error);
      sonnerToast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTaxBusiness = async () => {
    if (umsatzsteuerPflichtig && umsatzsteuerId && !/^DE\d{9}$/.test(umsatzsteuerId)) {
      sonnerToast.error("Ungültige USt-IdNr. (Format: DE123456789)");
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
      sonnerToast.success("Geschäftsdaten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving tax/business data:", error);
      sonnerToast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanking = async () => {
    if (iban && !/^DE\d{20}$/.test(iban)) {
      sonnerToast.error("Ungültige IBAN (Format: DE + 20 Ziffern)");
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
      sonnerToast.success("Bankverbindung erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving banking data:", error);
      sonnerToast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!strasse || !plz || !stadt) {
      sonnerToast.error("Bitte alle Adressfelder ausfüllen");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          strasse,
          plz,
          stadt,
          postal_code: plz,
          city: stadt,
          service_radius_km: serviceRadius[0],
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      sonnerToast.success("Standort erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving location:", error);
      sonnerToast.error("Fehler beim Speichern des Standorts");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfessional = async () => {
    if (portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl)) {
      sonnerToast.error("Ungültige URL (muss mit http:// oder https:// beginnen)");
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
      sonnerToast.success("Qualifikationsdaten erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving professional data:", error);
      sonnerToast.error("Fehler beim Speichern");
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

      sonnerToast.success("Verfügbarkeit erfolgreich gespeichert");
    } catch (error) {
      console.error("Error saving availability:", error);
      sonnerToast.error("Fehler beim Speichern der Verfügbarkeit");
    } finally {
      setLoading(false);
    }
  };

  const isInsuranceExpired = berufshaftpflichtBis && new Date(berufshaftpflichtBis) < new Date();

  const visibleNavItems = navItems.filter(item => !item.photographerOnly || isPhotographer);

  if (loadingProfile) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <p>Lädt...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Einstellungen</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihr Konto und Ihre Einstellungen</p>
          </div>

          <div className="flex gap-8">
            {/* Fixed Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <nav className="space-y-1">
                  {visibleNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ScrollArea id="settings-scroll-area" className="h-[calc(100vh-240px)]">
                <div className="space-y-12 pr-4">
                  {/* Profile Section */}
                  <section id="profile" className="scroll-mt-8">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Profil</h2>
                        <p className="text-sm text-muted-foreground">Ihre persönlichen und geschäftlichen Informationen</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Persönliche Informationen</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>E-Mail-Adresse</Label>
                            <Input value={profile.email} disabled className="bg-muted" />
                            <p className="text-xs text-muted-foreground">E-Mail kann nicht geändert werden</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Telefon</Label>
                            <Input
                              value={profile.telefon || ''}
                              onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Vorname</Label>
                            <Input
                              value={profile.vorname || ''}
                              onChange={(e) => setProfile({ ...profile, vorname: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Nachname</Label>
                            <Input
                              value={profile.nachname || ''}
                              onChange={(e) => setProfile({ ...profile, nachname: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Unternehmensinformationen</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Firma</Label>
                            <Input
                              value={profile.firma || ''}
                              onChange={(e) => setProfile({ ...profile, firma: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Straße</Label>
                            <Input
                              value={profile.strasse || ''}
                              onChange={(e) => setProfile({ ...profile, strasse: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>PLZ</Label>
                            <Input
                              value={profile.plz || ''}
                              onChange={(e) => setProfile({ ...profile, plz: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Stadt</Label>
                            <Input
                              value={profile.stadt || ''}
                              onChange={(e) => setProfile({ ...profile, stadt: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleProfileUpdate} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
                      </Button>
                    </div>
                  </section>

                  {/* Security Section */}
                  <section id="security" className="scroll-mt-8">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Sicherheit</h2>
                        <p className="text-sm text-muted-foreground">Passwort und Zugangsdaten verwalten</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Passwort ändern</h3>
                        <div className="space-y-4 max-w-md">
                          <div className="space-y-2">
                            <Label>Neues Passwort</Label>
                            <Input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              placeholder="Mindestens 6 Zeichen"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Passwort bestätigen</Label>
                            <Input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              placeholder="Passwort wiederholen"
                            />
                          </div>

                          <Button onClick={handlePasswordChange} disabled={loading}>
                            <Lock className="h-4 w-4 mr-2" />
                            {loading ? 'Wird geändert...' : 'Passwort ändern'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Privacy Section */}
                  <section id="privacy" className="scroll-mt-8">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Datenschutz</h2>
                        <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Daten und Einwilligungen</p>
                      </div>
                      <GDPRSection />
                    </div>
                  </section>

                  {/* Photographer-only sections */}
                  {isPhotographer && (
                    <>
                      {/* Personal Data Section */}
                      <section id="photographer-personal" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Persönliche Daten</h2>
                            <p className="text-sm text-muted-foreground">Ihre Kontaktinformationen als Fotograf</p>
                          </div>

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
                        </div>
                      </section>

                      {/* Business & Tax Section */}
                      <section id="photographer-business" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Geschäftsdaten & Steuern</h2>
                            <p className="text-sm text-muted-foreground">Steuerrelevante Informationen für Rechnungsstellung</p>
                          </div>

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
                                    Umsatzsteuer wird auf Rechnungen ausgewiesen
                                  </p>
                                </div>
                                <Switch
                                  id="umsatzsteuer"
                                  checked={umsatzsteuerPflichtig}
                                  onCheckedChange={setUmsatzsteuerPflichtig}
                                />
                              </div>

                              {umsatzsteuerPflichtig && (
                                <>
                                  <div className="space-y-2">
                                    <Label htmlFor="umsatzsteuer-id">Umsatzsteuer-Identifikationsnummer</Label>
                                    <Input
                                      id="umsatzsteuer-id"
                                      value={umsatzsteuerId}
                                      onChange={(e) => setUmsatzsteuerId(e.target.value)}
                                      placeholder="DE123456789"
                                    />
                                    <p className="text-xs text-muted-foreground">Format: DE + 9 Ziffern</p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="steuernummer">Steuernummer</Label>
                                    <Input
                                      id="steuernummer"
                                      value={steuernummer}
                                      onChange={(e) => setSteuernummer(e.target.value)}
                                      placeholder="12/345/67890"
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          <Button onClick={handleSaveTaxBusiness} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Speichern
                          </Button>
                        </div>
                      </section>

                      {/* Banking Section */}
                      <section id="photographer-banking" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Bankverbindung</h2>
                            <p className="text-sm text-muted-foreground">Für Honorarzahlungen</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="iban">IBAN</Label>
                            <Input
                              id="iban"
                              value={iban}
                              onChange={(e) => setIban(e.target.value)}
                              placeholder="DE89370400440532013000"
                            />
                            <p className="text-xs text-muted-foreground">Format: DE + 20 Ziffern</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bic">BIC / SWIFT</Label>
                            <Input
                              id="bic"
                              value={bic}
                              onChange={(e) => setBic(e.target.value)}
                              placeholder="COBADEFFXXX"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="kontoinhaber">Kontoinhaber</Label>
                            <Input
                              id="kontoinhaber"
                              value={kontoinhaber}
                              onChange={(e) => setKontoinhaber(e.target.value)}
                              placeholder="Max Mustermann"
                            />
                          </div>

                          <Button onClick={handleSaveBanking} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Speichern
                          </Button>
                        </div>
                      </section>

                      {/* Location Section */}
                      <section id="photographer-location" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Standort & Serviceradius</h2>
                            <p className="text-sm text-muted-foreground">Ihr Arbeitsbereich für Aufträge</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="strasse">Straße</Label>
                              <Input
                                id="strasse"
                                value={strasse}
                                onChange={(e) => setStrasse(e.target.value)}
                                placeholder="Musterstraße 123"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="plz">PLZ</Label>
                              <Input
                                id="plz"
                                value={plz}
                                onChange={(e) => setPlz(e.target.value)}
                                placeholder="12345"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="stadt">Stadt</Label>
                              <Input
                                id="stadt"
                                value={stadt}
                                onChange={(e) => setStadt(e.target.value)}
                                placeholder="München"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Serviceradius: {serviceRadius[0]} km</Label>
                            <Slider
                              value={serviceRadius}
                              onValueChange={setServiceRadius}
                              min={10}
                              max={150}
                              step={5}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              Maximale Entfernung für Aufträge von Ihrem Standort
                            </p>
                          </div>

                          <Button onClick={handleSaveLocation} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Speichern
                          </Button>
                        </div>
                      </section>

                      {/* Availability Section */}
                      <section id="photographer-availability" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Verfügbarkeit</h2>
                            <p className="text-sm text-muted-foreground">Tage, an denen Sie nicht verfügbar sind</p>
                          </div>

                          <div className="space-y-4">
                            <Calendar
                              mode="multiple"
                              selected={unavailableDates}
                              onSelect={(dates) => setUnavailableDates(dates || [])}
                              className="rounded-md border"
                            />

                            <div className="space-y-2">
                              <Label htmlFor="availability-notes">Notizen</Label>
                              <Textarea
                                id="availability-notes"
                                value={availabilityNotes}
                                onChange={(e) => setAvailabilityNotes(e.target.value)}
                                placeholder="Zusätzliche Informationen zu Ihrer Verfügbarkeit..."
                              />
                            </div>
                          </div>

                          <Button onClick={handleSaveAvailability} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Speichern
                          </Button>
                        </div>
                      </section>

                      {/* Professional Section */}
                      <section id="photographer-professional" className="scroll-mt-8">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Qualifikation</h2>
                            <p className="text-sm text-muted-foreground">Berufliche Qualifikationen und Ausstattung</p>
                          </div>

                          {isInsuranceExpired && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Ihre Berufshaftpflichtversicherung ist abgelaufen. Bitte erneuern Sie diese.
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="berufshaftpflicht">Berufshaftpflicht gültig bis</Label>
                            <Input
                              id="berufshaftpflicht"
                              type="date"
                              value={berufshaftpflichtBis}
                              onChange={(e) => setBerufshaftpflichtBis(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="equipment">Ausrüstung</Label>
                            <Textarea
                              id="equipment"
                              value={equipment}
                              onChange={(e) => setEquipment(e.target.value)}
                              placeholder="Kamera, Objektive, Drohne, etc..."
                              rows={4}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio-URL</Label>
                            <Input
                              id="portfolio"
                              type="url"
                              value={portfolioUrl}
                              onChange={(e) => setPortfolioUrl(e.target.value)}
                              placeholder="https://mein-portfolio.de"
                            />
                          </div>

                          <Button onClick={handleSaveProfessional} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Speichern
                          </Button>
                        </div>
                      </section>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute requireOnboarding>
      <SettingsContent />
    </ProtectedRoute>
  );
}
