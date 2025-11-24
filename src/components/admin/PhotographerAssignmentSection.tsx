import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Calculator, Route } from 'lucide-react';
import { PhotographerSuggestions } from './PhotographerSuggestions';
import { orderDetailService, type Photographer, type Assignment, type OrderAddress, type OrderItem } from '@/lib/services/OrderDetailService';
import { useToast } from '@/hooks/use-toast';
import { mapboxDistanceCalculator } from '@/lib/services/MapboxDistanceCalculator';
import { travelCostCalculator } from '@/lib/services/TravelCostCalculator';
import { photographerPaymentCalculator } from '@/lib/services/PhotographerPaymentCalculator';
import { supabase } from '@/integrations/supabase/client';

interface PhotographerAssignmentSectionProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  photographers: Photographer[];
  currentAssignment: Assignment | null;
  shootingAddress?: OrderAddress;
  orderItems: OrderItem[];
  onAssignmentUpdate: () => void;
}

export const PhotographerAssignmentSection = ({
  orderId,
  orderNumber,
  totalAmount,
  photographers,
  currentAssignment,
  shootingAddress,
  orderItems,
  onAssignmentUpdate,
}: PhotographerAssignmentSectionProps) => {
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [travelCost, setTravelCost] = useState<number>(0);
  const [calculating, setCalculating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentAssignment) {
      setSelectedPhotographer(currentAssignment.photographer_id);
      setAdminNotes(currentAssignment.admin_notes || '');
      setScheduledDate(currentAssignment.scheduled_date || '');
      setScheduledTime(currentAssignment.scheduled_time?.slice(0, 5) || '');
      setPaymentAmount(currentAssignment.payment_amount || 0);
      setTravelCost(currentAssignment.travel_cost || 0);
    }
  }, [currentAssignment]);

  const calculateCostsForPhotographer = useCallback(async (photographerId: string) => {
    if (!shootingAddress || calculating) return;

    setCalculating(true);

    try {
      // Fetch photographer location
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('location_lat, location_lng')
        .eq('id', photographerId)
        .single();

      if (error || !profile?.location_lat || !profile?.location_lng) {
        console.log('Photographer location not set');
        // Still suggest payment amount based on order
        const suggested = photographerPaymentCalculator.calculateSuggestedPayment(orderItems);
        setPaymentAmount(suggested);
        return;
      }

      // Build shooting address string
      const addressString = `${shootingAddress.strasse} ${shootingAddress.hausnummer || ''}, ${shootingAddress.plz} ${shootingAddress.stadt}`.trim();

      // Geocode shooting address if coordinates aren't available
      let shootingCoords: [number, number] | null = null;
      
      if (shootingAddress.latitude && shootingAddress.longitude) {
        shootingCoords = [shootingAddress.longitude, shootingAddress.latitude];
      } else {
        shootingCoords = await mapboxDistanceCalculator.geocodeAddress(addressString);
      }

      if (!shootingCoords) {
        toast({
          title: 'Hinweis',
          description: 'Shooting-Adresse konnte nicht gefunden werden. Reisekosten konnten nicht berechnet werden.',
          variant: 'default',
        });
        // Still suggest payment
        const suggested = photographerPaymentCalculator.calculateSuggestedPayment(orderItems);
        setPaymentAmount(suggested);
        return;
      }

      // Calculate driving distance
      const result = await mapboxDistanceCalculator.calculateDistance(
        profile.location_lng,
        profile.location_lat,
        shootingCoords[0],
        shootingCoords[1]
      );

      // Calculate travel cost
      const calculatedTravelCost = travelCostCalculator.calculateTravelCost(result.distance);
      setTravelCost(calculatedTravelCost);

      // Suggest payment amount
      const suggested = photographerPaymentCalculator.calculateSuggestedPayment(orderItems);
      setPaymentAmount(suggested);

      toast({
        title: 'Kosten berechnet',
        description: `Entfernung: ${result.distance.toFixed(1)} km • Fahrtzeit: ~${Math.round(result.duration)} Min`,
      });
    } catch (error) {
      console.error('Error calculating costs:', error);
      // Still suggest payment on error
      const suggested = photographerPaymentCalculator.calculateSuggestedPayment(orderItems);
      setPaymentAmount(suggested);
    } finally {
      setCalculating(false);
    }
  }, [shootingAddress, orderItems, toast]);

  // Auto-calculate travel cost and suggest payment when photographer is selected
  useEffect(() => {
    if (selectedPhotographer && !currentAssignment) {
      calculateCostsForPhotographer(selectedPhotographer);
    }
  }, [selectedPhotographer, currentAssignment, calculateCostsForPhotographer]);

  const handleAssignPhotographer = async () => {
    if (!selectedPhotographer) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie einen Fotografen aus',
        variant: 'destructive',
      });
      return;
    }

    setAssigning(true);

    try {
      const assignmentId = await orderDetailService.assignPhotographer(
        orderId,
        selectedPhotographer,
        adminNotes,
        scheduledDate,
        scheduledTime,
        paymentAmount,
        travelCost,
        currentAssignment?.id
      );

      // Create notification
      await orderDetailService.createPhotographerNotification(
        selectedPhotographer,
        orderNumber
      );

      // Trigger Zapier webhook
      const photographer = photographers.find(p => p.id === selectedPhotographer);
      if (photographer) {
        await orderDetailService.triggerZapierWebhook(
          orderNumber,
          orderId,
          assignmentId,
          selectedPhotographer,
          photographer.email,
          scheduledDate,
          scheduledTime,
          adminNotes,
          totalAmount,
          paymentAmount,
          travelCost
        );
      }

      toast({
        title: 'Erfolg',
        description: 'Fotograf erfolgreich zugewiesen',
      });

      onAssignmentUpdate();
    } catch (error) {
      console.error('Error assigning photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Zuweisen des Fotografen',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
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
        {shootingAddress && (
          <PhotographerSuggestions
            orderId={orderId}
            shootingAddress={shootingAddress}
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

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Vergütung & Reisekosten</h4>
            {calculating && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calculator className="h-3 w-3 animate-pulse" />
                <span>Berechne...</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="payment-amount">Vergütung (€)</Label>
                <Calculator className="h-3 w-3 text-muted-foreground" />
              </div>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={calculating}
              />
              <p className="text-xs text-muted-foreground mt-1">Automatisch vorgeschlagen</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="travel-cost">Reisekosten (€)</Label>
                <Route className="h-3 w-3 text-muted-foreground" />
              </div>
              <Input
                id="travel-cost"
                type="number"
                min="0"
                step="0.01"
                value={travelCost || ''}
                onChange={(e) => setTravelCost(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={calculating}
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-berechnet via Mapbox</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded border">
            <span className="font-semibold text-sm">Gesamtvergütung:</span>
            <span className="text-lg font-bold text-primary">
              €{((paymentAmount || 0) + (travelCost || 0)).toFixed(2)}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleAssignPhotographer} 
          disabled={!selectedPhotographer || assigning}
          className="w-full"
        >
          {currentAssignment ? 'Zuweisung aktualisieren' : 'Fotograf zuweisen'}
        </Button>
      </div>
    </div>
  );
};
