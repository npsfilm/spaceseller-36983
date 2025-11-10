import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Service, ServiceConfig } from '../OrderWizard';

interface ConfigurationStepProps {
  services: Service[];
  selectedServices: Record<string, ServiceConfig>;
  onUpdateServices: (services: Record<string, ServiceConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigurationStep = ({
  services,
  selectedServices,
  onUpdateServices,
  onNext,
  onBack
}: ConfigurationStepProps) => {
  const handleQuantityChange = (serviceId: string, delta: number) => {
    const config = selectedServices[serviceId];
    const newQuantity = Math.max(1, config.quantity + delta);
    onUpdateServices({
      ...selectedServices,
      [serviceId]: { ...config, quantity: newQuantity }
    });
  };

  const handleTurnaroundChange = (serviceId: string, turnaround: 'standard' | 'express') => {
    const config = selectedServices[serviceId];
    onUpdateServices({
      ...selectedServices,
      [serviceId]: { ...config, turnaround }
    });
  };

  const handleNotesChange = (serviceId: string, notes: string) => {
    const config = selectedServices[serviceId];
    onUpdateServices({
      ...selectedServices,
      [serviceId]: { ...config, notes }
    });
  };

  const handleDateChange = (serviceId: string, date: string) => {
    const config = selectedServices[serviceId];
    onUpdateServices({
      ...selectedServices,
      [serviceId]: { ...config, preferredDate: date }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Services konfigurieren</h1>
        <p className="text-lg text-muted-foreground">
          Geben Sie Details für jeden ausgewählten Service an
        </p>
      </motion.div>

      {/* Configuration Forms */}
      <Accordion type="multiple" defaultValue={Object.keys(selectedServices)} className="space-y-4">
        {Object.entries(selectedServices).map(([serviceId, config], index) => {
          const service = services.find(s => s.id === serviceId);
          if (!service) return null;

          const isPhotography = service.category === 'photography';

          return (
            <motion.div
              key={serviceId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={serviceId} className="border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-card hover:bg-accent/5">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <span className="text-xl">
                          {isPhotography ? '📸' : '✨'}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.quantity}x • €{(service.base_price * config.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    {/* Quantity */}
                    <div>
                      <Label>Anzahl</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(serviceId, -1)}
                          disabled={config.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={config.quantity}
                          readOnly
                          className="w-20 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(serviceId, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {service.unit === 'per_shoot' && 'Shootings'}
                          {service.unit === 'per_image' && 'Bilder'}
                          {service.unit === 'per_room' && 'Räume'}
                          {service.unit === 'per_plan' && 'Grundrisse'}
                        </span>
                      </div>
                    </div>

                    {/* Preferred Date (Photography only) */}
                    {isPhotography && (
                      <div>
                        <Label>Bevorzugtes Shooting-Datum</Label>
                        <Input
                          type="date"
                          value={config.preferredDate || ''}
                          onChange={(e) => handleDateChange(serviceId, e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-2"
                        />
                      </div>
                    )}

                    {/* Turnaround Time */}
                    <div>
                      <Label>Lieferzeit</Label>
                      <Select
                        value={config.turnaround}
                        onValueChange={(value) => handleTurnaroundChange(serviceId, value as 'standard' | 'express')}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard (48 Stunden) - Inklusive
                          </SelectItem>
                          <SelectItem value="express">
                            Express (24 Stunden) - +€50
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <Label>Besondere Anforderungen</Label>
                      <Textarea
                        value={config.notes || ''}
                        onChange={(e) => handleNotesChange(serviceId, e.target.value)}
                        placeholder="Z.B. spezielle Perspektiven, Farbwünsche, etc."
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </Button>
        <Button onClick={onNext} className="gap-2">
          Weiter zur Adresse
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
