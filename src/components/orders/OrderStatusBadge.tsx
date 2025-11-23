import { Badge } from "@/components/ui/badge";
import { orderDataService, Order } from "@/lib/services/OrderDataService";
import { cn } from "@/lib/utils";

export interface OrderStatusBadgeProps {
  status: Order['status'];
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const color = orderDataService.getStatusColor(status);
  const label = orderDataService.getStatusLabel(status);

  return (
    <Badge className={cn(color, "text-white", className)}>
      {label}
    </Badge>
  );
};
