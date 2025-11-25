import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePhotographerPerformance } from '@/lib/hooks/usePhotographerPerformance';
import type { Assignment } from '@/lib/services/AssignmentDataService';

interface PerformanceMetricsProps {
  assignments: Assignment[];
}

export const PerformanceMetrics = ({ assignments }: PerformanceMetricsProps) => {
  const metrics = usePhotographerPerformance(assignments);

  const getColorClass = (value: number, isTime: boolean = false) => {
    if (isTime) {
      // For response time, lower is better
      if (value <= 2) return 'text-green-500';
      if (value <= 4) return 'text-yellow-500';
      return 'text-red-500';
    }
    // For percentages, higher is better
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metricsData = [
    {
      icon: TrendingUp,
      label: 'Annahmequote',
      value: `${metrics.acceptanceRate}%`,
      progress: metrics.acceptanceRate,
      tooltip: 'Prozentsatz der angenommenen Aufträge im Verhältnis zu allen beantworteten Anfragen',
      colorClass: getColorClass(metrics.acceptanceRate)
    },
    {
      icon: Clock,
      label: 'Ø Reaktionszeit',
      value: `${metrics.avgResponseTimeHours}h`,
      progress: Math.min((6 - metrics.avgResponseTimeHours) / 6 * 100, 100),
      tooltip: 'Durchschnittliche Zeit zwischen Auftragszuteilung und Ihrer Antwort',
      colorClass: getColorClass(metrics.avgResponseTimeHours, true)
    },
    {
      icon: CheckCircle,
      label: 'Abschlussquote',
      value: `${metrics.completionRate}%`,
      progress: metrics.completionRate,
      tooltip: 'Prozentsatz der erfolgreich abgeschlossenen Aufträge',
      colorClass: getColorClass(metrics.completionRate)
    },
    {
      icon: Award,
      label: 'Zuverlässigkeit',
      value: `${metrics.reliabilityScore}%`,
      progress: metrics.reliabilityScore,
      tooltip: 'Gesamtbewertung basierend auf Annahmequote, Reaktionszeit und Abschlussquote',
      colorClass: getColorClass(metrics.reliabilityScore)
    }
  ];

  if (assignments.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Leistungsübersicht
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2 cursor-help">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {metric.label}
                            </span>
                          </div>
                          <span className={`text-2xl font-bold ${metric.colorClass}`}>
                            {metric.value}
                          </span>
                        </div>
                        <Progress 
                          value={metric.progress} 
                          className="h-2"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{metric.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
