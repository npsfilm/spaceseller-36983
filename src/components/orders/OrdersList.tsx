import { Order } from "@/lib/services/OrderDataService";
import { OrderCard } from "./OrderCard";
import { OrdersEmptyState } from "./OrdersEmptyState";

export interface OrdersListProps {
  orders: Order[];
  hasSearchTerm?: boolean;
}

export const OrdersList = ({ orders, hasSearchTerm = false }: OrdersListProps) => {
  if (orders.length === 0) {
    return <OrdersEmptyState hasSearchTerm={hasSearchTerm} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
