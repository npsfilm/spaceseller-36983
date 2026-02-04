import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getTimeOfDayGreeting } from './TimeBasedGreeting';

export interface WelcomeSectionProps {
  userName?: string;
  title?: string;
  subtitle: string;
  showTimeGreeting?: boolean;
  variant?: 'gradient' | 'simple';
  actions?: ReactNode;
  className?: string;
}

export const WelcomeSection = ({
  userName,
  title,
  subtitle,
  showTimeGreeting = false,
  variant = 'simple',
  actions,
  className
}: WelcomeSectionProps) => {
  const greeting = showTimeGreeting ? getTimeOfDayGreeting() : null;
  const Icon = greeting?.icon;

  const displayTitle = showTimeGreeting && greeting
    ? `${greeting.text}${userName ? `, ${userName}!` : '!'}`
    : title || 'Dashboard';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg p-6 mb-6",
        variant === 'gradient' && "bg-gradient-to-r from-primary/10 via-primary/5 to-background",
        variant === 'simple' && "mb-2",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className={cn("h-8 w-8", greeting?.colorClass)} />
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {displayTitle}
            </h1>
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};
