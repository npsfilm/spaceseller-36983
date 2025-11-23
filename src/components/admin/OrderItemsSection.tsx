import type { OrderItem } from '@/lib/services/OrderDetailService';

interface OrderItemsSectionProps {
  items: OrderItem[];
}

export const OrderItemsSection = ({ items }: OrderItemsSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-3">Bestellte Dienstleistungen</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{item.services?.name}</p>
              <p className="text-sm text-muted-foreground">Menge: {item.quantity}</p>
              {item.item_notes && (
                <p className="text-sm text-muted-foreground mt-1">Hinweis: {item.item_notes}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">{item.total_price.toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
