import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import type { Service } from '../OrderWizard';

interface EnhancedServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
  isPopular?: boolean;
}

export const EnhancedServiceCard = ({
  service,
  isSelected,
  onToggle,
  isPopular
}: EnhancedServiceCardProps) => {
  const unitLabel = {
    per_shoot: 'pro Shooting',
    per_image: 'pro Bild',
    per_room: 'pro Raum',
    per_plan: 'pro Grundriss'
  }[service.unit] || service.unit;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative h-full"
    >
      <div
        className={`relative h-full bg-card border-2 rounded-2xl p-6 transition-all cursor-pointer ${
          isSelected
            ? 'border-accent shadow-lg shadow-accent/20'
            : 'border-border hover:border-accent/50 hover:shadow-md'
        }`}
        onClick={() => onToggle(service.id)}
      >
        {/* Popular Badge */}
        {isPopular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-primary">
            Beliebt
          </Badge>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-full p-2"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}

        {/* Icon Placeholder */}
        <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
          isSelected ? 'bg-accent/20' : 'bg-muted'
        }`}>
          <div className="text-2xl">
            {service.category === 'photography' && '📸'}
            {service.category === 'editing' && '✨'}
            {service.category === 'virtual_staging' && '🏠'}
            {service.category === 'floor_plan' && '📐'}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{service.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {service.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Ab</span>
            <span className="text-3xl font-bold">€{service.base_price}</span>
            <span className="text-sm text-muted-foreground">{unitLabel}</span>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <Button
            variant={isSelected ? 'default' : 'outline'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(service.id);
            }}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Ausgewählt
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Auswählen
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
