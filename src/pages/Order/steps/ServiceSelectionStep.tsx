import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedServiceCard } from '../components/EnhancedServiceCard';
import { PackageCard } from '../components/PackageCard';
import { ArrowRight, Sparkles } from 'lucide-react';
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

  const popularPackages = [
    {
      name: 'Starter Paket',
      description: 'Perfekt für Einsteiger',
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
    },
    {
      name: 'Komplett Paket',
      description: 'Alles für den perfekten Auftritt',
      services: photographyServices.concat(editingServices, virtualStagingServices, floorPlanServices),
      badge: 'Top-Preis',
      savings: 20
    }
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
          Wählen Sie die Services, die Sie benötigen
        </p>
      </motion.div>

      {/* Package Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold">Beliebte Kombinationen</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
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

      {/* Service Categories */}
      <section>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="photography">Fotografie</TabsTrigger>
            <TabsTrigger value="editing">Bearbeitung</TabsTrigger>
            <TabsTrigger value="staging">Staging</TabsTrigger>
            <TabsTrigger value="floorplan">Grundrisse</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, index) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <EnhancedServiceCard
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                    isPopular={index === 5 || index === 8}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="photography" className="mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {photographyServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <EnhancedServiceCard
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="editing" className="mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {editingServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <EnhancedServiceCard
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="staging" className="mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {virtualStagingServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <EnhancedServiceCard
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="floorplan" className="mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {floorPlanServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <EnhancedServiceCard
                    service={service}
                    isSelected={!!selectedServices[service.id]}
                    onToggle={handleServiceToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

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
