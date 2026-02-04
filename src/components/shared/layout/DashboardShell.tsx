import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DashboardShellProps {
  children: ReactNode;
  variant: 'client' | 'freelancer' | 'admin';
  maxWidth?: 'lg' | 'xl' | '2xl' | 'full' | '7xl';
  padding?: 'sm' | 'md' | 'lg';
  noIndex?: boolean;
  title?: string;
  className?: string;
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const DashboardShell = ({
  children,
  variant,
  maxWidth = '7xl',
  padding = 'md',
  noIndex = false,
  title,
  className
}: DashboardShellProps) => {
  const maxWidthClass = {
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }[maxWidth];

  const paddingClass = {
    sm: 'px-4 py-4',
    md: 'px-4 sm:px-6 lg:px-8 py-8',
    lg: 'px-4 sm:px-6 lg:px-8 py-12'
  }[padding];

  // Determine if this is a protected dashboard that shouldn't be indexed
  const shouldNoIndex = noIndex || variant === 'admin' || variant === 'freelancer';

  return (
    <>
      {shouldNoIndex && (
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
          {title && <title>{title}</title>}
        </Helmet>
      )}
      
      <div className={cn("min-h-screen bg-background", className)}>
        <div className={cn(maxWidthClass, paddingClass, "mx-auto")}>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};
