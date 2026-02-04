import { Clock, CheckCircle, Calendar, XCircle } from 'lucide-react';
import { StatsGrid } from '@/components/shared';
import type { StatCardProps } from '@/components/shared';
import { AssignmentStats } from '@/lib/services/AssignmentDataService';

export interface AssignmentStatsCardsProps {
  stats: AssignmentStats;
}

export const AssignmentStatsCards = ({ stats }: AssignmentStatsCardsProps) => {
  const statItems: StatCardProps[] = [
    {
      title: "Ausstehend",
      value: stats.pending,
      icon: Clock,
      subtitle: "Warten auf Ihre Antwort"
    },
    {
      title: "Angenommen",
      value: stats.accepted,
      icon: CheckCircle,
      subtitle: "Aktive Aufträge"
    },
    {
      title: "Abgeschlossen",
      value: stats.completed,
      icon: Calendar,
      subtitle: "Diesen Monat"
    },
    {
      title: "Abgelehnt",
      value: stats.declined,
      icon: XCircle,
      subtitle: "Gesamt"
    }
  ];

  return (
    <StatsGrid 
      stats={statItems} 
      variant="static"
      columns={{ default: 2, md: 4 }}
      gap={4}
      className="mb-8"
    />
  );
};
