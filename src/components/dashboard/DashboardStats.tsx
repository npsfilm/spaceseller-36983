import { Card } from "@/components/ui/card";
import { Package, Clock, CheckCircle, Euro } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/useDashboardData";
import { StatCard } from "./StatCard";

export default function DashboardStats() {
  const { data, isLoading } = useDashboardStats();

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
