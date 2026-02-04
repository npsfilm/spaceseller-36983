import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { ChecklistItem, ChecklistItemData } from './ChecklistItem';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface OnboardingCardProps {
  title: string;
  description: string;
  items: ChecklistItemData[];
  variant?: 'client' | 'freelancer';
  ctaLabel?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  icon?: LucideIcon;
  showProgress?: boolean;
  className?: string;
}

export const OnboardingCard = ({
  title,
  description,
  items,
  variant = 'client',
  ctaLabel,
  ctaLink,
  onCtaClick,
  icon: HeaderIcon,
  showProgress = true,
  className
}: OnboardingCardProps) => {
  const completedCount = items.filter(item => item.completed).length;
  const completionPercentage = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {HeaderIcon && (
            <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
              <HeaderIcon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <ProgressBar 
            current={completedCount} 
            total={items.length} 
          />
        )}

        {/* Checklist Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <ChecklistItem
              key={item.id}
              {...item}
              index={index}
              variant={variant}
            />
          ))}
        </div>

        {/* CTA Button */}
        {ctaLabel && (ctaLink || onCtaClick) && (
          ctaLink ? (
            <Link to={ctaLink} className="block">
              <Button className="w-full" size="lg">
                {ctaLabel}
              </Button>
            </Link>
          ) : (
            <Button className="w-full" size="lg" onClick={onCtaClick}>
              {ctaLabel}
            </Button>
          )
        )}
      </div>
    </Card>
  );
};
