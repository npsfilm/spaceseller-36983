import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Edit2, ShoppingCart } from 'lucide-react';
import { OrderSummaryCard } from '../components/OrderSummaryCard';
import type { Service, OrderState } from '../OrderWizard';

interface ReviewStepProps {
  services: Service[];
  orderState: OrderState;
  onUpdateInstructions: (instructions: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  calculateTotal: () => number;
}

export const ReviewStep = ({
  services,
  orderState,
  onUpdateInstructions,
  onBack,
  onSubmit,
  calculateTotal
}: ReviewStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  const total = calculateTotal();
  const subtotal = Object.values(orderState.selectedServices).reduce((sum, config) => {
    const service = services.find(s => s.id === config.serviceId);
    return sum + ((service?.base_price || 0) * config.quantity);
  }, 0);
  const expressCharges = Object.values(orderState.selectedServices).reduce((sum, config) => {
    return sum + (config.turnaround === 'express' ? 50 : 0);
  }, 0);

  // Calculate upgrades total
  const upgradesTotal = orderState.selectedUpgrades.reduce((sum, upgrade) => {
    return sum + (upgrade.price * upgrade.quantity);
  }, 0);

  // Calculate virtual staging total with package pricing
  let virtualStagingTotal = 0;
  if (orderState.virtualStagingCount > 0) {
    const count = orderState.virtualStagingCount;
    // Use package pricing
    if (count === 1) virtualStagingTotal = 89;
    else if (count === 3) virtualStagingTotal = 249;
    else if (count >= 5) virtualStagingTotal = 399;
    else virtualStagingTotal = 89 * count; // For 2 or 4 images
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <ShoppingCart className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Bestellung prüfen</h1>
        <p className="text-lg text-muted-foreground">
          Überprüfen Sie Ihre Bestellung bevor Sie sie absenden
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Ausgewählte Services</h2>
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <Edit2 className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            </div>
            <div className="space-y-4">
              {Object.values(orderState.selectedServices).map((config, index) => {
                const service = services.find(s => s.id === config.serviceId);
                if (!service) return null;
                return (
                  <motion.div
                    key={config.serviceId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <OrderSummaryCard service={service} config={config} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Address */}
          {orderState.address.strasse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Shooting-Adresse</h3>
              <div className="text-sm space-y-1">
                <p>{orderState.address.strasse} {orderState.address.hausnummer}</p>
                <p>{orderState.address.plz} {orderState.address.stadt}</p>
                {orderState.address.additional_info && (
                  <p className="text-muted-foreground mt-2">
                    {orderState.address.additional_info}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Uploads */}
          {orderState.uploads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">
                Hochgeladene Bilder ({orderState.uploads.length})
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {orderState.uploads.slice(0, 8).map((upload) => (
                  <div key={upload.id} className="aspect-square bg-muted rounded-lg" />
                ))}
                {orderState.uploads.length > 8 && (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-sm font-semibold">
                    +{orderState.uploads.length - 8}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Special Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <Label className="text-lg font-bold mb-4 block">
              Besondere Wünsche oder Anmerkungen
            </Label>
            <Textarea
              value={orderState.specialInstructions}
              onChange={(e) => onUpdateInstructions(e.target.value)}
              placeholder="Haben Sie noch spezielle Anforderungen oder Wünsche?"
              rows={4}
            />
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-xl font-bold">Zusammenfassung</h3>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Services</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </div>
              {upgradesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upgrades</span>
                  <span className="font-semibold">€{upgradesTotal.toFixed(2)}</span>
                </div>
              )}
              {virtualStagingTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Virtual Staging ({orderState.virtualStagingCount}x)
                  </span>
                  <span className="font-semibold">€{virtualStagingTotal.toFixed(2)}</span>
                </div>
              )}
              {orderState.travelCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anfahrt</span>
                  <span className="font-semibold">€{orderState.travelCost.toFixed(2)}</span>
                </div>
              )}
              {orderState.travelCost === 0 && orderState.selectedCategory === 'photography' && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Anfahrt</span>
                  <span className="text-accent">Kostenlos</span>
                </div>
              )}
              {expressCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Express-Zuschlag</span>
                  <span className="font-semibold">€{expressCharges.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-accent">€{total.toFixed(2)}</span>
              </div>
              {orderState.selectedCategory === 'photography' && (
                <p className="text-xs text-muted-foreground italic text-center">
                  Anfahrt unter 20€ kostenfrei
                </p>
              )}
            </div>

            <Separator />

            {/* Trust Signals */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                <span>24-48h Lieferzeit</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                <span>100% Zufriedenheitsgarantie</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                <span>Unbegrenzte Revisionen</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-accent" />
                <span>Professionelle Bearbeitung</span>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
                variant="cta"
              >
                {isSubmitting ? 'Wird verarbeitet...' : 'Jetzt bestellen'}
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
