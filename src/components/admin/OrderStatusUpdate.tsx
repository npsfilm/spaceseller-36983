import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderDetailService } from '@/lib/services/OrderDetailService';
import { useToast } from '@/hooks/use-toast';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export const OrderStatusUpdate = ({ orderId, currentStatus, onUpdate }: OrderStatusUpdateProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await orderDetailService.updateOrderStatus(
        orderId, 
        newStatus as 'draft' | 'submitted' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
      );

      toast({
        title: 'Status aktualisiert',
        description: 'Der Bestellstatus wurde erfolgreich aktualisiert',
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Status aktualisieren</h3>
      <div className="flex gap-4">
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Eingereicht</SelectItem>
            <SelectItem value="in_progress">In Bearbeitung</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
            <SelectItem value="delivered">Geliefert</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleStatusUpdate} 
          disabled={newStatus === currentStatus || updating}
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};
