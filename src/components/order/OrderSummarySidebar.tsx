import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Package, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { OrderState } from '@/lib/hooks/useOrderState';
import { PACKAGE_TIERS } from '@/data/photographyPackages';

interface OrderSummarySidebarProps {
  orderState: OrderState;
  categoryLabel: string;
}

// Delivery time estimates by category
const DELIVERY_ESTIMATES: Record<string, string> = {
  onsite: '5-7 Werktage',
  photo_editing: '3-5 Werktage',
  virtual_staging: '2-4 Werktage',
  energy_certificate: '7-10 Werktage',
};

export const OrderSummarySidebar = ({ orderState, categoryLabel }: OrderSummarySidebarProps) => {
  // Calculate line items and totals
  const lineItems = useMemo(() => {
    const items: Array<{ id: string; label: string; price: number; quantity?: number }> = [];

    // Photography package
    if (orderState.selectedPackage) {
      const pkg = PACKAGE_TIERS.find(p => p.id === orderState.selectedPackage);
      if (pkg) {
        items.push({
          id: 'package',
          label: `${pkg.name} (${pkg.photoCount} Fotos)`,
          price: pkg.price
        });
      }
    }

    // Other category products (from selectedProducts)
    Object.entries(orderState.selectedProducts).forEach(([serviceId, productData]) => {
      if (productData.quantity > 0) {
        items.push({
          id: serviceId,
          label: 'Service', // Would need service name from services array
          price: productData.totalPrice,
          quantity: productData.quantity
        });
      }
    });

    return items;
  }, [orderState]);

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.price, 0);
  }, [lineItems]);

  const travelCostIncluded = orderState.travelCost > 0;

  const total = subtotal;

  const deliveryEstimate = orderState.selectedCategory 
    ? DELIVERY_ESTIMATES[orderState.selectedCategory] || '5-7 Werktage'
    : '5-7 Werktage';

  const estimatedDeliveryDate = useMemo(() => {
    const today = new Date();
    const daysToAdd = orderState.selectedCategory === 'onsite' ? 7 : 5;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    
    return deliveryDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }, [orderState.selectedCategory]);

  const hasItems = lineItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="hidden lg:block w-96 sticky top-24 h-fit"
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Bestellübersicht</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selected Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Gewählte Leistungen
            </h4>
            
            <AnimatePresence mode="popLayout">
              {hasItems ? (
                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-start p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">{item.label}</p>
                        {item.quantity && item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Menge: {item.quantity}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap ml-3">
                        {item.price.toFixed(0)}€
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Noch keine Leistung ausgewählt
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasItems && (
            <>
              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zwischensumme</span>
                  <span className="font-medium">{subtotal.toFixed(0)}€</span>
                </div>

                {travelCostIncluded && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Anfahrt</span>
                    <span className="font-medium text-green-600">inkludiert</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Gesamtpreis</span>
                  <span className="text-2xl font-bold text-primary">
                    {total.toFixed(0)}€
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  * Alle Preise sind Nettopreise zzgl. MwSt.
                </p>
              </div>

              <Separator />

              {/* Delivery Estimate */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Lieferung
                </h4>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Bearbeitungszeit</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {deliveryEstimate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Voraussichtlich</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        bis {estimatedDeliveryDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Next Steps Hint */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Nächster Schritt
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                  <span>Klicken Sie auf "Bestellung aufgeben"</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
