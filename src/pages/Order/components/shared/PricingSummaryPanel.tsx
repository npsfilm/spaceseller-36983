import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface LineItem {
  id: string;
  label: string;
  price: number;
  quantity?: number;
}

export interface PricingSummaryPanelProps {
  items: LineItem[];
  subtotal: number;
  taxRate?: number;
  additionalFees?: LineItem[];
  className?: string;
  emptyMessage?: string;
  showTax?: boolean;
}

/**
 * Reusable pricing summary panel for any configuration step
 * Displays line items, subtotal, tax, and total with consistent formatting
 */
export const PricingSummaryPanel = ({
  items,
  subtotal,
  taxRate = 0.19,
  additionalFees = [],
  className,
  emptyMessage = 'Noch keine Auswahl getroffen',
  showTax = true
}: PricingSummaryPanelProps) => {
  const hasItems = items.length > 0;
  const taxAmount = showTax ? subtotal * taxRate : 0;
  const total = subtotal + taxAmount;

  return (
    <Card className={cn('p-6 space-y-4 sticky top-6', className)}>
      <h3 className="text-lg font-semibold text-foreground">Zusammenfassung</h3>

      {!hasItems ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Line Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.label}
                  {item.quantity && item.quantity > 1 && (
                    <span className="text-muted-foreground ml-1">
                      ({item.quantity}x)
                    </span>
                  )}
                </span>
                <span className="font-medium">{item.price.toFixed(2)} €</span>
              </div>
            ))}

            {/* Additional Fees */}
            {additionalFees.map((fee) => (
              <div key={fee.id} className="flex justify-between text-sm">
                <span className="text-foreground">{fee.label}</span>
                <span className="font-medium">{fee.price.toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Subtotal and Tax */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gesamt</span>
              <span className="font-medium">{subtotal.toFixed(2)} €</span>
            </div>

            {showTax && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    MwSt. ({(taxRate * 100).toFixed(2)}%)
                  </span>
                  <span className="font-medium">{taxAmount.toFixed(2)} €</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nach MwSt.</span>
                  <span className="font-semibold">{total.toFixed(2)} €</span>
                </div>
              </>
            )}
          </div>

          {/* Total Display */}
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
