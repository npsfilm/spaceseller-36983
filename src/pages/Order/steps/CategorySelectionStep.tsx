import { motion } from 'framer-motion';
import { Camera, Sparkles, Home, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '../components/CategoryCard';
import type { Service } from '../OrderWizard';
import augsburgHouseExterior from '@/assets/augsburg-house-exterior.jpg';
import floorPlan3d from '@/assets/floor-plan-3d-isometric.jpg';
import vsLivingAfter from '@/assets/vs-living-after.jpg';
import heroProperty from '@/assets/hero-property.jpg';

interface CategorySelectionStepProps {
  services: Service[];
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
}

// Category Selection Step - with back button and selection animation
export const CategorySelectionStep = ({
  services,
  onSelectCategory,
  selectedCategory
}: CategorySelectionStepProps) => {
  // New 4 categories with updated copywriting
  const categories = [
    {
      id: 'onsite',
      icon: Camera,
      image: augsburgHouseExterior,
      title: 'Aufnahme vor Ort',
      description: 'Foto, Video, Drohne, virtuelle Tour, Aufmaß & Grundriss und virtuelles Staging zur Ergänzung Ihres Fotoshootings',
      services: services.filter(s => 
        s.category === 'photography' || 
        s.category === 'drone' || 
        s.category === 'virtual_tour'
      )
    },
    {
      id: 'rendering_editing',
      icon: Sparkles,
      image: floorPlan3d,
      title: 'Rendering und Bearbeitung',
      description: 'Grundrissbearbeitung, Fotoretusche, Wohnflächenberechnung auf Basis Ihrer bemaßten Grundrisse und Renderings',
      services: services.filter(s => 
        s.category === 'editing' || 
        s.category === 'floor_plan' || 
        s.category === 'rendering'
      )
    },
    {
      id: 'virtual_staging',
      icon: Home,
      image: vsLivingAfter,
      title: 'Virtuelles Staging',
      description: 'Virtuelles Staging aus Ihren hochgeladenen Fotos',
      services: services.filter(s => s.category === 'virtual_staging')
    },
    {
      id: 'energy_certificate',
      icon: FileText,
      image: heroProperty,
      title: 'Energieausweis',
      description: 'Rechtliche Dokumente und Bescheinigungen für den Energieverbrauch',
      services: services.filter(s => s.category === 'energy_certificate')
    }
  ];

  return (
    <div className="min-h-screen py-16 px-1">
      <div className="space-y-12 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welche Art von Dienstleistung möchten Sie bestellen?
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Wählen Sie die Kategorie im Einklang mit der Marketingstrategie für Ihre Immobilie
          </p>
        </div>

        {/* Category Grid - 4 cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => {
            const startingPrice = category.services.length > 0 
              ? Math.min(...category.services.map(s => s.base_price))
              : 0;
            return (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                image={category.image}
                title={category.title}
                description={category.description}
                serviceCount={category.services.length}
                startingPrice={startingPrice}
                onClick={() => onSelectCategory(category.id)}
                delay={index * 0.1}
                isSelected={selectedCategory === category.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
