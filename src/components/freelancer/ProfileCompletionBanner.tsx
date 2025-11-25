import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { ProfileCompletenessService, MissingField } from '@/lib/services/ProfileCompletenessService';

interface ProfileCompletionBannerProps {
  missingFields: MissingField[];
  completionPercentage: number;
}

export const ProfileCompletionBanner = ({
  missingFields,
  completionPercentage,
}: ProfileCompletionBannerProps) => {
  const navigate = useNavigate();
  const groupedFields = ProfileCompletenessService.groupMissingFieldsBySection(missingFields);

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-lg font-semibold">Profil unvollständig</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          Sie können keine Aufträge annehmen, bis Ihr Profil vollständig ausgefüllt ist. 
          Diese Informationen werden für die Rechnungsstellung und Bezahlung benötigt.
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Profil zu {completionPercentage}% vollständig</span>
            <span className="text-muted-foreground">
              {missingFields.length} {missingFields.length === 1 ? 'Feld fehlt' : 'Felder fehlen'}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Fehlende Informationen:</p>
          <ul className="space-y-1 text-sm">
            {Array.from(groupedFields.entries()).map(([section, labels]) => (
              <li key={section} className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>
                  <strong>{section}:</strong> {labels.join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => navigate('/settings')}
          variant="default"
          size="sm"
          className="mt-2"
        >
          Zu den Einstellungen
        </Button>
      </AlertDescription>
    </Alert>
  );
};
