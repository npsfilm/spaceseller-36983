import { motion, Variants } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ContentSectionProps {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  fallback?: ReactNode;
  loading?: boolean;
  className?: string;
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const ContentSection = ({
  children,
  animate = true,
  delay = 0,
  fallback,
  loading = false,
  className
}: ContentSectionProps) => {
  const defaultFallback = fallback || <Skeleton className="h-96 w-full" />;

  if (loading) {
    return <div className={className}>{defaultFallback}</div>;
  }

  if (!animate) {
    return (
      <Suspense fallback={defaultFallback}>
        <div className={className}>{children}</div>
      </Suspense>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4, delay }}
      className={cn(className)}
    >
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </motion.div>
  );
};
