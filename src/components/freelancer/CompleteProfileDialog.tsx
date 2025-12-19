import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MissingField } from '@/lib/services/ProfileCompletenessService';
import { Loader2 } from 'lucide-react';

interface CompleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: MissingField[];
  onComplete: () => void;
}

// Define schemas for each section
const personalDataSchema = z.object({
  vorname: z.string().min(1, 'Vorname ist erforderlich'),
  nachname: z.string().min(1, 'Nachname ist erforderlich'),
  telefon: z.string().min(1, 'Telefonnummer ist erforderlich'),
});

const locationSchema = z.object({
  strasse: z.string().min(1, 'Straße ist erforderlich'),
  plz: z.string().min(1, 'PLZ ist erforderlich'),
  stadt: z.string().min(1, 'Stadt ist erforderlich'),
  service_radius_km: z.number().min(1).max(200),
});

const businessSchema = z.object({
  rechtsform: z.string().optional(),
  handelsregister_nr: z.string().optional(),
  kleinunternehmer: z.boolean(),
  umsatzsteuer_pflichtig: z.boolean(),
  steuernummer: z.string().optional(),
  umsatzsteuer_id: z.string().optional(),
});

const bankingSchema = z.object({
  iban: z.string().min(1, 'IBAN ist erforderlich'),
  bic: z.string().optional(),
  kontoinhaber: z.string().min(1, 'Kontoinhaber ist erforderlich'),
});

const qualificationSchema = z.object({
  berufshaftpflicht_bis: z.string().optional(),
  keine_berufshaftpflicht: z.boolean(),
});

