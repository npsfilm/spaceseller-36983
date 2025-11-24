import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';
import { useUserOrders, useOrderSearch } from '@/lib/hooks/useOrders';
import { OrdersList } from '@/components/orders/OrdersList';
import { OrderFilterTabs } from '@/components/orders/OrderFilterTabs';
import { OrderStatus } from '@/types/orders';
import { orderDataService } from '@/lib/services/OrderDataService';

type SortOption = 'newest' | 'oldest' | 'amount-high' | 'amount-low';

function MyOrdersContent() {
  const { data: orders = [], isLoading } = useUserOrders();
  const { searchTerm, setSearchTerm, filteredOrders } = useOrderSearch(orders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Filter by status
  const statusFilteredOrders = useMemo(() => {
    if (statusFilter === 'all') return filteredOrders;
    return filteredOrders.filter(order => order.status === statusFilter);
  }, [filteredOrders, statusFilter]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...statusFilteredOrders];
    switch (sortOption) {
      case 'newest':
        return orderDataService.sortOrdersByDate(sorted, false);
      case 'oldest':
        return orderDataService.sortOrdersByDate(sorted, true);
      case 'amount-high':
        return sorted.sort((a, b) => b.total_amount - a.total_amount);
      case 'amount-low':
        return sorted.sort((a, b) => a.total_amount - b.total_amount);
      default:
        return sorted;
    }
  }, [statusFilteredOrders, sortOption]);

  // Calculate counts for filter tabs
  const filterCounts = useMemo(() => {
    const grouped = orderDataService.groupOrdersByStatus(orders);
    return {
      all: orders.length,
      submitted: grouped.submitted.length,
      in_progress: grouped.in_progress.length,
      completed: grouped.completed.length,
      delivered: grouped.delivered.length,
      draft: grouped.draft.length,
      cancelled: grouped.cancelled.length,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Meine Bestellungen</h1>
            <p className="text-muted-foreground">Verwalten und verfolgen Sie Ihre Aufträge</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <OrderFilterTabs
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
              counts={filterCounts}
            />
          </div>

          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Bestellnummer oder Service suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Neueste zuerst</SelectItem>
                <SelectItem value="oldest">Älteste zuerst</SelectItem>
                <SelectItem value="amount-high">Betrag (hoch-niedrig)</SelectItem>
                <SelectItem value="amount-low">Betrag (niedrig-hoch)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          {sortedOrders.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {sortedOrders.length} {sortedOrders.length === 1 ? 'Bestellung' : 'Bestellungen'} gefunden
            </p>
          )}

          <OrdersList 
            orders={sortedOrders} 
            hasSearchTerm={!!searchTerm} 
          />
        </div>
      </div>
    </Layout>
  );
}

export default function MyOrders() {
  return (
    <ProtectedRoute requireOnboarding>
      <MyOrdersContent />
    </ProtectedRoute>
  );
}
