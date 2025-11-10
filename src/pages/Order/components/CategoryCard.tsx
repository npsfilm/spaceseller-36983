import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
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
        className="h-full cursor-pointer rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all duration-300 group"
        onClick={onClick}
      >
        <div className="flex flex-col items-center text-center space-y-5 p-8">
          {/* Icon Container */}
          <div className="p-4 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
            <Icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-md bg-muted">
              <span className="text-xs font-medium text-muted-foreground">
                {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-primary/10">
              <span className="text-xs font-bold font-mono text-primary">
                ab {startingPrice}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
