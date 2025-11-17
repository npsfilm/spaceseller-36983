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
      transition={{ 
        delay, 
        duration: 0.3, 
        ease: "easeOut"
      }}
      className="h-full"
    >
      <div
        className="relative h-full min-h-[280px] cursor-pointer rounded-lg border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300 group overflow-hidden"
        onClick={onClick}
      >
        {/* Background Image */}
        {image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/60" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-6 h-full">
          {/* Icon Container */}
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-md bg-muted/80 backdrop-blur-sm">
              <span className="text-xs font-medium text-muted-foreground">
                {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
              </span>
            </div>
            {startingPrice > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-primary/10 backdrop-blur-sm">
                <span className="text-xs font-bold font-mono text-primary">
                  ab {startingPrice}€
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
