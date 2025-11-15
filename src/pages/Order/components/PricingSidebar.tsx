import { motion } from 'framer-motion';
import { ShoppingCart, MapPin, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Service, ServiceConfig } from '../OrderWizard';

interface PricingSidebarProps {
  selectedServices: Record<string, ServiceConfig>;
  services: Service[];
  total: number;
  step: number;
  travelCost?: number;
}

export const PricingSidebar = ({ 
  selectedServices, 
  services, 
  total, 
  step, 
  travelCost = 0 
}: PricingSidebarProps) => {
  const serviceCount = Object.keys(selectedServices).length;
  const subtotal = total - travelCost;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-card border-l border-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Ihre Bestellung</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Schritt {step} von 4
        </p>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {serviceCount === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Keine Services ausgewählt</p>
          </div>
        ) : (
          <>
            {Object.entries(selectedServices).map(([serviceId, config]) => {
              const service = services.find(s => s.id === serviceId);
              if (!service) return null;
              
              const price = service.base_price * config.quantity;
              const expressCharge = config.turnaround === 'express' ? price * 0.5 : 0;
              const itemTotal = price + expressCharge;

              return (
                <motion.div
                  key={serviceId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{service.name}</p>
                      <div className="text-muted-foreground space-y-0.5">
                        <p>Menge: {config.quantity}</p>
                        {config.turnaround === 'express' && (
                          <p className="text-accent">Express (+50%)</p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-foreground whitespace-nowrap">
                      €{itemTotal.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {serviceCount >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 bg-accent/10 text-accent px-2 py-1.5 rounded-md mt-3"
              >
                <Sparkles className="h-3 w-3" />
                <span className="text-xs font-semibold">Paket-Vorteil aktiv!</span>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Total Section */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Zwischensumme</span>
          <span className="font-medium">€{subtotal.toFixed(2)}</span>
        </div>
        
        {travelCost > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Anfahrtskosten
            </span>
            <span className="font-medium">€{travelCost.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-semibold">Gesamt</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-primary"
          >
            €{total.toFixed(2)}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};
