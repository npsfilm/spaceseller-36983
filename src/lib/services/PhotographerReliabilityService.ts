import { supabase } from '@/integrations/supabase/client';

export interface PhotographerReliabilityMetrics {
  photographer_id: string;
  photographer_name: string;
  photographer_email: string;
  total_assignments: number;
  accepted: number;
  manually_declined: number;
  auto_declined: number;
  completed: number;
  acceptance_rate: number;
  timeout_rate: number;
  completion_rate: number;
  reliability_score: number;
}

export class PhotographerReliabilityService {
  /**
   * Fetch reliability metrics for all photographers
   */
  async fetchReliabilityMetrics(): Promise<PhotographerReliabilityMetrics[]> {
    // First, get all photographers
    const { data: photographers, error: photoError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        profiles!inner (
          vorname,
          nachname,
          email
        )
      `)
      .eq('role', 'photographer');

    if (photoError) {
      console.error('[PhotographerReliabilityService] Error fetching photographers:', photoError);
      throw photoError;
    }

    if (!photographers || photographers.length === 0) {
      return [];
    }

    // Fetch assignment data for each photographer
    const metricsPromises = photographers.map(async (photographer) => {
      const { data: assignments, error: assignError } = await supabase
        .from('order_assignments')
        .select('status, photographer_notes')
        .eq('photographer_id', photographer.user_id);

      if (assignError) {
        console.error(`[PhotographerReliabilityService] Error fetching assignments for ${photographer.user_id}:`, assignError);
        return null;
      }

      const total = assignments?.length || 0;
      const accepted = assignments?.filter(a => a.status === 'accepted').length || 0;
      const completed = assignments?.filter(a => a.status === 'completed').length || 0;
      const declined = assignments?.filter(a => a.status === 'declined').length || 0;
      const autoDeclined = assignments?.filter(
        a => a.status === 'declined' && a.photographer_notes === 'Nicht rechtzeitig beantwortet'
      ).length || 0;
      const manuallyDeclined = declined - autoDeclined;

      // Calculate rates
      const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
      const timeoutRate = total > 0 ? (autoDeclined / total) * 100 : 0;
      const completionRate = accepted > 0 ? (completed / accepted) * 100 : 0;

      // Calculate reliability score (weighted: 40% acceptance, 40% completion, 20% inverse timeout)
      const reliabilityScore = total > 0 
        ? (acceptanceRate * 0.4) + (completionRate * 0.4) + ((100 - timeoutRate) * 0.2)
        : 0;

      const profile = photographer.profiles as any;

      return {
        photographer_id: photographer.user_id,
        photographer_name: `${profile.vorname || ''} ${profile.nachname || ''}`.trim() || 'N/A',
        photographer_email: profile.email,
        total_assignments: total,
        accepted,
        manually_declined: manuallyDeclined,
        auto_declined: autoDeclined,
        completed,
        acceptance_rate: acceptanceRate,
        timeout_rate: timeoutRate,
        completion_rate: completionRate,
        reliability_score: reliabilityScore,
      } as PhotographerReliabilityMetrics;
    });

    const metrics = await Promise.all(metricsPromises);
    
    // Filter out null results and sort by reliability score (lowest first to show problematic photographers)
    return metrics
      .filter((m): m is PhotographerReliabilityMetrics => m !== null)
      .sort((a, b) => a.reliability_score - b.reliability_score);
  }

  /**
   * Get color class for reliability score
   */
  getReliabilityColor(score: number): string {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }

  /**
   * Get badge variant for reliability score
   */
  getReliabilityBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  }

  /**
   * Get reliability label
   */
  getReliabilityLabel(score: number): string {
    if (score >= 80) return 'Sehr zuverlässig';
    if (score >= 60) return 'Zuverlässig';
    if (score >= 40) return 'Mäßig zuverlässig';
    return 'Unzuverlässig';
  }
}

export const photographerReliabilityService = new PhotographerReliabilityService();
