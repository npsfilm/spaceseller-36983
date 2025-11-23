import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfigurationActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  disableNext?: boolean;
  disableSubmit?: boolean;
  className?: string;
}

/**
 * Standardized action buttons for configuration steps
 * Handles back, next, and submit actions with consistent styling
 */
export const ConfigurationActions = ({
  onBack,
  onNext,
  onSubmit,
  backLabel = 'Zurück',
  nextLabel = 'Weiter',
  submitLabel = 'Bestellung aufgeben',
  disableNext = false,
  disableSubmit = false,
  className
}: ConfigurationActionsProps) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* Back Button */}
      {onBack ? (
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {/* Next or Submit Button */}
      {onNext && (
        <Button
          variant="cta"
          onClick={onNext}
          disabled={disableNext}
          className="gap-2"
        >
          {nextLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}

      {onSubmit && (
        <Button
          variant="cta"
          onClick={onSubmit}
          disabled={disableSubmit}
          className="gap-2"
        >
          {submitLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
