import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/orders';

interface OrderFilterTabsProps {
  currentFilter: OrderStatus | 'all';
  onFilterChange: (filter: OrderStatus | 'all') => void;
  counts: Record<OrderStatus | 'all', number>;
}

export const OrderFilterTabs = ({ currentFilter, onFilterChange, counts }: OrderFilterTabsProps) => {
  return (
    <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as OrderStatus | 'all')}>
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
        <TabsTrigger value="all" className="gap-2">
          Alle
          <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="submitted" className="gap-2">
          Eingereicht
          <Badge variant="secondary" className="ml-1">{counts.submitted}</Badge>
        </TabsTrigger>
        <TabsTrigger value="in_progress" className="gap-2">
          In Bearbeitung
          <Badge variant="secondary" className="ml-1">{counts.in_progress}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="gap-2">
          Abgeschlossen
          <Badge variant="secondary" className="ml-1">{counts.completed}</Badge>
        </TabsTrigger>
        <TabsTrigger value="delivered" className="gap-2">
          Geliefert
          <Badge variant="secondary" className="ml-1">{counts.delivered}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
