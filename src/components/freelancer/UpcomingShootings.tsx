import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Assignment } from '@/lib/services/AssignmentDataService';
import { assignmentDataService } from '@/lib/services/AssignmentDataService';

interface UpcomingShootingsProps {
  assignments: Assignment[];
}

export const UpcomingShootings = ({ assignments }: UpcomingShootingsProps) => {
  // Filter accepted assignments with future dates and sort by date
  const upcomingShootings = assignments
    .filter(a => a.status === 'accepted' && a.scheduled_date)
    .filter(a => new Date(a.scheduled_date!) >= new Date())
    .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime())
    .slice(0, 5);

  if (upcomingShootings.length === 0) {
    return null;
  }

  const getGoogleMapsLink = (assignment: Assignment) => {
    const address = assignmentDataService.getFormattedAddress(assignment);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getCountdown = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { locale: de, addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Anstehende Shootings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingShootings.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">#{assignment.orders?.order_number}</p>
                      <Badge variant="secondary" className="mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {getCountdown(assignment.scheduled_date!)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(assignment.scheduled_date!), 'dd.MM.yyyy', { locale: de })}
                        {assignment.scheduled_time && ` um ${assignment.scheduled_time}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{assignmentDataService.getCustomerName(assignment)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <a
                        href={getGoogleMapsLink(assignment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary underline underline-offset-2 flex items-center gap-1"
                      >
                        {assignmentDataService.getFormattedAddress(assignment)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    asChild
                  >
                    <a href={`#assignment-${assignment.id}`}>Details anzeigen</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
