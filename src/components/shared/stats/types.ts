import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  
  // Optional features
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  gradient?: string;
  
  // Display variants
  variant?: 'animated' | 'static' | 'compact';
  
  // Status indicators
  trend?: { value: number; direction: 'up' | 'down' };
  iconColor?: string;
}

export interface StatsGridProps {
  stats: StatCardProps[];
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  variant?: 'animated' | 'static';
  gap?: number;
  className?: string;
}
