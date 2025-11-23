import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface OrderInfoSectionProps {
  order: {
    order_number: string;
    created_at: string;
    total_amount: number;
    status: string;
  };
  statusLabels: Record<string, string>;
}

export const OrderInfoSection = ({ order, statusLabels }: OrderInfoSectionProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Bestellinformationen</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">Bestellnummer</Label>
          <p className="font-medium">{order.order_number}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Erstellt am</Label>
          <p>{new Date(order.created_at).toLocaleString('de-DE')}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Gesamtbetrag</Label>
          <p className="font-medium">{order.total_amount.toFixed(2)} €</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Aktueller Status</Label>
          <Badge variant="outline">{statusLabels[order.status]}</Badge>
        </div>
      </div>
    </div>
  );
};
