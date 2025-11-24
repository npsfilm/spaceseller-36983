import { Check } from 'lucide-react';
import { OrderStatus } from '@/types/orders';
import { cn } from '@/lib/utils';

interface OrderProgressStepperProps {
  status: OrderStatus;
}

interface Step {
  status: OrderStatus;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  {
    status: 'submitted',
    label: 'Eingereicht',
    description: 'Bestellung wurde eingereicht',
  },
  {
    status: 'in_progress',
    label: 'In Bearbeitung',
    description: 'Fotograf wurde zugewiesen',
  },
  {
    status: 'completed',
    label: 'Abgeschlossen',
    description: 'Aufnahmen abgeschlossen',
  },
  {
    status: 'delivered',
    label: 'Geliefert',
    description: 'Dateien stehen zum Download bereit',
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  draft: 0,
  submitted: 1,
  in_progress: 2,
  completed: 3,
  delivered: 4,
  cancelled: -1,
};

export const OrderProgressStepper = ({ status }: OrderProgressStepperProps) => {
  if (status === 'cancelled') {
    return (
      <div className="text-center py-8">
        <p className="text-destructive font-semibold">Diese Bestellung wurde storniert</p>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER[status] || 0;

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStepIndex;
          const isCurrent = stepNumber === currentStepIndex;

          return (
            <div key={step.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/20'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-4 -mt-12 transition-all',
                    stepNumber < currentStepIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStepIndex;
          const isCurrent = stepNumber === currentStepIndex;

          return (
            <div key={step.status} className="flex items-start gap-4">
              {/* Circle with connecting line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/20'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 transition-all',
                      stepNumber < currentStepIndex ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
