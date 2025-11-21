import { motion } from 'framer-motion';
import { Camera, Sparkles, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryCard } from '../components/CategoryCard';
import type { Service } from '../OrderWizard';
import augsburgHouseExterior from '@/assets/augsburg-house-exterior.jpg';
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
  // 4 categories with benefit-focused descriptions
  const categories = [
    {
      id: 'onsite',
      icon: Camera,
      image: augsburgHouseExterior,
      title: 'Aufnahme vor Ort',
      description: 'Professionelle Aufnahmen direkt bei Ihrer Immobilie – Foto, Video & Drohne',
      isPopular: true,
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
      description: 'Lassen Sie Ihre Fotos professionell aufwerten und Objekte entfernen',
      services: services.filter(s => s.category === 'editing')
    },
    {
      id: 'virtual_staging',
      icon: Home,
      image: vsLivingAfter,
      title: 'Virtuelles Staging',
      description: 'Verwandeln Sie leere Räume in einladende Wohnträume',
      services: services.filter(s => s.category === 'virtual_staging')
    },
    {
      id: 'energy_certificate',
      icon: FileText,
      image: heroProperty,
      title: 'Energieausweis',
      description: 'Gesetzlich vorgeschriebene Energieausweise schnell und unkompliziert',
      services: services.filter(s => s.category === 'energy_certificate')
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="space-y-16 w-full">
        {/* Enhanced Header with Step Badge */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            Schritt 2 von 3
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Wählen Sie Ihre perfekte Dienstleistung
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Professionelle Immobilien-Services für maximale Verkaufschancen
          </p>
        </div>

        {/* Category Grid - 4 cards with enhanced spacing */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
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
                isPopular={category.isPopular}
              />
            );
            })}
          </div>
        </div>

        {/* Selection Hint */}
        {selectedCategory && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              ✓ Kategorie ausgewählt – Klicken Sie auf "Weiter" um fortzufahren
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
