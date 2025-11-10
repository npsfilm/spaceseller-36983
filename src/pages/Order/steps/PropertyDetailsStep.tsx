import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import type { OrderState } from '../OrderWizard';

interface PropertyDetailsStepProps {
  address: OrderState['address'];
  onUpdateAddress: (address: OrderState['address']) => void;
  onNext: () => void;
  onBack: () => void;
  hasPhotography: boolean;
}

export const PropertyDetailsStep = ({
  address,
  onUpdateAddress,
  onNext,
  onBack,
  hasPhotography
}: PropertyDetailsStepProps) => {
  const handleChange = (field: keyof OrderState['address'], value: string) => {
    onUpdateAddress({ ...address, [field]: value });
  };

  const canProceed = !hasPhotography || (address.strasse && address.plz && address.stadt);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <MapPin className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Objektdetails</h1>
        <p className="text-lg text-muted-foreground">
          {hasPhotography 
            ? 'Wo findet das Shooting statt?' 
            : 'Objektinformationen (optional)'}
        </p>
      </motion.div>

      {/* Address Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-8 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Straße {hasPhotography && <span className="text-destructive">*</span>}</Label>
            <Input
              value={address.strasse}
              onChange={(e) => handleChange('strasse', e.target.value)}
              placeholder="Musterstraße"
              required={hasPhotography}
            />
          </div>

          <div className="space-y-2">
            <Label>Hausnummer</Label>
            <Input
              value={address.hausnummer}
              onChange={(e) => handleChange('hausnummer', e.target.value)}
              placeholder="123"
            />
          </div>

          <div className="space-y-2">
            <Label>PLZ {hasPhotography && <span className="text-destructive">*</span>}</Label>
            <Input
              value={address.plz}
              onChange={(e) => handleChange('plz', e.target.value)}
              placeholder="80331"
              maxLength={5}
              required={hasPhotography}
            />
          </div>

          <div className="space-y-2">
            <Label>Stadt {hasPhotography && <span className="text-destructive">*</span>}</Label>
            <Input
              value={address.stadt}
              onChange={(e) => handleChange('stadt', e.target.value)}
              placeholder="München"
              required={hasPhotography}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Zusätzliche Informationen</Label>
          <Textarea
            value={address.additional_info}
            onChange={(e) => handleChange('additional_info', e.target.value)}
            placeholder="Zugang zum Objekt, Parkmöglichkeiten, Ansprechpartner vor Ort, beste Besuchszeit..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Helfen Sie uns, das Shooting optimal vorzubereiten
          </p>
        </div>

        {hasPhotography && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <p className="text-sm text-accent">
              <strong>Tipp:</strong> Je mehr Details Sie angeben, desto besser können wir uns vorbereiten und desto reibungsloser läuft das Shooting ab.
            </p>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="gap-2"
        >
          {hasPhotography ? 'Weiter zu Uploads' : 'Weiter'}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
