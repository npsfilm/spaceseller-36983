import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
  return (
    <div className="relative bg-card/95 backdrop-blur-md border-b-2 border-primary/10 shadow-md z-10 min-h-[60px]">
      {/* Compact Desktop View */}
      <div className="hidden md:flex items-center justify-between px-6 py-3">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number <= currentStep;

          return (
            <div key={step.number} className="flex-1 relative flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={`flex items-center gap-2 group ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                {/* Step Circle */}
                <motion.div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-accent border-accent text-accent-foreground'
                      : isCurrent
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
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
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </button>

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

            return (
              <div key={step.number} className="flex-1 relative">
                {/* Step Dot */}
                <div className="relative flex justify-center">
                  <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-accent border-accent'
                        : isCurrent
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    }`}
                    initial={false}
                    animate={isCurrent ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted && (
                      <Check className="h-3 w-3 text-accent-foreground" />
                    )}
                  </motion.div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-3 h-0.5 transition-colors ${
                      isCompleted ? 'bg-accent' : 'bg-border'
                    }`}
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
  );
};
