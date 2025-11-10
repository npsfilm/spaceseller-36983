import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PackageCard } from '../components/PackageCard';
import { CompactServiceCard } from '../components/CompactServiceCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Record<string, ServiceConfig>;
  onUpdateServices: (services: Record<string, ServiceConfig>) => void;
  onNext: () => void;
  category: string;
  onBackToCategories: () => void;
}

export const ServiceSelectionStep = ({
  services,
  selectedServices,
  onUpdateServices,
  onNext,
  category,
  onBackToCategories
}: ServiceSelectionStepProps) => {
  // Filter services by selected category
  const categoryServices = services.filter(s => s.category === category);
  
  // For packages, we'll use category-specific logic
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

  // Category-specific packages - now showing actual photography packages
  const getCategoryPackages = () => {
    switch (category) {
      case 'photography':
        // Group services by type
        const immobilienServices = photographyServices.filter(s => s.name.includes('Immobilienshooting'));
        const drohnenServices = photographyServices.filter(s => s.name.includes('Drohnenshooting'));
        const kombiServices = photographyServices.filter(s => s.name.includes('Kombi-Paket'));
        
        return [
          {
            name: 'Immobilienshooting',
            description: 'Professionelle Innen- und Außenaufnahmen',
            services: immobilienServices,
            badge: 'Beliebt',
            savings: 0
          },
          {
            name: 'Drohnenshooting',
            description: 'Beeindruckende Luftaufnahmen',
            services: drohnenServices,
            badge: 'Premium',
            savings: 0
          },
          {
            name: 'Kombi-Paket',
            description: 'Immobilien + Drohne zum Sparpreis',
            services: kombiServices,
            badge: 'Beste Wahl',
            savings: 15
          }
        ];
      case 'editing':
        return [
          {
            name: 'Bildbearbeitung',
            description: 'Professionelle Nachbearbeitung',
            services: editingServices,
            badge: 'Standard',
            savings: 0
          }
        ];
      case 'virtual_staging':
        return [
          {
            name: 'Virtual Staging',
            description: 'Digitale Möblierung mit Mengenrabatt',
            services: virtualStagingServices,
            badge: 'Flexibel',
            savings: 0
          }
        ];
      case 'floor_plan':
        return [
          {
            name: 'Grundrisse',
            description: '2D oder 3D Grundrisse',
            services: floorPlanServices,
            badge: 'Professionell',
            savings: 0
          }
        ];
      default:
        return [];
    }
  };

  const popularPackages = getCategoryPackages();

  // Category titles for display
  const categoryTitles: Record<string, string> = {
    photography: 'Fotografie Services',
    editing: 'Bildbearbeitung Services',
    virtual_staging: 'Virtual Staging Services',
    floor_plan: 'Grundriss Services'
  };

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
      {/* Header with Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Button
          variant="ghost"
          onClick={onBackToCategories}
          className="gap-2"
        >
          ← Zurück zur Kategorieauswahl
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          {categoryTitles[category]}
        </h1>
        <p className="text-lg text-muted-foreground">
          Wählen Sie ein Paket oder einzelne Services
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

      {/* Decorative Divider */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative py-8"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground font-medium">
            ODER
          </span>
        </div>
      </motion.div>

      {/* Individual Service Selection - Always Visible */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8 bg-muted/30 rounded-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Alle verfügbaren Services</h2>
          <p className="text-muted-foreground">Wählen Sie nur die Services, die Sie benötigen</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <h3 className="text-xl font-bold">Alle Services</h3>
            <span className="text-sm text-muted-foreground">
              ({categoryServices.length} verfügbar)
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {categoryServices.map((service) => (
              <CompactServiceCard
                key={service.id}
                service={service}
                isSelected={!!selectedServices[service.id]}
                onToggle={handleServiceToggle}
              />
            ))}
          </div>
        </div>
      </motion.section>

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
