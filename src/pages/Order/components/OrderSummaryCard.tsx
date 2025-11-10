import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface OrderSummaryCardProps {
  service: Service;
  config: ServiceConfig;
}

export const OrderSummaryCard = ({ service, config }: OrderSummaryCardProps) => {
  const basePrice = service.base_price * config.quantity;
  const expressCharge = config.turnaround === 'express' ? 50 : 0;
  const total = basePrice + expressCharge;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{service.name}</h3>
          <p className="text-sm text-muted-foreground">
            {config.quantity}x • €{service.base_price} {service.unit === 'per_shoot' ? 'pro Shooting' : service.unit === 'per_image' ? 'pro Bild' : service.unit === 'per_room' ? 'pro Raum' : 'pro Grundriss'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">€{total}</p>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {config.turnaround === 'express' ? 'Express 24h (+€50)' : 'Standard 48h'}
        </Badge>
        {config.preferredDate && (
          <Badge variant="outline">
            {new Date(config.preferredDate).toLocaleDateString('de-DE')}
          </Badge>
        )}
      </div>

      {/* Notes */}
      {config.notes && (
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            <strong>Anmerkungen:</strong> {config.notes}
          </p>
        </div>
      )}

      {/* Features Preview */}
      <div className="flex flex-wrap gap-2 pt-2">
        {service.features.slice(0, 2).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
            <Check className="h-3 w-3 text-accent" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
