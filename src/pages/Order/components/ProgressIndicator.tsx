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
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number <= currentStep;

          return (
            <div key={step.number} className="flex-1 relative">
              <button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={`w-full flex flex-col items-center group ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="relative flex items-center justify-center mb-2">
                  {/* Connector Line */}
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 top-1/2 w-full h-0.5 -z-10 transition-colors ${
                        isCompleted ? 'bg-accent' : 'bg-border'
                      }`}
                      style={{ right: '100%', width: '100%' }}
                    />
                  )}

                  {/* Step Circle */}
                  <motion.div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-accent border-accent text-accent-foreground'
                        : isCurrent
                        ? 'bg-background border-accent text-accent'
                        : 'bg-background border-border text-muted-foreground'
                    }`}
                    whileHover={isClickable ? { scale: 1.1 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </motion.div>
                </div>

                {/* Step Label */}
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex-1 relative">
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

                {/* Step Dot */}
                <div className="relative flex justify-center">
                  <motion.div
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-accent border-accent'
                        : isCurrent
                        ? 'bg-background border-accent'
                        : 'bg-background border-border'
                    }`}
                    initial={false}
                    animate={isCurrent ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted && (
                      <Check className="h-4 w-4 text-accent-foreground" />
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {steps[currentStep - 1]?.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Schritt {currentStep} von {steps.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
