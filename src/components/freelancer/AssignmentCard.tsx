import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface AssignmentCardProps {
  assignment: {
    id: string;
    order_number: string;
    status: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    admin_notes: string | null;
    order: {
      id: string;
      special_instructions: string | null;
    };
    addresses: Array<{
      strasse: string;
      hausnummer: string;
      plz: string;
      stadt: string;
    }>;
    services: Array<{
      name: string;
      quantity: number;
    }>;
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
  const address = assignment.addresses[0];
  const statusInfo = statusConfig[assignment.status as keyof typeof statusConfig];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Auftrag #{assignment.order_number}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {assignment.services.map(s => `${s.name} (${s.quantity}x)`).join(', ')}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>
              {address.strasse} {address.hausnummer}, {address.plz} {address.stadt}
            </span>
          </div>
        )}

        {assignment.scheduled_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(assignment.scheduled_date), 'dd. MMMM yyyy', { locale: de })}
              {assignment.scheduled_time && ` um ${assignment.scheduled_time.slice(0, 5)} Uhr`}
            </span>
          </div>
        )}

        {assignment.admin_notes && (
          <div className="flex items-start gap-2 text-sm">
            <Package className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{assignment.admin_notes}</span>
          </div>
        )}

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
