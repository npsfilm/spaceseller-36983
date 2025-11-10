import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Camera, Edit, Home, MapPin } from 'lucide-react';
import type { Service } from '../OrderWizard';

interface CompactServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
}

// Get icon based on service category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'photography':
      return <Camera className="h-5 w-5" />;
    case 'editing':
      return <Edit className="h-5 w-5" />;
    case 'virtual_staging':
      return <Home className="h-5 w-5" />;
    case 'floor_plan':
      return <MapPin className="h-5 w-5" />;
    default:
      return <Camera className="h-5 w-5" />;
  }
};

export const CompactServiceCard = ({
  service,
  isSelected,
  onToggle
}: CompactServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-4 rounded-lg border-2 transition-all
        ${isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-card hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
          `}>
            {getCategoryIcon(service.category)}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{service.name}</h4>
            <p className="text-sm text-muted-foreground">Ab €{service.base_price}</p>
          </div>
        </div>

        <Button
          size="sm"
          variant={isSelected ? 'default' : 'outline'}
          onClick={() => onToggle(service.id)}
          className="gap-2"
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4" />
              Ausgewählt
            </>
          ) : (
            '+'
          )}
        </Button>
      </div>
    </motion.div>
  );
};
