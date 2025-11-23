import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
}

const AnimatedNumber = ({ value, prefix = "" }: AnimatedNumberProps) => {
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

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString('de-DE', {
        minimumFractionDigits: prefix === '€' ? 2 : 0,
        maximumFractionDigits: prefix === '€' ? 2 : 0
      })}
    </span>
  );
};

export interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  gradient: string;
}

export const StatCard = ({ title, value, icon: Icon, prefix = '', gradient }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${gradient}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">
              <AnimatedNumber value={value} prefix={prefix} />
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
