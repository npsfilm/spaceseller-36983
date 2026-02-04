import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "./types";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const isMonetary = prefix === '€' || prefix === '$';

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString('de-DE', {
        minimumFractionDigits: isMonetary ? 2 : 0,
        maximumFractionDigits: isMonetary ? 2 : 0
      })}
      {suffix}
    </span>
  );
};

export const UnifiedStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  prefix = '', 
  suffix = '',
  gradient,
  variant = 'static',
  iconColor
}: StatCardProps) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  if (variant === 'compact') {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            gradient ? `bg-gradient-to-br ${gradient}` : "bg-muted"
          )}>
            <Icon className={cn("w-4 h-4", gradient ? "text-white" : iconColor || "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-lg font-bold text-foreground">
              {prefix}{typeof value === 'number' ? value.toLocaleString('de-DE') : value}{suffix}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'animated') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-lg",
                gradient ? `bg-gradient-to-br ${gradient}` : "bg-muted"
              )}>
                <Icon className={cn("w-6 h-6", gradient ? "text-white" : iconColor || "text-muted-foreground")} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">
                <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} />
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Static variant (default)
  return (
    <Card>
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className={cn("h-4 w-4", iconColor || "text-muted-foreground")} />
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString('de-DE') : value}{suffix}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
