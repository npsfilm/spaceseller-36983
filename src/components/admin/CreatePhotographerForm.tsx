import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { photographerService } from '@/lib/services/PhotographerService';
import { createPhotographerSchema, type CreatePhotographerInput } from '@/lib/validation/photographerSchemas';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface CreatePhotographerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onEmailExists: () => void;
}

export const CreatePhotographerForm = ({ onSuccess, onCancel, onEmailExists }: CreatePhotographerFormProps) => {
  const [formData, setFormData] = useState<CreatePhotographerInput>({
    email: '',
    vorname: '',
    nachname: '',
    telefon: '',
    strasse: '',
    plz: '',
    stadt: '',
    land: 'Deutschland',
    service_radius_km: 50
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    try {
      createPhotographerSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte überprüfen Sie die Formulareingaben',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await photographerService.createPhotographer(formData);
      
      toast({
        title: 'Fotograf erstellt',
        description: 'Der Fotograf wurde erfolgreich erstellt',
      });

      // Reset form
      setFormData({
        email: '',
        vorname: '',
        nachname: '',
        telefon: '',
        strasse: '',
        plz: '',
        stadt: '',
        land: 'Deutschland',
        service_radius_km: 50
      });
      setFormErrors({});
      onSuccess();
    } catch (error: any) {
      if (error.message === 'EMAIL_EXISTS') {
        toast({
          variant: "destructive",
          title: "E-Mail bereits registriert",
          description: "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits. Bitte verwenden Sie den Tab 'Vorhandener Benutzer', um diesem die Fotograf-Rolle zuzuweisen.",
        });
        onEmailExists();
        return;
      }

      console.error('Error creating photographer:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.message || "Fotograf konnte nicht erstellt werden",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof CreatePhotographerInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 py-4">
      {/* Contact Information Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Kontaktdaten</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vorname">Vorname *</Label>
            <Input
              id="vorname"
              value={formData.vorname}
              onChange={(e) => updateField('vorname', e.target.value)}
              placeholder="Max"
            />
            {formErrors.vorname && <p className="text-sm text-destructive">{formErrors.vorname}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nachname">Nachname *</Label>
            <Input
              id="nachname"
              value={formData.nachname}
              onChange={(e) => updateField('nachname', e.target.value)}
              placeholder="Mustermann"
            />
            {formErrors.nachname && <p className="text-sm text-destructive">{formErrors.nachname}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="max@beispiel.de"
          />
          {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefon">Telefon</Label>
          <Input
            id="telefon"
            type="tel"
            value={formData.telefon}
            onChange={(e) => updateField('telefon', e.target.value)}
            placeholder="+49 123 456789"
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Adresse</h4>
        
        <div className="space-y-2">
          <Label htmlFor="strasse">Straße & Hausnummer</Label>
          <Input
            id="strasse"
            value={formData.strasse}
            onChange={(e) => updateField('strasse', e.target.value)}
            placeholder="Musterstraße 123"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plz">PLZ</Label>
            <Input
              id="plz"
              value={formData.plz}
              onChange={(e) => updateField('plz', e.target.value)}
              placeholder="12345"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
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
          <Label htmlFor="land">Land *</Label>
          <Select 
            value={formData.land} 
            onValueChange={(value) => updateField('land', value)}
          >
            <SelectTrigger id="land">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Deutschland">Deutschland</SelectItem>
              <SelectItem value="Österreich">Österreich</SelectItem>
              <SelectItem value="Schweiz">Schweiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Service Area Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Servicebereich</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="radius">Serviceradius</Label>
            <span className="text-sm text-muted-foreground">{formData.service_radius_km} km</span>
          </div>
          <Slider
            id="radius"
            min={10}
            max={200}
            step={5}
            value={[formData.service_radius_km]}
            onValueChange={(value) => updateField('service_radius_km', value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Der Fotograf kann Aufträge in diesem Umkreis annehmen
          </p>
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          * Der Fotograf erhält eine E-Mail zum Festlegen seines Passworts
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Fotograf erstellen
        </Button>
      </div>
    </div>
  );
};
