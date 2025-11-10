import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  serviceCount: number;
  startingPrice: number;
  onClick: () => void;
  delay?: number;
}

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className="relative overflow-hidden cursor-pointer p-8 border-2 hover:border-primary transition-all duration-300 group bg-card hover:shadow-xl"
        onClick={onClick}
      >
        {/* Background Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold">{title}</h3>
          
          {/* Description */}
          <p className="text-muted-foreground">{description}</p>
          
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm pt-2">
            <span className="text-muted-foreground">
              {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
            </span>
            <span className="text-foreground font-semibold">
              ab {startingPrice}€
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
