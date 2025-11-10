import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import type { Service } from '../OrderWizard';

interface PackageCardProps {
  package: {
    name: string;
    description: string;
    services: Service[];
    badge: string;
    savings: number;
  };
  onSelect: () => void;
  delay?: number;
}

export const PackageCard = ({ package: pkg, onSelect, delay = 0 }: PackageCardProps) => {
  const totalPrice = pkg.services.reduce((sum, service) => sum + service.base_price, 0);
  const discountedPrice = totalPrice * (1 - pkg.savings / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="relative"
    >
      <div className="h-full bg-gradient-to-br from-card to-card/50 border-2 border-accent/20 rounded-2xl p-6 space-y-4 hover:border-accent/40 transition-all hover:shadow-xl">
        {/* Badge */}
        <Badge className="bg-gradient-to-r from-accent to-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          {pkg.badge}
        </Badge>

        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>

        {/* Services List */}
        <ul className="space-y-2">
          {pkg.services.slice(0, 4).map((service) => (
            <li key={service.id} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{service.name}</span>
            </li>
          ))}
          {pkg.services.length > 4 && (
            <li className="text-sm text-muted-foreground pl-6">
              + {pkg.services.length - 4} weitere Services
            </li>
          )}
        </ul>

        {/* Pricing */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground line-through">
              €{totalPrice}
            </span>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              {pkg.savings}% Rabatt
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">€{discountedPrice.toFixed(0)}</span>
            <span className="text-sm text-muted-foreground">gespart</span>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="cta"
          className="w-full"
          onClick={onSelect}
        >
          Paket auswählen
        </Button>
      </div>
    </motion.div>
  );
};
