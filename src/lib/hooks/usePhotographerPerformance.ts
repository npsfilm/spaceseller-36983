import { useMemo } from 'react';
import type { Assignment } from '@/lib/services/AssignmentDataService';

export interface PerformanceMetrics {
  acceptanceRate: number;
  avgResponseTimeHours: number;
  completionRate: number;
  reliabilityScore: number;
}

export const usePhotographerPerformance = (assignments: Assignment[]): PerformanceMetrics => {
  return useMemo(() => {
    const responded = assignments.filter(a => a.status !== 'pending');
    const accepted = assignments.filter(a => a.status === 'accepted' || a.status === 'completed');
    const declined = assignments.filter(a => a.status === 'declined');
    const completed = assignments.filter(a => a.status === 'completed');

    // Acceptance Rate
    const totalResponses = accepted.length + declined.length;
    const acceptanceRate = totalResponses > 0 
      ? (accepted.length / totalResponses) * 100 
      : 0;

    // Average Response Time (in hours)
    const responseTimes = responded
      .filter(a => a.assigned_at && a.responded_at)
      .map(a => {
        const assigned = new Date(a.assigned_at!).getTime();
        const responded = new Date(a.responded_at!).getTime();
        return (responded - assigned) / (1000 * 60 * 60); // Convert to hours
      });

    const avgResponseTimeHours = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Completion Rate
    const completionRate = accepted.length > 0
      ? (completed.length / accepted.length) * 100
      : 0;

    // Reliability Score (composite metric)
    // Factors: acceptance rate (40%), fast response (30%), completion rate (30%)
    const responseScore = avgResponseTimeHours <= 2 ? 100 : 
                         avgResponseTimeHours <= 4 ? 80 :
                         avgResponseTimeHours <= 6 ? 60 : 40;
    
    const reliabilityScore = (
      acceptanceRate * 0.4 +
      responseScore * 0.3 +
      completionRate * 0.3
    );

    return {
      acceptanceRate: Math.round(acceptanceRate),
      avgResponseTimeHours: Math.round(avgResponseTimeHours * 10) / 10,
      completionRate: Math.round(completionRate),
      reliabilityScore: Math.round(reliabilityScore)
    };
  }, [assignments]);
};
