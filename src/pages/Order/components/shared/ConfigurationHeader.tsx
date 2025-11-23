import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfigurationHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

/**
 * Standardized header component for configuration steps
 * Provides consistent layout with icon, title, and description
 */
export const ConfigurationHeader = ({
  icon: Icon,
  title,
  description,
  iconClassName,
  titleClassName,
  descriptionClassName,
  className
}: ConfigurationHeaderProps) => {
  return (
    <div className={cn('text-center space-y-3', className)}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Icon className={cn('w-10 h-10 text-primary', iconClassName)} />
      </div>
      <h2 className={cn('text-4xl font-bold', titleClassName)}>{title}</h2>
      <p className={cn('text-muted-foreground text-lg max-w-2xl mx-auto', descriptionClassName)}>
        {description}
      </p>
    </div>
  );
};
