import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const step1Schema = z.object({
  vorname: z.string().trim().min(1, 'Vorname ist erforderlich').max(100),
  nachname: z.string().trim().min(1, 'Nachname ist erforderlich').max(100),
  telefon: z.string().trim().min(1, 'Telefonnummer ist erforderlich').max(50)
});

const step2Schema = z.object({
  firma: z.string().trim().min(1, 'Firmenname ist erforderlich').max(200),
  branche: z.string().min(1, 'Bitte wählen Sie eine Branche'),
  strasse: z.string().trim().max(200),
  plz: z.string().trim().max(10),
  stadt: z.string().trim().max(100),
  land: z.string().trim().max(100)
});

function OnboardingContent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    telefon: '',
    firma: '',
    branche: '',
    strasse: '',
    plz: '',
    stadt: '',
    land: 'Deutschland',
    aufmerksam_geworden_durch: '',
    aufmerksam_sonstiges: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    try {
      if (step === 1) {
        step1Schema.parse({
          vorname: formData.vorname,
          nachname: formData.nachname,
          telefon: formData.telefon
        });
        setStep(2);
      } else if (step === 2) {
        step2Schema.parse({
          firma: formData.firma,
          branche: formData.branche,
          strasse: formData.strasse,
          plz: formData.plz,
          stadt: formData.stadt,
          land: formData.land
        });
        setStep(3);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.aufmerksam_geworden_durch) {
      toast({
        title: 'Bitte wählen Sie eine Option',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const finalData = {
        ...formData,
        aufmerksam_geworden_durch: formData.aufmerksam_geworden_durch === 'Sonstiges' 
          ? formData.aufmerksam_sonstiges 
          : formData.aufmerksam_geworden_durch,
        onboarding_completed: true
      };

      const { error } = await supabase
        .from('profiles')
        .update(finalData)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Profil vervollständigt',
        description: 'Willkommen bei spaceseller!'
      });
      
      navigate('/order');
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Schritt {step} von 3</span>
                <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-hero transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Persönliche Informationen</h2>
                  <p className="text-muted-foreground">Beginnen wir mit Ihren Kontaktdaten</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input
                      id="vorname"
                      value={formData.vorname}
                      onChange={(e) => updateField('vorname', e.target.value)}
                      placeholder="Max"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input
                      id="nachname"
                      value={formData.nachname}
                      onChange={(e) => updateField('nachname', e.target.value)}
                      placeholder="Mustermann"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefon">Telefonnummer *</Label>
                    <Input
                      id="telefon"
                      type="tel"
                      value={formData.telefon}
                      onChange={(e) => updateField('telefon', e.target.value)}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Unternehmensinformationen</h2>
                  <p className="text-muted-foreground">Erzählen Sie uns über Ihr Unternehmen</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firma">Firmenname *</Label>
                    <Input
                      id="firma"
                      value={formData.firma}
                      onChange={(e) => updateField('firma', e.target.value)}
                      placeholder="Mustermann Immobilien GmbH"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branche">Branche *</Label>
                    <Select value={formData.branche} onValueChange={(value) => updateField('branche', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie Ihre Branche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immobilienmakler">Immobilienmakler</SelectItem>
                        <SelectItem value="Bauträger">Bauträger</SelectItem>
                        <SelectItem value="Privatperson">Privatperson</SelectItem>
                        <SelectItem value="Fotograf">Fotograf</SelectItem>
                        <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="strasse">Straße & Hausnummer</Label>
                      <Input
                        id="strasse"
                        value={formData.strasse}
                        onChange={(e) => updateField('strasse', e.target.value)}
                        placeholder="Musterstraße 123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plz">PLZ</Label>
                      <Input
                        id="plz"
                        value={formData.plz}
                        onChange={(e) => updateField('plz', e.target.value)}
                        placeholder="12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stadt">Stadt</Label>
                      <Input
                        id="stadt"
                        value={formData.stadt}
                        onChange={(e) => updateField('stadt', e.target.value)}
                        placeholder="München"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="land">Land</Label>
                    <Input
                      id="land"
                      value={formData.land}
                      onChange={(e) => updateField('land', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Source */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fast geschafft!</h2>
                  <p className="text-muted-foreground">Wie haben Sie von spaceseller erfahren?</p>
                </div>

                <RadioGroup 
                  value={formData.aufmerksam_geworden_durch}
                  onValueChange={(value) => updateField('aufmerksam_geworden_durch', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="Online-Suche" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">Online-Suche (Google, etc.)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="Empfehlung" id="empfehlung" />
                    <Label htmlFor="empfehlung" className="flex-1 cursor-pointer">Empfehlung</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="Social Media" id="social" />
                    <Label htmlFor="social" className="flex-1 cursor-pointer">Social Media</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="Sonstiges" id="sonstiges" />
                    <Label htmlFor="sonstiges" className="flex-1 cursor-pointer">Sonstiges</Label>
                  </div>
                </RadioGroup>

                {formData.aufmerksam_geworden_durch === 'Sonstiges' && (
                  <div className="space-y-2">
                    <Label htmlFor="sonstiges-text">Bitte spezifizieren</Label>
                    <Input
                      id="sonstiges-text"
                      value={formData.aufmerksam_sonstiges}
                      onChange={(e) => updateField('aufmerksam_sonstiges', e.target.value)}
                      placeholder="Woher haben Sie von uns erfahren?"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Weiter
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Wird gespeichert...' : (
                    <>
                      Abschließen
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Onboarding() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
