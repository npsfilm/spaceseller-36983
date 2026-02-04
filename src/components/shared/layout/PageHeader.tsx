import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getTimeOfDayGreeting } from '../greeting/TimeBasedGreeting';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showGreeting?: boolean;
  userName?: string;
  actions?: ReactNode;
  animate?: boolean;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  showGreeting = false,
  userName,
  actions,
  animate = true,
  className
}: PageHeaderProps) => {
  const greeting = showGreeting ? getTimeOfDayGreeting() : null;
  const Icon = greeting?.icon;

  const displayTitle = showGreeting && greeting
    ? `${greeting.text}${userName ? `, ${userName}!` : '!'}`
    : title;

  const content = (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon className={cn("h-8 w-8", greeting?.colorClass)} />
        )}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {displayTitle}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  );
};
