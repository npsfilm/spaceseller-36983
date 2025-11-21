import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  icon: LucideIcon;
  image?: string;
  title: string;
  description: string;
  serviceCount: number;
  startingPrice: number;
  onClick: () => void;
  delay?: number;
  isSelected?: boolean;
  isPopular?: boolean;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Category Card with enhanced visual hierarchy and pricing display
export const CategoryCard = ({
  icon: Icon,
  image,
  title,
  description,
  serviceCount,
  startingPrice,
  onClick,
  delay = 0,
  isSelected = false,
  isPopular = false
}: CategoryCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        delay, 
        duration: 0.3, 
        ease: "easeOut"
      }}
      className="h-full flex justify-center"
    >
      <div
        className={`relative h-[400px] w-[300px] cursor-pointer rounded-lg border-2 bg-card hover:shadow-2xl transition-all duration-300 group overflow-hidden ${
          isSelected 
            ? 'border-primary shadow-xl shadow-primary/20' 
            : 'border-border hover:border-primary/40'
        }`}
        onClick={onClick}
      >
        {/* Background Image Filling 3:4 Card */}
        {image && (
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Stronger Gradient Overlay for Better Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/98 via-background/60 to-background/20" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          {/* Price Badge */}
          {startingPrice > 0 && (
            <Badge className="bg-primary/90 text-primary-foreground font-semibold shadow-lg backdrop-blur-sm hover:bg-primary transition-colors">
              ab €{startingPrice}
            </Badge>
          )}
          
          {/* Popular Badge */}
          {isPopular && (
            <Badge className="bg-accent/90 text-accent-foreground font-semibold shadow-lg backdrop-blur-sm ml-auto">
              Beliebt
            </Badge>
          )}
        </div>
        
        {/* Checkmark in Top Right Corner */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-30">
            <svg 
              className="h-7 w-7 text-primary-foreground bg-primary rounded-full p-1.5 animate-check-in shadow-lg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {/* Large Icon in Circular Badge */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {/* Service Count Info */}
          {serviceCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
              <span className="font-medium">{serviceCount} Service{serviceCount !== 1 ? 's' : ''} verfügbar</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
