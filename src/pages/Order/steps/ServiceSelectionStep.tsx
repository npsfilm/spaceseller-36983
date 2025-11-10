import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PackageCard } from '../components/PackageCard';
import { CompactServiceCard } from '../components/CompactServiceCard';
import { ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Record<string, ServiceConfig>;
  onUpdateServices: (services: Record<string, ServiceConfig>) => void;
  onNext: () => void;
}

export const ServiceSelectionStep = ({
  services,
  selectedServices,
  onUpdateServices,
  onNext
}: ServiceSelectionStepProps) => {
  const [showCustom, setShowCustom] = useState(false);

  const photographyServices = services.filter(s => s.category === 'photography');
  const editingServices = services.filter(s => s.category === 'editing');
  const virtualStagingServices = services.filter(s => s.category === 'virtual_staging');
  const floorPlanServices = services.filter(s => s.category === 'floor_plan');

  const handleServiceToggle = (serviceId: string) => {
    const updated = { ...selectedServices };
    if (updated[serviceId]) {
      delete updated[serviceId];
    } else {
      updated[serviceId] = {
        serviceId,
        quantity: 1,
        turnaround: 'standard'
      };
    }
    onUpdateServices(updated);
  };

  const handlePackageSelect = (packageServices: string[]) => {
    const updated = { ...selectedServices };
    packageServices.forEach(serviceId => {
      if (!updated[serviceId]) {
        updated[serviceId] = {
          serviceId,
          quantity: 1,
          turnaround: 'standard'
        };
      }
    });
    onUpdateServices(updated);
  };

  // Simplified to 2 packages only
  const popularPackages = [
    {
      name: 'Basis Paket',
      description: 'Perfekt für den Start',
      services: photographyServices.slice(0, 1).concat(editingServices.slice(0, 1)),
      badge: 'Beliebt',
      savings: 10
    },
    {
      name: 'Premium Paket',
      description: 'Komplette Immobilienpräsentation',
      services: photographyServices.slice(0, 2).concat(editingServices.slice(0, 2), virtualStagingServices.slice(0, 1)),
      badge: 'Beste Wahl',
      savings: 15
    }
  ];

  const serviceCategories = [
    { name: 'Fotografie', icon: '📸', services: photographyServices },
    { name: 'Bearbeitung', icon: '✨', services: editingServices },
    { name: 'Virtual Staging', icon: '🏠', services: virtualStagingServices },
    { name: 'Grundrisse', icon: '📐', services: floorPlanServices }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const hasSelection = Object.keys(selectedServices).length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Was möchten Sie heute bestellen?
        </h1>
        <p className="text-lg text-muted-foreground">
          Wählen Sie ein Paket oder stellen Sie Ihre eigene Auswahl zusammen
        </p>
      </motion.div>

      {/* Package Recommendations - PROMINENT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold">Schnellauswahl - Beliebte Pakete</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {popularPackages.map((pkg, index) => (
            <PackageCard
              key={pkg.name}
              package={pkg}
              onSelect={() => handlePackageSelect(pkg.services.map(s => s.id))}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.section>

      {/* Divider with Custom Option Toggle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-8"
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowCustom(!showCustom)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {showCustom ? (
            <>
              <ChevronUp className="h-5 w-5" />
              Services verbergen
            </>
          ) : (
            <>
              Oder wählen Sie einzelne Services
              <ChevronDown className="h-5 w-5" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Custom Service Selection - SECONDARY (Collapsible) */}
      {showCustom && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Individuelle Auswahl</h2>
            <p className="text-muted-foreground">Wählen Sie nur die Services, die Sie benötigen</p>
          </div>

          {/* Service Categories - Simple Headers, No Tabs */}
          {serviceCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-xl font-bold">{category.name}</h3>
                <span className="text-sm text-muted-foreground">
                  ({category.services.length} Services)
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {category.services.map((service) => (
                  <CompactServiceCard
                    key={service.id}
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-end pt-8"
      >
        <Button
          size="lg"
          onClick={onNext}
          disabled={!hasSelection}
          className="gap-2"
        >
          Weiter zur Konfiguration
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};
