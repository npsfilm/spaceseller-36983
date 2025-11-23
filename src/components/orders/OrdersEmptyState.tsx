import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export interface OrdersEmptyStateProps {
  hasSearchTerm?: boolean;
}

export const OrdersEmptyState = ({ hasSearchTerm = false }: OrdersEmptyStateProps) => {
  return (
    <div className="text-center py-16 bg-card border border-border rounded-xl">
      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2">Keine Bestellungen gefunden</h3>
      <p className="text-muted-foreground mb-6">
        {hasSearchTerm 
          ? 'Keine Bestellungen entsprechen Ihrer Suche' 
          : 'Sie haben noch keine Bestellungen aufgegeben'}
      </p>
      {!hasSearchTerm && (
        <Button asChild>
          <Link to="/order">Erste Bestellung erstellen</Link>
        </Button>
      )}
    </div>
  );
};
