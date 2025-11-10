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
    showSavings?: boolean;
    regularPrice?: number;
  };
  onSelect: () => void;
  delay?: number;
}

export const PackageCard = ({ package: pkg, onSelect, delay = 0 }: PackageCardProps) => {
  // For package cards showing multiple service options, display the lowest price
  // For Kombi packages with showSavings, show the lowest Kombi price with savings
  const lowestPrice = Math.min(...pkg.services.map(s => s.base_price));
  
  // Kombi-Paket regular prices (what you'd pay separately)
  const kombiRegularPrices: Record<string, number> = {
    'Kombi 15': 578,
    'Kombi 20': 678,
    'Kombi 30': 889
  };
  
  let displayPrice = lowestPrice;
  let regularPrice = null;
  let savingsAmount = 0;
  
  // Check if any service in the package is a Kombi package
  const kombiService = pkg.services.find(s => s.name.includes('Kombi'));
  if (kombiService && pkg.showSavings) {
    // For Kombi packages, show the lowest Kombi price
    displayPrice = Math.min(...pkg.services.filter(s => s.name.includes('Kombi')).map(s => s.base_price));
    // Get the corresponding regular price for the lowest Kombi package
    const lowestKombiService = pkg.services
      .filter(s => s.name.includes('Kombi'))
      .reduce((min, s) => s.base_price < min.base_price ? s : min);
    regularPrice = kombiRegularPrices[lowestKombiService.name] || displayPrice;
    savingsAmount = regularPrice - displayPrice;
  }

  // Simplify to 3 key benefits
  const benefits = pkg.services.slice(0, 3).map(s => s.name);
  if (pkg.services.length > 3) {
    benefits[2] = `+ ${pkg.services.length - 2} weitere Services`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="relative h-full p-8 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all shadow-lg hover:shadow-xl">
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-accent to-primary rounded-full">
          <span className="text-sm font-bold text-primary-foreground">{pkg.badge}</span>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-3">{pkg.name}</h3>
            <p className="text-lg text-muted-foreground">{pkg.description}</p>
          </div>

          {/* Simplified Benefits - Only 3 */}
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 justify-center">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-base font-medium text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="pt-6 border-t border-border">
            <div className="text-center space-y-2">
              {regularPrice && savingsAmount > 0 ? (
                // Kombi package with savings
                <>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-foreground">€{displayPrice.toFixed(0)}</span>
                    <span className="text-xl text-muted-foreground line-through">€{regularPrice.toFixed(0)}</span>
                  </div>
                  <p className="text-base font-semibold text-accent">
                    Sie sparen €{savingsAmount.toFixed(0)}
                  </p>
                </>
              ) : (
                // Regular package
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-bold text-foreground">ab €{displayPrice.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full gap-2 text-lg h-14 font-semibold"
            onClick={onSelect}
          >
            Paket auswählen
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
