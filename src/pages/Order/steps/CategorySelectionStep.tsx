import { motion } from 'framer-motion';
import { Camera, Sparkles, Home, FileText, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '../components/CategoryCard';
import type { Service } from '../OrderWizard';
import augsburgHouseExterior from '@/assets/augsburg-house-exterior.jpg';
import floorPlan3d from '@/assets/floor-plan-3d-isometric.jpg';
import vsLivingAfter from '@/assets/vs-living-after.jpg';
import heroProperty from '@/assets/hero-property.jpg';
import afterInterior from '@/assets/after-interior.jpg';

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
  // 5 categories with split editing and floor plans
  const categories = [
    {
      id: 'onsite',
      icon: Camera,
      image: augsburgHouseExterior,
      title: 'Aufnahme vor Ort',
      description: 'Foto, Video, Drohne, und virtuelle Tour vor Ort buchen',
      services: services.filter(s => 
        s.category === 'photography' || 
        s.category === 'drone' || 
        s.category === 'virtual_tour'
      )
    },
    {
      id: 'photo_editing',
      icon: Sparkles,
      image: afterInterior,
      title: 'Fotobearbeitung',
      description: 'Professionelle Bildoptimierung und Objektretusche Ihrer Fotos',
      services: services.filter(s => s.category === 'editing')
    },
    {
      id: 'floor_plans',
      icon: Layout,
      image: floorPlan3d,
      title: 'Grundriss',
      description: '2D und 3D Grundrisse auf Basis Ihrer bemaßten Zeichnungen',
      services: services.filter(s => 
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
    <div className="min-h-screen py-16">
      <div className="space-y-12 w-full">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welche Art von Dienstleistung möchten Sie bestellen?
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Wählen Sie die Kategorie im Einklang mit der Marketingstrategie für Ihre Immobilie
          </p>
        </div>

        {/* Category Grid - 5 cards with container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-6 lg:gap-8 justify-items-center">
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
    </div>
  );
};
