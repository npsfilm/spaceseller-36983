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
    <div className="relative min-h-screen py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent drop-shadow-sm">
              Was benötigen Sie?
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed"
          >
            Wählen Sie die Kategorie, die am besten zu Ihrem Projekt passt
          </motion.p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto px-4">
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
                delay={index * 0.15}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
