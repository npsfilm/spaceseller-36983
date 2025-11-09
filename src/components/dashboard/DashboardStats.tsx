import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Package, Clock, CheckCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsData {
  total_orders: number;
  active_orders: number;
  completed_this_month: number;
  total_spent: number;
  prev_month_completed: number;
}

const AnimatedNumber = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
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

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  gradient,
  prefix = ""
}: { 
  title: string; 
  value: number; 
  icon: any; 
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  gradient: string;
  prefix?: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="p-6 border-border/50 bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">
            <AnimatedNumber value={value} prefix={prefix} />
          </p>
          {trend && trendValue !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {trend === 'up' ? (
                <>
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-success">+{trendValue}%</span>
                </>
              ) : trend === 'down' ? (
                <>
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">-{trendValue}%</span>
                </>
              ) : (
                <span className="text-muted-foreground">Keine Änderung</span>
              )}
              <span className="text-muted-foreground ml-1">vs. letzter Monat</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function DashboardStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('user_id', user.id)
        .neq('status', 'draft');

      if (error) throw error;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const stats: StatsData = {
        total_orders: orders?.length || 0,
        active_orders: orders?.filter(o => ['submitted', 'in_progress'].includes(o.status)).length || 0,
        completed_this_month: orders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return o.status === 'completed' && 
                 orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear;
        }).length || 0,
        total_spent: orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
        prev_month_completed: orders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return o.status === 'completed' && 
                 orderDate.getMonth() === lastMonth && 
                 orderDate.getFullYear() === lastMonthYear;
        }).length || 0
      };

      return stats;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6 h-32 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  const trend = stats ? (
    stats.completed_this_month > stats.prev_month_completed ? 'up' :
    stats.completed_this_month < stats.prev_month_completed ? 'down' : 'neutral'
  ) : 'neutral';

  const trendValue = stats && stats.prev_month_completed > 0
    ? Math.round(((stats.completed_this_month - stats.prev_month_completed) / stats.prev_month_completed) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Gesamt Bestellungen"
        value={stats?.total_orders || 0}
        icon={Package}
        gradient="bg-gradient-to-br from-chart-1 to-chart-2"
      />
      <StatCard
        title="Aktive Bestellungen"
        value={stats?.active_orders || 0}
        icon={Clock}
        gradient="bg-gradient-to-br from-chart-3 to-chart-4"
      />
      <StatCard
        title="Abgeschlossen (Monat)"
        value={stats?.completed_this_month || 0}
        icon={CheckCircle}
        trend={trend}
        trendValue={Math.abs(trendValue)}
        gradient="bg-gradient-to-br from-success to-chart-5"
      />
      <StatCard
        title="Gesamt Ausgegeben"
        value={stats?.total_spent || 0}
        icon={DollarSign}
        gradient="bg-gradient-to-br from-accent to-accent-glow"
        prefix="€"
      />
    </div>
  );
}
