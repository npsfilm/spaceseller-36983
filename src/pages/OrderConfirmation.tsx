import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Package, Clock } from 'lucide-react';

function OrderConfirmationContent() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    const { data: orderData } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          services (*)
        )
      `)
      .eq('id', orderId)
      .single();

    setOrder(orderData);
    setLoading(false);
  };

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
        <div className="container mx-auto max-w-2xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">Bestellung erfolgreich!</h1>
              <p className="text-muted-foreground">
                Vielen Dank für Ihre Bestellung bei spaceseller
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bestellnummer</span>
                <span className="font-mono font-semibold">{order?.order_number}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gesamtbetrag</span>
                <span className="text-2xl font-bold">€{order?.total_amount}</span>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Voraussichtliche Lieferung</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.delivery_deadline ? 
                      new Date(order.delivery_deadline).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) 
                      : 'In Kürze'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Bestellte Services:</h3>
                <ul className="space-y-2">
                  {order?.order_items?.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.services.name}</span>
                      <span>€{item.total_price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3 text-left">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Was passiert als Nächstes?</p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                    <li>• Sie erhalten eine Bestätigungs-E-Mail</li>
                    <li>• Unser Team beginnt mit der Bearbeitung</li>
                    <li>• Sie werden über den Fortschritt informiert</li>
                    <li>• Die fertigen Dateien werden in Ihrem Account verfügbar sein</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/my-orders">Meine Bestellungen</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/order">Neue Bestellung</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function OrderConfirmation() {
  return (
    <ProtectedRoute requireOnboarding>
      <OrderConfirmationContent />
    </ProtectedRoute>
  );
}
