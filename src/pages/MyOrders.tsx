import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Search, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  draft: 'bg-gray-500',
  submitted: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  delivered: 'bg-teal-500',
  cancelled: 'bg-red-500'
};

const statusLabels = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
  delivered: 'Geliefert',
  cancelled: 'Storniert'
};

function MyOrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          services (name)
        )
      `)
      .eq('user_id', user.id)
      .neq('status', 'draft')
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Keine Bestellungen gefunden</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Keine Bestellungen entsprechen Ihrer Suche' : 'Sie haben noch keine Bestellungen aufgegeben'}
              </p>
              <Button asChild>
                <Link to="/order">Erste Bestellung erstellen</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold font-mono">{order.order_number}</h3>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Erstellt am {new Date(order.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">€{order.total_amount}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.order_items?.map((item: any) => (
                        <Badge key={item.id} variant="outline">
                          {item.quantity}x {item.services.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {order.delivery_deadline && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Voraussichtliche Lieferung: {new Date(order.delivery_deadline).toLocaleDateString('de-DE')}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/order/confirmation/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Link>
                    </Button>
                    {order.status === 'delivered' && (
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Dateien herunterladen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
