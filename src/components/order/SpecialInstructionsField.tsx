import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SpecialInstructionsFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const SpecialInstructionsField = ({ 
  value, 
  onChange, 
  maxLength = 500 
}: SpecialInstructionsFieldProps) => {
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateInstructions = (text: string) => {
    if (text.length > maxLength) {
      return `Text ist zu lang (max. ${maxLength} Zeichen)`;
    }
    
    // Check for potentially harmful content patterns
    if (/<script|javascript:|onerror=/i.test(text)) {
      return 'Ungültige Zeichen erkannt';
    }
    
    return null;
  };

  const handleChange = (text: string) => {
    onChange(text);
    
    if (touched) {
      const error = validateInstructions(text);
      setValidationError(error);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const error = validateInstructions(value);
    setValidationError(error);
  };

  const hasError = touched && validationError !== null;
  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="special-instructions" className="text-base font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Besondere Hinweise (optional)
        </Label>
        <span 
          className={cn(
            "text-xs font-medium transition-colors",
            isNearLimit ? "text-amber-600" : "text-muted-foreground",
            hasError && "text-destructive"
          )}
        >
          {remainingChars} Zeichen übrig
        </span>
      </div>

      <Textarea
        id="special-instructions"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="z.B. Besondere Aufnahmewinkel, Objektbereiche die hervorgehoben werden sollen, Zeitfenster für den Termin..."
        className={cn(
          "min-h-[120px] text-base px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none",
          hasError 
            ? "border-destructive focus:border-destructive focus-visible:ring-destructive" 
            : "focus:border-primary"
        )}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? "instructions-error" : undefined}
      />

      {/* Inline Error Message */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            id="instructions-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30"
            role="alert"
            aria-live="polite"
          >
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium">
              {validationError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {!touched && !value && (
        <p className="text-xs text-muted-foreground px-1">
          💡 Teilen Sie uns alles mit, was für die erfolgreiche Bearbeitung wichtig ist
        </p>
      )}
    </div>
  );
};
