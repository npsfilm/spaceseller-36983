import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { assignmentDataService, Assignment, AssignmentStats } from '@/lib/services/AssignmentDataService';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const usePhotographerAssignments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription for new assignments
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('photographer-assignments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_assignments',
          filter: `photographer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New assignment received:', payload);
          queryClient.invalidateQueries({ queryKey: ['photographer-assignments', user.id] });
          toast.info('Neuer Auftrag verfügbar!', {
            description: 'Sie haben einen neuen Shooting-Auftrag erhalten.'
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_assignments',
          filter: `photographer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Assignment updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['photographer-assignments', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return useQuery<Assignment[]>({
    queryKey: ['photographer-assignments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error('[useAssignments] User not authenticated');
        return [];
      }
      console.log('[useAssignments] Fetching assignments for user:', user.id);
      const result = await assignmentDataService.fetchPhotographerAssignments(user.id);
      console.log('[useAssignments] Query returned:', result.length, 'assignments');
      return result;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

export const useAssignmentStats = (assignments: Assignment[] = []) => {
  return useMemo((): AssignmentStats => {
    return assignmentDataService.calculateStats(assignments);
  }, [assignments]);
};

export const useAssignmentGroups = (assignments: Assignment[] = []) => {
  return useMemo(() => {
    return assignmentDataService.groupByStatus(assignments);
  }, [assignments]);
};

export const useAssignmentActions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const acceptMutation = useMutation({
    mutationFn: async ({ assignmentId, assignment }: { assignmentId: string; assignment: Assignment }) => {
      await assignmentDataService.acceptAssignment(assignmentId);
      
      // Create notification for admins
      await assignmentDataService.createAdminNotification(
        'assignment_accepted',
        'Fotograf hat zugestimmt',
        `Auftrag #${assignment.orders.order_number} wurde von einem Fotografen angenommen.`,
        '/admin-backend'
      );
    },
    onSuccess: () => {
      toast.success('Auftrag angenommen');
      queryClient.invalidateQueries({ queryKey: ['photographer-assignments', user?.id] });
    },
    onError: (error: Error) => {
      console.error('Error accepting assignment:', error);
      toast.error('Fehler beim Annehmen des Auftrags');
    }
  });

  const declineMutation = useMutation({
    mutationFn: async ({ assignmentId, reason, assignment }: { assignmentId: string; reason: string; assignment: Assignment }) => {
      await assignmentDataService.declineAssignment(assignmentId, reason);
      
      // Create notification for admins with decline reason
      await assignmentDataService.createAdminNotification(
        'assignment_declined',
        'Fotograf hat abgelehnt',
        `Auftrag #${assignment.orders.order_number} wurde abgelehnt. Grund: ${reason}`,
        '/admin-backend'
      );
    },
    onSuccess: () => {
      toast.success('Auftrag abgelehnt');
      queryClient.invalidateQueries({ queryKey: ['photographer-assignments', user?.id] });
    },
    onError: (error: Error) => {
      console.error('Error declining assignment:', error);
      toast.error('Fehler beim Ablehnen des Auftrags');
    }
  });

  return {
    acceptAssignment: (assignmentId: string, assignment: Assignment) => 
      acceptMutation.mutate({ assignmentId, assignment }),
    declineAssignment: (assignmentId: string, reason: string, assignment: Assignment) => 
      declineMutation.mutate({ assignmentId, reason, assignment }),
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending
  };
};
