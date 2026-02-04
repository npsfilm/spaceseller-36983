import { Package, Clock, CheckCircle, Euro } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/useDashboardData";
import { StatsGrid } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStats() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Gesamt Bestellungen",
      value: data?.totalOrders || 0,
      icon: Package,
      gradient: "from-chart-1 to-chart-2"
    },
    {
      title: "Aktive Bestellungen",
      value: data?.activeOrders || 0,
      icon: Clock,
      gradient: "from-chart-3 to-chart-4"
    },
    {
      title: "Abgeschlossen (Monat)",
      value: data?.completedThisMonth || 0,
      icon: CheckCircle,
      gradient: "from-success to-chart-5"
    },
    {
      title: "Gesamt Ausgaben",
      value: data?.totalSpent || 0,
      icon: Euro,
      prefix: "€",
      gradient: "from-accent to-accent-glow"
    }
  ];

  return (
    <StatsGrid 
      stats={stats} 
      variant="animated"
      columns={{ default: 1, sm: 2, lg: 4 }}
    />
  );
}
