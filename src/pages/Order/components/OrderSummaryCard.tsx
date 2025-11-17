import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Service } from '../OrderWizard';

interface OrderSummaryCardProps {
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  services: Service[];
  travelCost: number;
}

export const OrderSummaryCard = ({
  selectedProducts,
  services,
  travelCost
}: OrderSummaryCardProps) => {
  const productTotal = Object.values(selectedProducts).reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );

  const subtotal = productTotal + travelCost;
  const taxRate = 0.19;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const hasProducts = Object.keys(selectedProducts).length > 0;

  return (
    <Card className="p-6 space-y-4 sticky top-6">
      <h3 className="text-lg font-semibold text-foreground">Zusammenfassung</h3>

      {!hasProducts ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Noch kein Produkt gewählt</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {Object.entries(selectedProducts).map(([serviceId, product]) => {
              // Mock product names for display
              const productName = serviceId.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
              
              return (
                <div key={serviceId} className="flex justify-between text-sm">
                  <span className="text-foreground">{productName}</span>
                  <span className="font-medium">{product.totalPrice.toFixed(2)} €</span>
                </div>
              );
            })}

            {travelCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Anfahrt</span>
                <span className="font-medium">{travelCost.toFixed(2)} €</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gesamt</span>
              <span className="font-medium">{subtotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MwSt. (19.00%)</span>
              <span className="font-medium">{taxAmount.toFixed(2)} €</span>
            </div>

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nach MwSt.</span>
              <span className="font-semibold">{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Gesamtpreis</p>
              <p className="text-2xl font-bold text-primary">{total.toFixed(2)} €</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
