import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useUserOrders, useOrderSearch } from '@/lib/hooks/useOrders';
import { OrdersList } from '@/components/orders/OrdersList';

function MyOrdersContent() {
  const { data: orders = [], isLoading } = useUserOrders();
  const { searchTerm, setSearchTerm, filteredOrders } = useOrderSearch(orders);

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

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Bestellnummer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <OrdersList 
            orders={filteredOrders} 
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
