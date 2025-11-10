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
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 }
};

const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: 5 }
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
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ 
        delay, 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }}
      className="relative group"
    >
      {/* Gradient Border Wrapper */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      {/* Main Card */}
      <div
        className="relative overflow-hidden cursor-pointer rounded-2xl border-2 border-border bg-card/80 backdrop-blur-sm hover:border-primary transition-all duration-500 shadow-lg hover:shadow-elegant group"
        onClick={onClick}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 p-10">
          {/* Icon Container */}
          <motion.div 
            variants={iconVariants}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md" />
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-all duration-300 ring-1 ring-primary/20 group-hover:ring-primary/40">
              <Icon className="h-16 w-16 text-primary group-hover:text-primary-glow transition-colors duration-300" strokeWidth={1.5} />
            </div>
          </motion.div>
          
          {/* Title */}
          <h3 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground/90 text-base leading-relaxed max-w-xs group-hover:text-muted-foreground transition-colors duration-300">
            {description}
          </p>
          
          {/* Meta Info - Redesigned with Badges */}
          <div className="flex items-center gap-3 pt-4">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                📦 {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
              </span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
              <span className="text-sm font-bold font-mono text-primary group-hover:text-accent transition-colors duration-300">
                ab {startingPrice}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
