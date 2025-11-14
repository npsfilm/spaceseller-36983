import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PhotographerSuggestions } from './PhotographerSuggestions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, X, Camera } from 'lucide-react';

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
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchOrderDetails();
      fetchPhotographers();
      fetchCurrentAssignment();
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

  const fetchPhotographers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'photographer');

      if (error) throw error;

      const photographerIds = data?.map(r => r.user_id) || [];
      
      if (photographerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, vorname, nachname, email')
          .in('id', photographerIds);

        const formattedPhotographers = profilesData?.map(profile => ({
          id: profile.id,
          name: `${profile.vorname || ''} ${profile.nachname || ''}`.trim() || profile.email,
          email: profile.email
        })) || [];

        setPhotographers(formattedPhotographers);
      }
    } catch (error) {
      console.error('Error fetching photographers:', error);
    }
  };

  const fetchCurrentAssignment = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('order_assignments')
        .select(`
          *,
          profiles!order_assignments_photographer_id_fkey(vorname, nachname, email)
        `)
        .eq('order_id', order.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setCurrentAssignment(data);
      if (data) {
        setSelectedPhotographer(data.photographer_id);
        setAdminNotes(data.admin_notes || '');
        setScheduledDate(data.scheduled_date || '');
        setScheduledTime(data.scheduled_time?.slice(0, 5) || '');
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  };

  const handleAssignPhotographer = async () => {
    if (!selectedPhotographer) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie einen Fotografen aus',
        variant: 'destructive',
      });
      return;
    }

    try {
      const assignmentData = {
        order_id: order.id,
        photographer_id: selectedPhotographer,
        assigned_by: (await supabase.auth.getUser()).data.user?.id,
        admin_notes: adminNotes,
        scheduled_date: scheduledDate || null,
        scheduled_time: scheduledTime || null,
        status: 'pending'
      };

      if (currentAssignment) {
        const { error } = await (supabase as any)
          .from('order_assignments')
          .update(assignmentData)
          .eq('id', currentAssignment.id);

        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('order_assignments')
          .insert(assignmentData);

        if (error) throw error;
      }

      // Create notification for photographer
      await (supabase as any).from('notifications').insert({
        user_id: selectedPhotographer,
        type: 'assignment_created',
        title: 'Neuer Auftrag zugewiesen',
        message: `Sie wurden für Auftrag #${order.order_number} zugewiesen.`,
        link: '/freelancer-dashboard'
      });

      // Trigger Zapier webhook
      try {
        await supabase.functions.invoke('trigger-zapier-webhook', {
          body: {
            assignmentData: {
              order_number: order.order_number,
              order_id: order.id,
              photographer_id: selectedPhotographer,
              photographer_email: photographers.find(p => p.id === selectedPhotographer)?.email,
              scheduled_date: scheduledDate,
              scheduled_time: scheduledTime,
              admin_notes: adminNotes,
              total_amount: order.total_amount,
              timestamp: new Date().toISOString()
            }
          }
        });
      } catch (error) {
        console.error('Error triggering Zapier webhook:', error);
        // Don't fail the assignment if webhook fails
      }

      toast({
        title: 'Erfolg',
        description: 'Fotograf erfolgreich zugewiesen',
      });

      fetchCurrentAssignment();
      onUpdate();
    } catch (error) {
      console.error('Error assigning photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Zuweisen des Fotografen',
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

          {/* Photographer Assignment */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Fotografen-Zuweisung
            </h3>
            
            {currentAssignment && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Aktueller Status</Label>
                  <Badge variant={
                    currentAssignment.status === 'accepted' ? 'default' :
                    currentAssignment.status === 'declined' ? 'destructive' :
                    'secondary'
                  }>
                    {currentAssignment.status === 'pending' && 'Ausstehend'}
                    {currentAssignment.status === 'accepted' && 'Angenommen'}
                    {currentAssignment.status === 'declined' && 'Abgelehnt'}
                    {currentAssignment.status === 'completed' && 'Abgeschlossen'}
                  </Badge>
                </div>
                {currentAssignment.photographer_notes && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">Notiz vom Fotografen</Label>
                    <p className="text-sm mt-1">{currentAssignment.photographer_notes}</p>
                  </div>
                )}
                {currentAssignment.status === 'declined' && currentAssignment.photographer_notes && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1 text-sm">Ablehnungsgrund:</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{currentAssignment.photographer_notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {/* Photographer Suggestions Based on Location */}
              {addresses.find(a => a.address_type === 'shooting_location') && (
                <PhotographerSuggestions
                  orderId={order.id}
                  shootingAddress={addresses.find(a => a.address_type === 'shooting_location')}
                  scheduledDate={scheduledDate}
                  onSelectPhotographer={setSelectedPhotographer}
                  selectedPhotographer={selectedPhotographer}
                />
              )}

              <div>
                <Label htmlFor="photographer-select">Fotograf auswählen</Label>
                <Select value={selectedPhotographer} onValueChange={setSelectedPhotographer}>
                  <SelectTrigger id="photographer-select">
                    <SelectValue placeholder="Fotografen auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {photographers.length === 0 ? (
                      <SelectItem value="none" disabled>Keine Fotografen verfügbar</SelectItem>
                    ) : (
                      photographers.map((photographer) => (
                        <SelectItem key={photographer.id} value={photographer.id}>
                          {photographer.name} ({photographer.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduled-date">Shooting-Termin</Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduled-time">Uhrzeit</Label>
                  <Input
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-notes">Anweisungen für den Fotografen</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Spezielle Anweisungen, Hinweise, etc..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAssignPhotographer} 
                disabled={!selectedPhotographer}
                className="w-full"
              >
                {currentAssignment ? 'Zuweisung aktualisieren' : 'Fotograf zuweisen'}
              </Button>
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
