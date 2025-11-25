import { format } from "date-fns";
import { de } from "date-fns/locale";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UnavailabilityCardProps {
  id: string;
  startDate: string;
  endDate?: string;
  reason?: string;
  onDelete: (id: string) => void;
}

export const UnavailabilityCard = ({ 
  id, 
  startDate, 
  endDate, 
  reason, 
  onDelete 
}: UnavailabilityCardProps) => {
  const formatDateRange = () => {
    const start = format(new Date(startDate), "dd. MMM yyyy", { locale: de });
    
    if (endDate && endDate !== startDate) {
      const end = format(new Date(endDate), "dd. MMM yyyy", { locale: de });
      return `${start} - ${end}`;
    }
    
    return start;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{formatDateRange()}</p>
              {reason && (
                <p className="text-sm text-muted-foreground mt-1">{reason}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
