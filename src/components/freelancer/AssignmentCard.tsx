import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Package, Clock, Euro, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface AssignmentCardProps {
  assignment: {
    id: string;
    status: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    admin_notes: string | null;
    payment_amount: number | null;
    travel_cost: number | null;
    orders: {
      order_number: string;
      special_instructions: string | null;
      total_amount: number;
      profiles: {
        vorname: string;
        nachname: string;
        email: string;
        telefon: string | null;
      };
      addresses: Array<{
        strasse: string;
        hausnummer: string | null;
        plz: string;
        stadt: string;
        land: string;
      }>;
      order_items: Array<{
        quantity: number;
        total_price: number;
        services: {
          name: string;
        };
      }>;
    };
  };
  onViewDetails: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

const statusConfig = {
  pending: { label: 'Ausstehend', variant: 'secondary' as const },
  accepted: { label: 'Angenommen', variant: 'default' as const },
  declined: { label: 'Abgelehnt', variant: 'destructive' as const },
  completed: { label: 'Abgeschlossen', variant: 'outline' as const },
};

export const AssignmentCard = ({ 
  assignment, 
  onViewDetails, 
  onAccept, 
  onDecline 
}: AssignmentCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Handle missing orders data gracefully
  if (!assignment.orders) {
    console.warn('[AssignmentCard] Assignment has no orders data:', assignment.id);
    return null;
  }

  const address = assignment.orders.addresses?.[0];
  const statusInfo = statusConfig[assignment.status as keyof typeof statusConfig];
  const profiles = assignment.orders.profiles;
  const orderItems = assignment.orders.order_items || [];

  const formatAmount = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(2);

  const handleDetailsClick = () => {
    setDetailsOpen(true);
    onViewDetails();
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Auftrag #{assignment.orders.order_number}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {orderItems.length} Service{orderItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Amount */}
        {assignment.payment_amount !== null && assignment.payment_amount > 0 && (
          <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Vergütung:</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                €{formatAmount(assignment.payment_amount)}
              </span>
            </div>
            {assignment.travel_cost != null && assignment.travel_cost > 0 && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200 dark:border-green-800">
                <span className="text-muted-foreground">+ Reisekosten:</span>
                <span className="font-medium">€{formatAmount(assignment.travel_cost)}</span>
              </div>
            )}
            {assignment.travel_cost != null && assignment.travel_cost > 0 && (
              <div className="flex items-center justify-between text-sm font-semibold pt-1">
                <span>Gesamtvergütung:</span>
                <span className="text-green-600">
                  €{formatAmount(assignment.payment_amount + assignment.travel_cost)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Client Information */}
        {profiles && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Kunde:</h4>
            </div>
            <div className="text-sm text-muted-foreground ml-6">
              <p>{profiles.vorname} {profiles.nachname}</p>
              <p>{profiles.email}</p>
              {profiles.telefon && (
                <p>Tel: {profiles.telefon}</p>
              )}
            </div>
          </div>
        )}

        {/* Required Services */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Benötigte Leistungen:</h4>
          </div>
          {orderItems.length > 0 ? (
            <ul className="text-sm space-y-1 ml-6">
              {orderItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{item.quantity}x {item.services?.name || 'Service'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground ml-6">Details werden geladen...</p>
          )}
        </div>

        {/* Address */}
        {address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>
              {address.strasse} {address.hausnummer}, {address.plz} {address.stadt}
            </span>
          </div>
        )}

        {/* Scheduled Date/Time */}
        {assignment.scheduled_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(assignment.scheduled_date), 'dd. MMMM yyyy', { locale: de })}
              {assignment.scheduled_time && ` um ${assignment.scheduled_time.slice(0, 5)} Uhr`}
            </span>
          </div>
        )}

        {/* Admin Notes */}
        {assignment.admin_notes && (
          <div className="flex items-start gap-2 text-sm p-3 bg-muted rounded-lg">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-semibold text-xs mb-1">Anweisungen:</p>
              <span className="text-muted-foreground">{assignment.admin_notes}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleDetailsClick} variant="outline" className="flex-1">
            Details ansehen
          </Button>
          {assignment.status === 'pending' && onAccept && onDecline && (
            <>
              <Button onClick={onAccept} className="flex-1">
                Annehmen
              </Button>
              <Button onClick={onDecline} variant="destructive" className="flex-1">
                Ablehnen
              </Button>
            </>
          )}
        </div>
      </CardContent>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Auftragsdetails #{assignment.orders.order_number}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Payment Details */}
            {assignment.payment_amount !== null && assignment.payment_amount > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Euro className="h-4 w-4 text-green-600" />
                  Vergütung
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Basisvergütung:</span>
                    <span className="font-medium">€{formatAmount(assignment.payment_amount)}</span>
                  </div>
                  {assignment.travel_cost != null && assignment.travel_cost > 0 && (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Reisekosten:</span>
                        <span>€{formatAmount(assignment.travel_cost)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-600 pt-1 border-t">
                        <span>Gesamtvergütung:</span>
                        <span>€{formatAmount(assignment.payment_amount + assignment.travel_cost)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Client Information */}
            {profiles && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Kundeninformationen
                </h3>
                <div className="text-sm space-y-1 ml-6">
                  <p><span className="font-medium">Name:</span> {profiles.vorname} {profiles.nachname}</p>
                  <p><span className="font-medium">E-Mail:</span> {profiles.email}</p>
                  {profiles.telefon && (
                    <p><span className="font-medium">Telefon:</span> {profiles.telefon}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {address && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Aufnahmeort
                </h3>
                <p className="text-sm ml-6">
                  {address.strasse} {address.hausnummer}<br />
                  {address.plz} {address.stadt}<br />
                  {address.land}
                </p>
              </div>
            )}

            {/* Schedule */}
            {assignment.scheduled_date && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Termin
                </h3>
                <p className="text-sm ml-6">
                  {format(new Date(assignment.scheduled_date), 'EEEE, dd. MMMM yyyy', { locale: de })}
                  {assignment.scheduled_time && (
                    <span className="block mt-1">
                      Uhrzeit: {assignment.scheduled_time.slice(0, 5)} Uhr
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Required Services */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Benötigte Leistungen
              </h3>
              {orderItems.length > 0 ? (
                <ul className="text-sm space-y-2 ml-6">
                  {orderItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      <span>{item.quantity}x {item.services?.name || 'Service'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground ml-6">Keine Services definiert</p>
              )}
            </div>

            {/* Special Instructions */}
            {assignment.orders.special_instructions && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Besondere Wünsche des Kunden
                </h3>
                <p className="text-sm ml-6 text-muted-foreground whitespace-pre-wrap">
                  {assignment.orders.special_instructions}
                </p>
              </div>
            )}

            {/* Admin Notes */}
            {assignment.admin_notes && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Anweisungen vom Admin
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {assignment.admin_notes}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
