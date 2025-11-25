import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProfileCompletenessService, MissingField } from '@/lib/services/ProfileCompletenessService';
import { CompleteProfileDialog } from './CompleteProfileDialog';

interface ProfileCompletionBannerProps {
  missingFields: MissingField[];
  completionPercentage: number;
  onProfileUpdate?: () => void;
}

export const ProfileCompletionBanner = ({
  missingFields,
  completionPercentage,
  onProfileUpdate,
}: ProfileCompletionBannerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const groupedFields = ProfileCompletenessService.groupMissingFieldsBySection(missingFields);

  const handleComplete = () => {
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

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
          onClick={() => setDialogOpen(true)}
          variant="default"
          size="sm"
          className="mt-2"
        >
          Jetzt vervollständigen
        </Button>
      </AlertDescription>

      <CompleteProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        missingFields={missingFields}
        onComplete={handleComplete}
      />
    </Alert>
  );
};
