import { Package, Clock, CheckCircle } from 'lucide-react';
import { StatsGrid } from '@/components/shared';
import type { DashboardStats } from '@/lib/services/AdminOrderService';

interface AdminStatsCardsProps {
  stats: DashboardStats;
}

export const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  const statItems = [
    {
      title: "Gesamt Bestellungen",
      value: stats.totalOrders,
      icon: Package
    },
    {
      title: "Ausstehend",
      value: stats.pendingOrders,
      icon: Clock
    },
    {
      title: "In Bearbeitung",
      value: stats.inProgressOrders,
      icon: Clock,
      iconColor: "text-yellow-500"
    },
    {
      title: "Heute abgeschlossen",
      value: stats.completedToday,
      icon: CheckCircle,
      iconColor: "text-green-500"
    }
  ];

  return (
    <StatsGrid 
      stats={statItems} 
      variant="static"
      columns={{ default: 1, md: 2, lg: 4 }}
      className="mb-8"
    />
  );
};
