import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles } from 'lucide-react';
import type { Service, ServiceConfig } from '../OrderWizard';

interface PricingCalculatorProps {
  selectedServices: Record<string, ServiceConfig>;
  services: Service[];
  total: number;
  step: number;
}

export const PricingCalculator = ({ selectedServices, services, total, step }: PricingCalculatorProps) => {
  const serviceCount = Object.keys(selectedServices).length;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl"
    >
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Service Count */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <motion.div
                className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={serviceCount}
              >
                {serviceCount}
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-muted-foreground">Services</p>
              <p className="text-xs text-muted-foreground">Schritt {step} von 5</p>
            </div>
          </div>

          {/* Price Display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Gesamt</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                key={total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                €{total.toFixed(2)}
              </motion.p>
            </div>

            {/* Savings Badge (if applicable) */}
            {serviceCount >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden md:flex items-center gap-2 bg-accent/10 text-accent px-3 py-2 rounded-full"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Paket-Vorteil!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
