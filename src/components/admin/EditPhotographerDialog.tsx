import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { photographerService } from '@/lib/services/PhotographerService';
import { editPhotographerSchema, type EditPhotographerInput } from '@/lib/validation/photographerSchemas';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface EditPhotographerDialogProps {
  open: boolean;
  userId: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditPhotographerDialog = ({ open, userId, onOpenChange, onSuccess }: EditPhotographerDialogProps) => {
  const [formData, setFormData] = useState<EditPhotographerInput | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      loadPhotographerDetails();
    }
  }, [open, userId]);

  const loadPhotographerDetails = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const data = await photographerService.fetchPhotographerDetails(userId);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching photographer details:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Fotograf-Details konnten nicht geladen werden',
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData) return false;
    
    try {
      editPhotographerSchema.parse(formData);
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
    if (!formData || !userId || !validateForm()) {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte überprüfen Sie die Formulareingaben',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await photographerService.updatePhotographer(userId, formData);

      toast({
        title: 'Erfolg',
        description: 'Fotograf wurde erfolgreich aktualisiert',
      });

      onOpenChange(false);
      setFormData(null);
      setFormErrors({});
      onSuccess();
    } catch (error: any) {
      console.error('Error updating photographer:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: error.message || 'Fotograf konnte nicht aktualisiert werden',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof EditPhotographerInput, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fotograf bearbeiten</DialogTitle>
          <DialogDescription>
            Aktualisieren Sie die Informationen des Fotografen
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : formData && (
          <div className="space-y-4 py-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Kontaktdaten</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vorname">Vorname *</Label>
                  <Input
                    id="edit-vorname"
                    value={formData.vorname}
                    onChange={(e) => updateField('vorname', e.target.value)}
                    placeholder="Max"
                  />
                  {formErrors.vorname && <p className="text-sm text-destructive">{formErrors.vorname}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-nachname">Nachname *</Label>
                  <Input
                    id="edit-nachname"
                    value={formData.nachname}
                    onChange={(e) => updateField('nachname', e.target.value)}
                    placeholder="Mustermann"
                  />
                  {formErrors.nachname && <p className="text-sm text-destructive">{formErrors.nachname}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telefon">Telefon</Label>
                <Input
                  id="edit-telefon"
                  type="tel"
                  value={formData.telefon || ''}
                  onChange={(e) => updateField('telefon', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Adresse</h4>
              
              <div className="space-y-2">
                <Label htmlFor="edit-strasse">Straße & Hausnummer</Label>
                <Input
                  id="edit-strasse"
                  value={formData.strasse || ''}
                  onChange={(e) => updateField('strasse', e.target.value)}
                  placeholder="Musterstraße 123"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-plz">PLZ</Label>
                  <Input
                    id="edit-plz"
                    value={formData.plz || ''}
                    onChange={(e) => updateField('plz', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-stadt">Stadt</Label>
                  <Input
                    id="edit-stadt"
                    value={formData.stadt || ''}
                    onChange={(e) => updateField('stadt', e.target.value)}
                    placeholder="München"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-land">Land *</Label>
                <Select 
                  value={formData.land} 
                  onValueChange={(value) => updateField('land', value)}
                >
                  <SelectTrigger id="edit-land">
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

            {/* Service Area */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Servicebereich</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-radius">Serviceradius</Label>
                  <span className="text-sm text-muted-foreground">{formData.service_radius_km} km</span>
                </div>
                <Slider
                  id="edit-radius"
                  min={10}
                  max={200}
                  step={5}
                  value={[formData.service_radius_km]}
                  onValueChange={(value) => updateField('service_radius_km', value[0])}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData || isSubmitting || isLoading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
