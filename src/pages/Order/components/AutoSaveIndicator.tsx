import { Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  onSaveNow: () => void;
  variant?: 'desktop' | 'mobile';
}

/**
 * Unified auto-save status indicator for the order wizard
 * Renders differently based on desktop/mobile variant
 */
export const AutoSaveIndicator = ({
  isSaving,
  lastSaved,
  onSaveNow,
  variant = 'desktop'
}: AutoSaveIndicatorProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (variant === 'mobile') {
    return (
      <div className="md:hidden flex items-center gap-2">
        {isSaving ? (
          <Badge variant="outline" className="gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            <span className="text-xs">Speichert...</span>
          </Badge>
        ) : lastSaved ? (
          <Badge variant="outline" className="gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs">{formatTime(lastSaved)}</span>
          </Badge>
        ) : null}
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
      {isSaving ? (
        <Badge variant="outline" className="gap-2 bg-background/95 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          <span className="text-xs">Speichert...</span>
        </Badge>
      ) : lastSaved ? (
        <Badge variant="outline" className="gap-2 bg-background/95 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs">{formatTime(lastSaved)}</span>
        </Badge>
      ) : null}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSaveNow}
        disabled={isSaving}
        className="h-8 gap-2"
      >
        <Save className="h-4 w-4" />
        <span className="text-xs">Jetzt speichern</span>
      </Button>
    </div>
  );
};
