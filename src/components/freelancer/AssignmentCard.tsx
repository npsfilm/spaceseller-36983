import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Package, Clock, Euro, User } from 'lucide-react';
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
  const address = assignment.orders.addresses[0];
  const statusInfo = statusConfig[assignment.status as keyof typeof statusConfig];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Auftrag #{assignment.orders.order_number}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {assignment.orders.order_items.length} Service{assignment.orders.order_items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Amount */}
        <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-600" />
              <span className="font-semibold">Vergütung:</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              €{(assignment.payment_amount || 0).toFixed(2)}
            </span>
          </div>
          {assignment.travel_cost && assignment.travel_cost > 0 && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200 dark:border-green-800">
              <span className="text-muted-foreground">+ Reisekosten:</span>
              <span className="font-medium">€{assignment.travel_cost.toFixed(2)}</span>
            </div>
          )}
          {assignment.travel_cost && assignment.travel_cost > 0 && (
            <div className="flex items-center justify-between text-sm font-semibold pt-1">
              <span>Gesamtvergütung:</span>
              <span className="text-green-600">
                €{((assignment.payment_amount || 0) + (assignment.travel_cost || 0)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Client Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Kunde:</h4>
          </div>
          <div className="text-sm text-muted-foreground ml-6">
            <p>{assignment.orders.profiles.vorname} {assignment.orders.profiles.nachname}</p>
            <p>{assignment.orders.profiles.email}</p>
            {assignment.orders.profiles.telefon && (
              <p>Tel: {assignment.orders.profiles.telefon}</p>
            )}
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm">Services:</h4>
          </div>
          <ul className="text-sm space-y-1 ml-6">
            {assignment.orders.order_items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.quantity}x {item.services.name}</span>
                <span className="font-medium">€{item.total_price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
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
          <Button onClick={onViewDetails} variant="outline" className="flex-1">
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
    </Card>
  );
};
