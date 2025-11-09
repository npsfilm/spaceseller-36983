import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, X } from 'lucide-react';

interface OrderDetailModalProps {
  order: any;
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
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState(order.status);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchOrderDetails();
    }
  }, [open, order.id]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch order items with services
      const { data: items } = await supabase
        .from('order_items')
        .select(`
          *,
          services (
            name,
            category
          )
        `)
        .eq('order_id', order.id);

      setOrderItems(items || []);

      // Fetch uploads
      const { data: uploadsData } = await supabase
        .from('order_uploads')
        .select('*')
        .eq('order_id', order.id);

      setUploads(uploadsData || []);

      // Fetch deliverables
      const { data: deliverablesData } = await supabase
        .from('order_deliverables')
        .select('*')
        .eq('order_id', order.id);

      setDeliverables(deliverablesData || []);

      // Fetch addresses
      const { data: addressesData } = await supabase
        .from('addresses')
        .select('*')
        .eq('order_id', order.id);

      setAddresses(addressesData || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

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
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);

    try {
      for (const file of acceptedFiles) {
        const fileName = `${order.order_number}/${Date.now()}-${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('order-deliverables')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create deliverable record
        const { error: dbError } = await supabase
          .from('order_deliverables')
          .insert({
            order_id: order.id,
            file_path: fileName,
            file_name: file.name,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: 'Dateien hochgeladen',
        description: `${acceptedFiles.length} Datei(en) erfolgreich hochgeladen`,
      });

      fetchOrderDetails();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Fehler',
        description: 'Dateien konnten nicht hochgeladen werden',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const downloadFile = async (filePath: string, fileName: string, bucket: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Fehler',
        description: 'Datei konnte nicht heruntergeladen werden',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bestelldetails - {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-3">Kundeninformationen</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p>{order.profiles?.vorname} {order.profiles?.nachname}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p>{order.profiles?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Telefon</Label>
                <p>{order.profiles?.telefon || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Firma</Label>
                <p>{order.profiles?.firma || '-'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Information */}
          <div>
            <h3 className="font-semibold mb-3">Bestellinformationen</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Bestellnummer</Label>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Erstellt am</Label>
                <p>{new Date(order.created_at).toLocaleString('de-DE')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Gesamtbetrag</Label>
                <p className="font-medium">{order.total_amount.toFixed(2)} €</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Aktueller Status</Label>
                <Badge variant="outline">{statusLabels[order.status]}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ordered Services */}
          <div>
            <h3 className="font-semibold mb-3">Bestellte Dienstleistungen</h3>
            <div className="space-y-2">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.services?.name}</p>
                    <p className="text-sm text-muted-foreground">Menge: {item.quantity}</p>
                    {item.item_notes && (
                      <p className="text-sm text-muted-foreground mt-1">Hinweis: {item.item_notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.total_price.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Address */}
          {addresses.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Objektadresse</h3>
                {addresses.map((addr) => (
                  <div key={addr.id} className="text-sm space-y-1">
                    <p>{addr.strasse} {addr.hausnummer}</p>
                    <p>{addr.plz} {addr.stadt}</p>
                    <p>{addr.land}</p>
                    {addr.additional_info && <p className="text-muted-foreground mt-2">{addr.additional_info}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Special Instructions */}
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

          {/* Uploaded Files */}
          {uploads.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Hochgeladene Dateien ({uploads.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm truncate">{upload.file_name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(upload.file_path, upload.file_name, 'order-uploads')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Status Update */}
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
              <Button onClick={handleStatusUpdate} disabled={newStatus === order.status}>
                Speichern
              </Button>
            </div>
          </div>

          <Separator />

          {/* Deliverables Upload */}
          <div>
            <h3 className="font-semibold mb-3">Lieferdateien hochladen</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              {uploading ? (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              ) : isDragActive ? (
                <p className="text-sm text-muted-foreground">Dateien hier ablegen...</p>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Dateien hierher ziehen oder klicken zum Auswählen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mehrere Dateien werden unterstützt
                  </p>
                </div>
              )}
            </div>

            {deliverables.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2">Hochgeladene Lieferdateien</Label>
                <div className="space-y-2">
                  {deliverables.map((deliverable) => (
                    <div key={deliverable.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm truncate">{deliverable.file_name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(deliverable.file_path, deliverable.file_name, 'order-deliverables')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
