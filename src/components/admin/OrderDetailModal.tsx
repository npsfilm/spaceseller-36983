import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useOrderDetails } from '@/lib/hooks/useOrderDetails';
import { orderDetailService } from '@/lib/services/OrderDetailService';
import { CustomerInfoSection } from './CustomerInfoSection';
import { OrderInfoSection } from './OrderInfoSection';
import { OrderItemsSection } from './OrderItemsSection';
import { OrderAddressSection } from './OrderAddressSection';
import { OrderUploadsSection } from './OrderUploadsSection';
import { OrderStatusUpdate } from './OrderStatusUpdate';
import { DeliverableUploadSection } from './DeliverableUploadSection';
import { PhotographerAssignmentSection } from './PhotographerAssignmentSection';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types/orders';

interface OrderDetailModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusLabels: Record<string, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
  delivered: 'Geliefert',
  cancelled: 'Storniert',
};

export function OrderDetailModal({ order, open, onClose, onUpdate }: OrderDetailModalProps) {
  const { toast } = useToast();
  const { 
    details, 
    photographers, 
    currentAssignment, 
    loading,
    refreshDetails,
    refreshAssignment 
  } = useOrderDetails(order.id, open);

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
    onUpdate();
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const shootingAddress = details.addresses.find(a => a.address_type === 'shooting_location');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bestelldetails - {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <CustomerInfoSection customer={order.profiles || {}} />

          <Separator />

          <PhotographerAssignmentSection
            orderId={order.id}
            orderNumber={order.order_number}
            totalAmount={order.total_amount}
            photographers={photographers}
            currentAssignment={currentAssignment}
            shootingAddress={shootingAddress}
            onAssignmentUpdate={handleAssignmentUpdate}
          />

          <Separator />

          <OrderInfoSection order={order} statusLabels={statusLabels} />

          <Separator />

          <OrderItemsSection items={details.items} />

          {details.addresses.length > 0 && (
            <>
              <Separator />
              <OrderAddressSection addresses={details.addresses} />
            </>
          )}

          {order.special_instructions && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Besondere Anweisungen</h3>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {order.special_instructions}
                </p>
              </div>
            </>
          )}

          {details.uploads.length > 0 && (
            <>
              <Separator />
              <OrderUploadsSection 
                uploads={details.uploads} 
                onDownload={(path, name) => handleDownload(path, name, 'order-uploads')} 
              />
            </>
          )}

          <Separator />

          <OrderStatusUpdate 
            orderId={order.id} 
            currentStatus={order.status} 
            onUpdate={onUpdate} 
          />

          <Separator />

          <DeliverableUploadSection
            orderId={order.id}
            orderNumber={order.order_number}
            deliverables={details.deliverables}
            onUploadComplete={refreshDetails}
            onDownload={(path, name) => handleDownload(path, name, 'order-deliverables')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
