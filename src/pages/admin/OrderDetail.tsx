import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrderDetails } from '@/lib/hooks/useOrderDetails';
import { orderDetailService } from '@/lib/services/OrderDetailService';
import { CustomerInfoSection } from '@/components/admin/CustomerInfoSection';
import { OrderInfoSection } from '@/components/admin/OrderInfoSection';
import { OrderItemsSection } from '@/components/admin/OrderItemsSection';
import { OrderAddressSection } from '@/components/admin/OrderAddressSection';
import { OrderUploadsSection } from '@/components/admin/OrderUploadsSection';
import { OrderStatusUpdate } from '@/components/admin/OrderStatusUpdate';
import { DeliverableUploadSection } from '@/components/admin/DeliverableUploadSection';
import { PhotographerAssignmentSection } from '@/components/admin/PhotographerAssignmentSection';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import type { Order } from '@/lib/services/AdminOrderService';

const statusLabels: Record<string, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
  delivered: 'Geliefert',
  cancelled: 'Storniert',
};

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  delivered: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);

  const {
    details,
    photographers,
    currentAssignment,
    loading: detailsLoading,
    refreshDetails,
    refreshAssignment,
  } = useOrderDetails(orderId || '', !!orderId);

  useEffect(() => {
    if (!orderId) {
      navigate('/admin-backend');
    } else {
      loadOrder();
    }
  }, [orderId, navigate]);

  const loadOrder = async () => {
    if (!orderId) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            email,
            vorname,
            nachname,
            firma,
            telefon
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast({
        title: 'Fehler',
        description: 'Bestellung konnte nicht geladen werden',
        variant: 'destructive',
      });
      navigate('/admin-backend');
    }
  };

  const handleDownload = async (filePath: string, fileName: string, bucket: string) => {
    try {
      await orderDetailService.downloadFile(filePath, fileName, bucket);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Datei konnte nicht heruntergeladen werden',
        variant: 'destructive',
      });
    }
  };

  const handleAssignmentUpdate = async () => {
    await refreshAssignment();
  };

  const handleOrderUpdate = async () => {
    await loadOrder();
    await refreshDetails();
  };

  if (detailsLoading || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Bestellung wird geladen... - Admin Dashboard</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  const shootingAddress = details.addresses.find((a) => a.address_type === 'shooting_location');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{order.order_number} - Bestelldetails - Admin Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin-backend">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zur Liste
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-2xl font-bold">{order.order_number}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Eingereicht am {new Date(order.created_at).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={`${statusColors[order.status]} px-4 py-2 text-base`}>
              {statusLabels[order.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Client Request Summary Card */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">Kundenanfrage</h2>
                  <p className="text-sm text-muted-foreground">
                    {order.profiles?.vorname} {order.profiles?.nachname} ({order.profiles?.email})
                    {order.profiles?.firma && ` • ${order.profiles.firma}`}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Bestelldatum</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {order.delivery_deadline && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Lieferfrist</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.delivery_deadline).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {shootingAddress && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Aufnahmeort</p>
                      <p className="text-sm text-muted-foreground">
                        {shootingAddress.strasse} {shootingAddress.hausnummer}, {shootingAddress.plz} {shootingAddress.stadt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Two-column layout for main content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <CustomerInfoSection customer={order.profiles || {}} />

              <PhotographerAssignmentSection
                orderId={order.id}
                orderNumber={order.order_number}
                totalAmount={order.total_amount}
                photographers={photographers}
                currentAssignment={currentAssignment}
                shootingAddress={shootingAddress}
                onAssignmentUpdate={handleAssignmentUpdate}
              />

              <OrderItemsSection items={details.items} />

              {details.addresses.length > 0 && (
                <OrderAddressSection addresses={details.addresses} />
              )}

              {order.special_instructions && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-3">Besondere Anweisungen</h3>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">
                    {order.special_instructions}
                  </p>
                </Card>
              )}

              {details.uploads.length > 0 && (
                <OrderUploadsSection
                  uploads={details.uploads}
                  onDownload={(path, name) => handleDownload(path, name, 'order-uploads')}
                />
              )}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              <OrderInfoSection order={order} statusLabels={statusLabels} />

              <OrderStatusUpdate
                orderId={order.id}
                currentStatus={order.status}
                onUpdate={handleOrderUpdate}
              />

              <DeliverableUploadSection
                orderId={order.id}
                orderNumber={order.order_number}
                deliverables={details.deliverables}
                onUploadComplete={refreshDetails}
                onDownload={(path, name) => handleDownload(path, name, 'order-deliverables')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
