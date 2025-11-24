import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Order, orderDataService } from "@/lib/services/OrderDataService";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const canDownload = orderDataService.canDownloadOrder(order);
  const formattedDate = orderDataService.formatDate(order.created_at);
  const formattedDelivery = order.delivery_deadline 
    ? orderDataService.formatShortDate(order.delivery_deadline)
    : null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold font-mono">{order.order_number}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Erstellt am {formattedDate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {orderDataService.formatCurrency(order.total_amount)}
          </p>
        </div>
      </div>

      {order.order_items && order.order_items.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {order.order_items.map((item) => (
              <Badge key={item.id} variant="outline">
                {item.quantity}x {item.services.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {formattedDelivery && (
        <p className="text-sm text-muted-foreground mb-4">
          Voraussichtliche Lieferung: {formattedDelivery}
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/orders/${order.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Link>
        </Button>
        {canDownload && (
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Dateien herunterladen
          </Button>
        )}
      </div>
    </div>
  );
};
