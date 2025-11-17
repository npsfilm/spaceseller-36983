import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Camera, Sparkles, Home, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Record<string, ServiceConfig>;
  onUpdateServices: (services: Record<string, ServiceConfig>) => void;
  onNext: () => void;
}

type CategoryFilter = 'photography' | 'editing' | 'virtual_staging' | 'floor_plan';

export const ServiceSelectionStep = ({
  services,
  selectedServices,
  onUpdateServices,
  onNext
}: ServiceSelectionStepProps) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('photography');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    photography: true,
    editing: true,
    virtual_staging: true,
    floor_plan: true
  });

  const categories = [
    { id: 'photography' as CategoryFilter, label: 'Fotografie', icon: Camera },
    { id: 'editing' as CategoryFilter, label: 'Bearbeitung', icon: Sparkles },
    { id: 'virtual_staging' as CategoryFilter, label: 'Virtual Staging', icon: Home },
    { id: 'floor_plan' as CategoryFilter, label: 'Grundrisse', icon: MapPin }
  ];

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

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getSelectedPackageInCategory = (category: string) => {
    return Object.keys(selectedServices).find(serviceId => {
      const service = services.find(s => s.id === serviceId);
      return service?.category === category && service.name.includes('Paket');
    });
  };

  const photographyServices = services.filter(s => s.category === 'photography');
  const editingServices = services.filter(s => s.category === 'editing');
  const virtualStagingServices = services.filter(s => s.category === 'virtual_staging');
  const floorPlanServices = services.filter(s => s.category === 'floor_plan');

  const categoryGroups = [
    { 
      id: 'photography', 
      name: '📸 Fotografie', 
      services: photographyServices,
      color: 'from-blue-500/10 to-blue-500/5'
    },
    { 
      id: 'editing', 
      name: '✨ Bildbearbeitung', 
      services: editingServices,
      color: 'from-purple-500/10 to-purple-500/5'
    },
    { 
      id: 'virtual_staging', 
      name: '🏠 Virtual Staging', 
      services: virtualStagingServices,
      color: 'from-green-500/10 to-green-500/5'
    },
    { 
      id: 'floor_plan', 
      name: '📐 Grundrisse', 
      services: floorPlanServices,
      color: 'from-orange-500/10 to-orange-500/5'
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Wählen Sie Ihre Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Alle Services auf einen Blick – wählen Sie, was Sie benötigen
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="px-6 py-3 border-b border-border bg-muted/30">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeFilter === cat.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(cat.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6 max-w-6xl mx-auto">
          {categoryGroups
            .filter(group => group.id === activeFilter)
            .filter(group => group.services.length > 0)
            .map((group) => {
              const selectedPackage = getSelectedPackageInCategory(group.id);
              const isExpanded = expandedCategories[group.id];
              const hasPackages = group.services.some(s => s.name.includes('Paket'));

              return (
                <div key={group.id} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-foreground">{group.name}</h2>
                      {selectedPackage && (
                        <Badge variant="secondary" className="text-xs">
                          1 ausgewählt
                        </Badge>
                      )}
                    </div>
                    {selectedPackage && hasPackages && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryExpansion(group.id)}
                        className="text-xs"
                      >
                        {isExpanded ? 'Andere Pakete ausblenden' : 'Andere Pakete anzeigen'}
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    )}
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.services
                      .filter(service => {
                        // If a package is selected in this category and category is collapsed
                        if (selectedPackage && !isExpanded && hasPackages) {
                          // Only show the selected package
                          return service.id === selectedPackage;
                        }
                        return true;
                      })
                      .map((service) => {
                        const isSelected = !!selectedServices[service.id];
                        const isPackage = service.name.includes('Paket') || service.name.includes('Kombi') || service.name.includes('Sky');

                        return (
                          <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                          >
                            <div
                              onClick={() => handleServiceToggle(service.id)}
                              className={`
                                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${isSelected 
                                  ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' 
                                  : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                                }
                              `}
                            >
                              {/* Selected Checkmark */}
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                                </div>
                              )}

                              {/* Package Badge */}
                              {isPackage && (
                                <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                                  Paket
                                </Badge>
                              )}

                              {/* Content */}
                              <div className="space-y-2 mt-6">
                                <h3 className="font-bold text-sm text-foreground line-clamp-2">
                                  {service.name}
                                </h3>
                                
                                {service.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {service.description}
                                  </p>
                                )}

                                {/* Features */}
                                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                                  <div className="space-y-1">
                                    {service.features.slice(0, 2).map((feature, idx) => (
                                      <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <div className="w-1 h-1 rounded-full bg-primary/60" />
                                        <span className="line-clamp-1">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Price */}
                                <div className="pt-2 mt-2 border-t border-border">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-foreground">
                                      €{service.base_price}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {service.unit}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-sm text-muted-foreground">
            {Object.keys(selectedServices).length} Service(s) ausgewählt
          </div>
          <Button
            onClick={onNext}
            disabled={Object.keys(selectedServices).length === 0}
            size="lg"
            className="gap-2"
          >
            Weiter zur Konfiguration
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
