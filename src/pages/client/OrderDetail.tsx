import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, FileText, User, Clock } from 'lucide-react';
import { orderDataService } from '@/lib/services/OrderDataService';
import { orderFileService } from '@/lib/services/OrderFileService';
import { OrderProgressStepper } from '@/components/orders/OrderProgressStepper';
import { FileGallery } from '@/components/orders/FileGallery';
import { DeliverableDownload } from '@/components/orders/DeliverableDownload';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useAuth } from '@/contexts/AuthContext';

function OrderDetailContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: async () => {
      if (!orderId || !user) throw new Error('Missing order ID or user');
      return orderFileService.fetchOrderWithDetails(orderId, user.id);
    },
    enabled: !!orderId && !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Bestellung nicht gefunden</h2>
            <Button onClick={() => navigate('/my-orders')}>
              Zurück zu Bestellungen
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-orders')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Bestellungen
            </Button>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold font-mono mb-2">{order.order_number}</h1>
                <p className="text-muted-foreground">
                  Erstellt am {orderDataService.formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <OrderStatusBadge status={order.status} className="mb-2" />
                <p className="text-3xl font-bold">
                  {orderDataService.formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Stepper */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <OrderProgressStepper status={order.status} />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Bestelldetails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items && order.order_items.length > 0 && (
                  <div>
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

                {order.special_instructions && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Besondere Anweisungen:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {order.special_instructions}
                    </p>
                  </div>
                )}

                {order.delivery_deadline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Voraussichtliche Lieferung: {orderDataService.formatShortDate(order.delivery_deadline)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address & Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Standort & Termine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.addresses && order.addresses.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Aufnahmeort:</p>
                    {order.addresses.map((addr) => (
                      <div key={addr.id} className="text-sm text-muted-foreground">
                        <p>{addr.strasse} {addr.hausnummer}</p>
                        <p>{addr.plz} {addr.stadt}</p>
                        {addr.additional_info && <p>{addr.additional_info}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {(order.requested_date || order.requested_time) && (
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Gewünschter Termin:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.requested_date && new Date(order.requested_date).toLocaleDateString('de-DE')}
                      {order.requested_time && ` um ${order.requested_time}`}
                    </p>
                  </div>
                )}

                {(order.alternative_date || order.alternative_time) && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Alternativer Termin:</p>
                    <p className="text-sm text-muted-foreground">
                      {order.alternative_date && new Date(order.alternative_date).toLocaleDateString('de-DE')}
                      {order.alternative_time && ` um ${order.alternative_time}`}
                    </p>
                  </div>
                )}

              {order.special_instructions && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-2">Besondere Anweisungen:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {order.special_instructions}
                    </p>
                  </div>
                </>
              )}

              {order.assignment && order.assignment.scheduled_date && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Geplanter Aufnahmetermin:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.assignment.scheduled_date).toLocaleDateString('de-DE')}
                        {order.assignment.scheduled_time && ` um ${order.assignment.scheduled_time}`}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Files */}
          {order.uploads && order.uploads.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hochgeladene Dateien</CardTitle>
              </CardHeader>
              <CardContent>
                <FileGallery files={order.uploads} />
              </CardContent>
            </Card>
          )}

          {/* Deliverables */}
          {order.deliverables && order.deliverables.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Lieferbare Dateien</CardTitle>
              </CardHeader>
              <CardContent>
                <DeliverableDownload deliverables={order.deliverables} orderId={order.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function OrderDetail() {
  return (
    <ProtectedRoute requireOnboarding requireClient>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
