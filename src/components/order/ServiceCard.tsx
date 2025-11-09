import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Minus, Plus } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    base_price: number;
    unit: string;
    features: string[];
  };
  quantity: number;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  isPopular?: boolean;
}

export const ServiceCard = ({ service, quantity, onQuantityChange, isPopular }: ServiceCardProps) => {
  const unitLabel = {
    per_shoot: 'pro Shooting',
    per_image: 'pro Bild',
    per_room: 'pro Raum',
    per_plan: 'pro Grundriss'
  }[service.unit] || service.unit;

  return (
    <div className={`relative bg-card border rounded-xl p-6 transition-all hover:shadow-lg ${
      quantity > 0 ? 'border-primary shadow-md' : 'border-border'
    }`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-hero">
          Beliebt
        </Badge>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{service.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">€{service.base_price}</span>
            <span className="text-muted-foreground">{unitLabel}</span>
          </div>
        </div>

        <ul className="space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {quantity === 0 ? (
          <Button 
            onClick={() => onQuantityChange(service.id, 1)}
            className="w-full"
            variant="outline"
          >
            Auswählen
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(service.id, quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center font-semibold">
              {quantity}x
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(service.id, quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
