import { motion } from 'framer-motion';
import { CheckCircle2, Circle, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface ChecklistItemData {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  completed: boolean;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export interface ChecklistItemProps extends ChecklistItemData {
  index?: number;
  variant?: 'client' | 'freelancer';
}

export const ChecklistItem = ({
  label,
  description,
  icon: Icon,
  completed,
  actionLabel,
  actionLink,
  onAction,
  index = 0,
  variant = 'client'
}: ChecklistItemProps) => {
  const isFreelancer = variant === 'freelancer';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={cn(
        "flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-colors",
        completed 
          ? isFreelancer 
            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
            : "bg-success/10 border-success/20"
          : "bg-muted/50 border-border hover:bg-muted"
      )}>
        <div className="flex-shrink-0">
          {completed ? (
            <CheckCircle2 className={cn(
              "w-5 h-5 sm:w-6 sm:h-6",
              isFreelancer ? "text-green-600 dark:text-green-400" : "text-success"
            )} />
          ) : (
            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-shrink-0">
          <div className={cn(
            "p-2 rounded-lg",
            completed 
              ? isFreelancer 
                ? "bg-green-100 dark:bg-green-900/30" 
                : "bg-success/20"
              : "bg-accent/20"
          )}>
            <Icon className={cn(
              "w-4 h-4 sm:w-5 sm:h-5",
              completed 
                ? isFreelancer 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-success"
                : "text-accent"
            )} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-sm sm:text-base",
            completed 
              ? isFreelancer 
                ? "text-green-700 dark:text-green-300" 
                : "text-success"
              : "text-foreground"
          )}>
            {label}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {description}
            </p>
          )}
        </div>

        {!completed && actionLabel && (actionLink || onAction) && (
          actionLink ? (
            <Link to={actionLink}>
              <Button size="sm" variant="outline" className="hidden sm:flex">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="outline" onClick={onAction} className="hidden sm:flex">
              {actionLabel}
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
};
