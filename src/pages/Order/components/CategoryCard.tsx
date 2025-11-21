import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

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
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Category Card with glow animation on selection
export const CategoryCard = ({
  icon: Icon,
  image,
  title,
  description,
  serviceCount,
  startingPrice,
  onClick,
  delay = 0,
  isSelected = false
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
      className="h-full"
    >
      <div
        className={`relative h-full cursor-pointer rounded-lg border-2 bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden ${
          isSelected 
            ? 'border-primary animate-glow-border' 
            : 'border-border hover:border-primary/30'
        }`}
        onClick={onClick}
      >
        {/* Checkmark in Top Right Corner */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <svg 
              className="h-6 w-6 text-primary-foreground bg-primary rounded-full p-1 animate-check-in" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {/* Prominent Image at Top - 3:2 Aspect Ratio */}
        {image && (
          <div className="w-full aspect-[3/2] overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        {/* Content Below Image */}
        <div className="flex flex-col items-center text-center space-y-3 p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
