import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Record<string, ServiceConfig>;
  onUpdateServices: (services: Record<string, ServiceConfig>) => void;
  onNext: () => void;
  photographyAvailable: boolean;
}

export const ServiceSelectionStep = ({
  services,
  selectedServices,
  onUpdateServices,
  onNext,
  photographyAvailable
}: ServiceSelectionStepProps) => {
  const handleServiceToggle = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const updated = { ...selectedServices };
    
    if (updated[serviceId]) {
      delete updated[serviceId];
    } else {
      // If selecting a photography package, deselect other photography packages
      if (service.category === 'photography' && service.name.includes('Paket')) {
        Object.keys(updated).forEach(key => {
          const existingService = services.find(s => s.id === key);
          if (existingService?.category === 'photography' && existingService.name.includes('Paket')) {
            delete updated[key];
          }
        });
      }
      
      updated[serviceId] = {
        serviceId,
        quantity: 1,
        turnaround: 'standard'
      };
    }
    
    onUpdateServices(updated);
  };

  // Group services by their actual category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Category names mapping
  const categoryNames: Record<string, string> = {
    photography: '📸 Fotografie',
    drone: '🚁 Drohnenfotografie',
    editing: '✨ Bildbearbeitung',
    virtual_staging: '🏠 Virtual Staging',
    floor_plan: '📐 Grundrisse',
    rendering: '🎨 Rendering',
    virtual_tour: '360° Virtuelle Tour',
    energy_certificate: '⚡ Energieausweis'
  };

  const selectedCount = Object.keys(selectedServices).length;
  const canProceed = selectedCount > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Wählen Sie Ihre Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Wählen Sie die Services für Ihre ausgewählte Kategorie
        </p>
      </div>

      {/* Warning Banner - only for onsite category without photography */}
      {!photographyAvailable && (
        <div className="mx-6 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>Hinweis:</strong> Fotografie-Services sind an diesem Standort nicht verfügbar. 
            Unsere digitalen Dienstleistungen bieten wir deutschlandweit an.
          </p>
        </div>
      )}

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-8 max-w-6xl mx-auto">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <h2 className="text-xl font-bold text-foreground">
                {categoryNames[category] || category}
              </h2>

              {/* Services Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServices.map((service) => {
                  const isSelected = !!selectedServices[service.id];
                  const features = Array.isArray(service.features) 
                    ? service.features 
                    : [];

                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ y: -4 }}
                      className={`cursor-pointer border rounded-xl p-6 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:shadow-lg'
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="space-y-3">
                        {/* Service Name & Price */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {service.name}
                            </h3>
                            {service.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {service.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="bg-primary rounded-full p-1 shrink-0">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {service.base_price}€
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {service.unit}
                          </span>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                          <div className="space-y-1 pt-2 border-t border-border">
                            {features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-sm">
            {selectedCount > 0 ? (
              <span className="text-foreground">
                <strong>{selectedCount}</strong> Service{selectedCount !== 1 ? 's' : ''} ausgewählt
              </span>
            ) : (
              <span className="text-muted-foreground">
                Wählen Sie mindestens einen Service
              </span>
            )}
          </div>

          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="gap-2"
          >
            Weiter
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