export const CompleteProfileDialog = ({
  open,
  onOpenChange,
  missingFields,
  onComplete,
}: CompleteProfileDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // Determine which sections have missing fields
  const sections = new Set<string>();
  missingFields.forEach(field => {
    sections.add(field.section);
  });

  const hasSectionMissingFields = (section: string) => sections.has(section);

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setCurrentProfile(data);
    };

    if (open) {
      loadProfile();
    }
  }, [open]);

  const personalForm = useForm({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      vorname: currentProfile?.vorname || '',
      nachname: currentProfile?.nachname || '',
      telefon: currentProfile?.telefon || '',
    },
  });

  const locationForm = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      strasse: currentProfile?.strasse || '',
      plz: currentProfile?.plz || '',
      stadt: currentProfile?.stadt || '',
      service_radius_km: currentProfile?.service_radius_km || 50,
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      rechtsform: currentProfile?.rechtsform || '',
      handelsregister_nr: currentProfile?.handelsregister_nr || '',
      kleinunternehmer: currentProfile?.kleinunternehmer || false,
      umsatzsteuer_pflichtig: currentProfile?.umsatzsteuer_pflichtig || false,
      steuernummer: currentProfile?.steuernummer || '',
      umsatzsteuer_id: currentProfile?.umsatzsteuer_id || '',
    },
  });

  const bankingForm = useForm({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      iban: currentProfile?.iban || '',
      bic: currentProfile?.bic || '',
      kontoinhaber: currentProfile?.kontoinhaber || '',
    },
  });

  const qualificationForm = useForm({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      berufshaftpflicht_bis: currentProfile?.berufshaftpflicht_bis || '',
      keine_berufshaftpflicht: currentProfile?.keine_berufshaftpflicht || false,
    },
  });

  // Update form defaults when profile loads
  useEffect(() => {
    if (currentProfile) {
      personalForm.reset({
        vorname: currentProfile.vorname || '',
        nachname: currentProfile.nachname || '',
        telefon: currentProfile.telefon || '',
      });
      locationForm.reset({
        strasse: currentProfile.strasse || '',
        plz: currentProfile.plz || '',
        stadt: currentProfile.stadt || '',
        service_radius_km: currentProfile.service_radius_km || 50,
      });
      businessForm.reset({
        rechtsform: currentProfile.rechtsform || '',
        handelsregister_nr: currentProfile.handelsregister_nr || '',
        kleinunternehmer: currentProfile.kleinunternehmer || false,
        umsatzsteuer_pflichtig: currentProfile.umsatzsteuer_pflichtig || false,
        steuernummer: currentProfile.steuernummer || '',
        umsatzsteuer_id: currentProfile.umsatzsteuer_id || '',
      });
      bankingForm.reset({
        iban: currentProfile.iban || '',
        bic: currentProfile.bic || '',
        kontoinhaber: currentProfile.kontoinhaber || '',
      });
      qualificationForm.reset({
        berufshaftpflicht_bis: currentProfile.berufshaftpflicht_bis || '',
        keine_berufshaftpflicht: currentProfile.keine_berufshaftpflicht || false,
      });
    }
  }, [currentProfile]);

  const saveAllForms = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      // Collect all form data
      const updates: any = {
        ...personalForm.getValues(),
        ...locationForm.getValues(),
        ...businessForm.getValues(),
        ...bankingForm.getValues(),
        ...qualificationForm.getValues(),
      };

      // Convert empty strings to null for optional database fields
      // PostgreSQL doesn't accept empty strings for date fields
      Object.keys(updates).forEach(key => {
        if (updates[key] === '') {
          updates[key] = null;
        }
      });

      // Geocode address to get coordinates if location data changed
      if (updates.strasse && updates.plz && updates.stadt) {
        try {
          const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke('geocode-address', {
            body: {
              address: updates.strasse,
              city: updates.stadt,
              postal_code: updates.plz,
              country: 'Germany'
            }
          });

          if (!geocodeError && geocodeData?.coordinates) {
            updates.location_lat = geocodeData.coordinates[1];
            updates.location_lng = geocodeData.coordinates[0];
          }
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
          // Continue without coordinates - user can fix later
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profil erfolgreich aktualisiert');
      onComplete();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Fehler beim Aktualisieren des Profils');
    } finally {
      setIsLoading(false);
    }
  };

  const tabsList = [
    { value: 'personal', label: 'Persönliche Daten', section: 'Persönliche Daten' },
    { value: 'location', label: 'Standort', section: 'Standort & Serviceradius' },
    { value: 'business', label: 'Geschäft & Steuern', section: 'Geschäftsdaten & Steuern' },
    { value: 'banking', label: 'Bankverbindung', section: 'Bankverbindung' },
    { value: 'qualification', label: 'Qualifikation', section: 'Qualifikation' },
  ].filter(tab => hasSectionMissingFields(tab.section));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil vervollständigen</DialogTitle>
          <DialogDescription>
            Bitte füllen Sie die fehlenden Informationen aus, um Aufträge annehmen zu können.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabsList.length}, 1fr)` }}>
            {tabsList.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Personal Data Tab */}
          {hasSectionMissingFields('Persönliche Daten') && (
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vorname">Vorname *</Label>
                  <Input
                    id="vorname"
                    {...personalForm.register('vorname')}
                    placeholder="Max"
                  />
                  {personalForm.formState.errors.vorname && (
                    <p className="text-sm text-destructive mt-1">
                      {String(personalForm.formState.errors.vorname.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nachname">Nachname *</Label>
                  <Input
                    id="nachname"
                    {...personalForm.register('nachname')}
                    placeholder="Mustermann"
                  />
                  {personalForm.formState.errors.nachname && (
                    <p className="text-sm text-destructive mt-1">
                      {String(personalForm.formState.errors.nachname.message)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefon">Telefonnummer *</Label>
                  <Input
                    id="telefon"
                    {...personalForm.register('telefon')}
                    placeholder="+49 123 456789"
                  />
                  {personalForm.formState.errors.telefon && (
                    <p className="text-sm text-destructive mt-1">
                      {String(personalForm.formState.errors.telefon.message)}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Location Tab */}
          {hasSectionMissingFields('Standort & Serviceradius') && (
            <TabsContent value="location" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="strasse">Straße *</Label>
                  <Input
                    id="strasse"
                    {...locationForm.register('strasse')}
                    placeholder="Musterstraße 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plz">PLZ *</Label>
                    <Input
                      id="plz"
                      {...locationForm.register('plz')}
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stadt">Stadt *</Label>
                    <Input
                      id="stadt"
                      {...locationForm.register('stadt')}
                      placeholder="Berlin"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service_radius_km">Serviceradius (km) *</Label>
                  <Input
                    id="service_radius_km"
                    type="number"
                    {...locationForm.register('service_radius_km', { valueAsNumber: true })}
                    placeholder="50"
                  />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Business Tab */}
          {hasSectionMissingFields('Geschäftsdaten & Steuern') && (
            <TabsContent value="business" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rechtsform">Rechtsform</Label>
                  <Select
                    value={businessForm.watch('rechtsform')}
                    onValueChange={(value) => businessForm.setValue('rechtsform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="einzelunternehmen">Einzelunternehmen</SelectItem>
                      <SelectItem value="gbr">GbR</SelectItem>
                      <SelectItem value="gmbh">GmbH</SelectItem>
                      <SelectItem value="ug">UG</SelectItem>
                      <SelectItem value="ag">AG</SelectItem>
                      <SelectItem value="freiberufler">Freiberufler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="handelsregister_nr">Handelsregisternummer (falls vorhanden)</Label>
                  <Input
                    id="handelsregister_nr"
                    {...businessForm.register('handelsregister_nr')}
                    placeholder="HRB 12345"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="kleinunternehmer"
                    checked={businessForm.watch('kleinunternehmer')}
                    onCheckedChange={(checked) => businessForm.setValue('kleinunternehmer', checked)}
                  />
                  <Label htmlFor="kleinunternehmer">Kleinunternehmer nach §19 UStG</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="umsatzsteuer_pflichtig"
                    checked={businessForm.watch('umsatzsteuer_pflichtig')}
                    onCheckedChange={(checked) => businessForm.setValue('umsatzsteuer_pflichtig', checked)}
                  />
                  <Label htmlFor="umsatzsteuer_pflichtig">Umsatzsteuerpflichtig</Label>
                </div>

                {businessForm.watch('umsatzsteuer_pflichtig') && (
                  <>
                    <div>
                      <Label htmlFor="steuernummer">Steuernummer</Label>
                      <Input
                        id="steuernummer"
                        {...businessForm.register('steuernummer')}
                        placeholder="12/345/67890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="umsatzsteuer_id">Umsatzsteuer-ID</Label>
                      <Input
                        id="umsatzsteuer_id"
                        {...businessForm.register('umsatzsteuer_id')}
                        placeholder="DE123456789"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          )}

          {/* Banking Tab */}
          {hasSectionMissingFields('Bankverbindung') && (
            <TabsContent value="banking" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="iban">IBAN *</Label>
                  <Input
                    id="iban"
                    {...bankingForm.register('iban')}
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                </div>

                <div>
                  <Label htmlFor="bic">BIC / SWIFT</Label>
                  <Input
                    id="bic"
                    {...bankingForm.register('bic')}
                    placeholder="COBADEFFXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="kontoinhaber">Kontoinhaber *</Label>
                  <Input
                    id="kontoinhaber"
                    {...bankingForm.register('kontoinhaber')}
                    placeholder="Max Mustermann"
                  />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Qualification Tab */}
          {hasSectionMissingFields('Qualifikation') && (
            <TabsContent value="qualification" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="keine_berufshaftpflicht"
                    checked={qualificationForm.watch('keine_berufshaftpflicht')}
                    onCheckedChange={(checked) => qualificationForm.setValue('keine_berufshaftpflicht', checked)}
                  />
                  <Label htmlFor="keine_berufshaftpflicht">
                    Ich habe derzeit keine Berufshaftpflichtversicherung
                  </Label>
                </div>

                {!qualificationForm.watch('keine_berufshaftpflicht') && (
                  <div>
                    <Label htmlFor="berufshaftpflicht_bis">Berufshaftpflicht gültig bis *</Label>
                    <Input
                      id="berufshaftpflicht_bis"
                      type="date"
                      {...qualificationForm.register('berufshaftpflicht_bis')}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={saveAllForms} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Speichern & Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
