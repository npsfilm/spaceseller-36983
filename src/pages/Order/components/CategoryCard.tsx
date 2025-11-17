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
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const CategoryCard = ({
  icon: Icon,
  image,
  title,
  description,
  serviceCount,
  startingPrice,
  onClick,
  delay = 0
}: CategoryCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        delay, 
        duration: 0.3, 
        ease: "easeOut"
      }}
      className="h-full"
    >
      <div
        className="relative h-full cursor-pointer rounded-lg border-2 border-border bg-card hover:border-primary hover:shadow-lg active:border-primary/70 transition-all duration-300 group overflow-hidden"
        onClick={onClick}
      >
        {/* Prominent Image at Top */}
        {image && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        {/* Content Below Image */}
        <div className="flex flex-col items-center text-center space-y-3 p-6">
          {/* Icon Container */}
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>
          
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
