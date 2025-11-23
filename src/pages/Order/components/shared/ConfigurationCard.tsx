import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ConfigurationCardProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Standardized card component for configuration steps
 * Provides consistent styling and interaction patterns
 */
export const ConfigurationCard = ({
  children,
  className,
  selected = false,
  onClick,
  disabled = false
}: ConfigurationCardProps) => {
  const isInteractive = !!onClick && !disabled;

  return (
    <Card
      className={cn(
        'p-6 transition-all duration-200',
        isInteractive && 'cursor-pointer hover:shadow-lg hover:border-primary/50',
        selected && 'border-primary border-2 shadow-lg ring-2 ring-primary/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Card>
  );
};
