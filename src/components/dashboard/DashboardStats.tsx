import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Package, Clock, CheckCircle, Euro } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsData {
  totalOrders: number;
  activeOrders: number;
  completedThisMonth: number;
  totalSpent: number;
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

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  gradient: string;
}

const StatCard = ({ title, value, icon: Icon, prefix = '', gradient }: StatCardProps) => {
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

export default function DashboardStats() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at')
        .eq('user_id', user.id)
        .neq('status', 'draft');

      if (error) throw error;

      const totalOrders = data?.length || 0;
      const activeOrders = data?.filter(o => 
        o.status === 'submitted' || o.status === 'in_progress'
      ).length || 0;
      
      const completedThisMonth = data?.filter(o => 
        o.status === 'completed' && 
        new Date(o.created_at) >= startOfThisMonth
      ).length || 0;
      
      const totalSpent = data?.reduce((sum, order) => 
        sum + Number(order.total_amount), 0
      ) || 0;

      return {
        totalOrders,
        activeOrders,
        completedThisMonth,
        totalSpent
      };
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

  const stats = [
    {
      title: "Gesamt Bestellungen",
      value: data?.totalOrders || 0,
      icon: Package,
      gradient: "bg-gradient-to-br from-chart-1 to-chart-2"
    },
    {
      title: "Aktive Bestellungen",
      value: data?.activeOrders || 0,
      icon: Clock,
      gradient: "bg-gradient-to-br from-chart-3 to-chart-4"
    },
    {
      title: "Abgeschlossen (Monat)",
      value: data?.completedThisMonth || 0,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-success to-chart-5"
    },
    {
      title: "Gesamt Ausgaben",
      value: data?.totalSpent || 0,
      icon: Euro,
      prefix: "€",
      gradient: "bg-gradient-to-br from-accent to-accent-glow"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          prefix={stat.prefix}
          gradient={stat.gradient}
        />
      ))}
    </div>
  );
}
