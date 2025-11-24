import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const ProgressIndicator = ({ steps, currentStep, onStepClick }: ProgressIndicatorProps) => {
  const getTooltipText = (stepNumber: number, isCompleted: boolean, isCurrent: boolean) => {
    if (isCurrent) return 'Aktueller Schritt';
    if (isCompleted) return 'Klicken um zurückzukehren';
    return 'Noch nicht verfügbar';
  };

  return (
    <TooltipProvider>
      <div className="relative bg-card/95 backdrop-blur-md border-b-2 border-primary/10 shadow-md z-10 min-h-[60px]">
        {/* Compact Desktop View */}
        <div className="hidden md:flex items-center justify-between px-6 py-3">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = isCompleted; // Only completed steps are clickable

            return (
              <div key={step.number} className="flex-1 relative flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => isClickable && onStepClick(step.number)}
                      disabled={!isClickable}
                      className={cn(
                        "flex items-center gap-2 group transition-opacity",
                        isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'
                      )}
                      aria-label={`Schritt ${step.number}: ${step.title}`}
                    >
                      {/* Step Circle */}
                      <motion.div
                        className={cn(
                          "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                          isCompleted && 'bg-accent border-accent text-accent-foreground',
                          isCurrent && 'bg-primary border-primary text-primary-foreground',
                          !isCompleted && !isCurrent && 'bg-background border-border text-muted-foreground'
                        )}
                        whileHover={isClickable ? { scale: 1.1 } : {}}
                        whileTap={isClickable ? { scale: 0.95 } : {}}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-semibold">{step.number}</span>
                        )}
                      </motion.div>

                      {/* Step Label */}
                      <div className="text-left">
                        <p
                          className={cn(
                            "text-xs font-semibold leading-tight transition-colors",
                            isCurrent && 'text-foreground',
                            !isCurrent && 'text-muted-foreground',
                            isClickable && 'group-hover:text-foreground'
                          )}
                        >
                          {step.title}
                        </p>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{getTooltipText(step.number, isCompleted, isCurrent)}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-3 bg-border">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isClickable = isCompleted; // Only completed steps are clickable

              return (
                <div key={step.number} className="flex-1 relative">
                  {/* Step Dot - Now Clickable */}
                  <div className="relative flex justify-center">
                    <button
                      onClick={() => isClickable && onStepClick(step.number)}
                      disabled={!isClickable}
                      className={cn(
                        "relative",
                        isClickable && 'cursor-pointer active:scale-90 transition-transform'
                      )}
                      aria-label={`Schritt ${step.number}: ${step.title}`}
                    >
                      <motion.div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isCompleted && 'bg-accent border-accent',
                          isCurrent && 'bg-primary border-primary',
                          !isCompleted && !isCurrent && 'bg-background border-border'
                        )}
                        initial={false}
                        animate={isCurrent ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileTap={isClickable ? { scale: 0.85 } : {}}
                      >
                        {isCompleted && (
                          <Check className="h-3 w-3 text-accent-foreground" />
                        )}
                      </motion.div>
                    </button>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-3 h-0.5 transition-colors",
                        isCompleted ? 'bg-accent' : 'bg-border'
                      )}
                      style={{ 
                        left: '50%',
                        right: '-50%',
                        width: '100%'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Info */}
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">
              {steps[currentStep - 1]?.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Schritt {currentStep} von {steps.length}
            </p>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="h-0.5 bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
