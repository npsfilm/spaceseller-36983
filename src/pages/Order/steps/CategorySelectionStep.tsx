import { motion } from 'framer-motion';
import { Camera, Sparkles, Home, MapPin } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import type { Service } from '../OrderWizard';

interface CategorySelectionStepProps {
  services: Service[];
  onSelectCategory: (category: string) => void;
}

export const CategorySelectionStep = ({
  services,
  onSelectCategory
}: CategorySelectionStepProps) => {
  // Calculate stats for each category
  const categories = [
    {
      id: 'photography',
      icon: Camera,
      title: 'Fotografie',
      description: 'Professionelle Immobilienfotografie für Ihre Objekte',
      services: services.filter(s => s.category === 'photography')
    },
    {
      id: 'editing',
      icon: Sparkles,
      title: 'Bildbearbeitung',
      description: 'Expertelle Retusche und Optimierung Ihrer Bilder',
      services: services.filter(s => s.category === 'editing')
    },
    {
      id: 'virtual_staging',
      icon: Home,
      title: 'Virtual Staging',
      description: 'Digitale Möblierung leerer Räume',
      services: services.filter(s => s.category === 'virtual_staging')
    },
    {
      id: 'floor_plan',
      icon: MapPin,
      title: 'Grundrisse',
      description: '2D und 3D Grundrisse für Ihre Immobilien',
      services: services.filter(s => s.category === 'floor_plan')
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="space-y-12 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Was benötigen Sie?
          </h1>
          <p className="text-sm text-muted-foreground">
            Wählen Sie die Kategorie, die am besten zu Ihrem Projekt passt
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const startingPrice = Math.min(...category.services.map(s => s.base_price));
            return (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                serviceCount={category.services.length}
                startingPrice={startingPrice}
                onClick={() => onSelectCategory(category.id)}
                delay={index * 0.1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
