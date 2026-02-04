import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { assignmentDataService, Assignment, AssignmentStats } from '@/lib/services/AssignmentDataService';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QUERY_KEYS, STALE_TIMES, GC_TIMES } from '@/lib/queryConfig';

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
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photographerAssignments(user.id) });
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
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photographerAssignments(user.id) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return useQuery<Assignment[]>({
    queryKey: QUERY_KEYS.photographerAssignments(user?.id ?? ''),
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
    staleTime: STALE_TIMES.assignments,
    gcTime: GC_TIMES.default,
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
    // Optimistic update for immediate UI feedback
    onMutate: async ({ assignmentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
      });

      // Snapshot the previous value
      const previousAssignments = queryClient.getQueryData<Assignment[]>(
        QUERY_KEYS.photographerAssignments(user!.id)
      );

      // Optimistically update to the new value
      queryClient.setQueryData<Assignment[]>(
        QUERY_KEYS.photographerAssignments(user!.id),
        (old) => old?.map(a => 
          a.id === assignmentId 
            ? { ...a, status: 'accepted', responded_at: new Date().toISOString() }
            : a
        )
      );

      // Return context with the previous value
      return { previousAssignments };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousAssignments) {
        queryClient.setQueryData(
          QUERY_KEYS.photographerAssignments(user!.id),
          context.previousAssignments
        );
      }
      console.error('Error accepting assignment:', error);
      toast.error('Fehler beim Annehmen des Auftrags');
    },
    onSuccess: () => {
      toast.success('Auftrag angenommen');
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
      });
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
    // Optimistic update for immediate UI feedback
    onMutate: async ({ assignmentId, reason }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
      });

      // Snapshot the previous value
      const previousAssignments = queryClient.getQueryData<Assignment[]>(
        QUERY_KEYS.photographerAssignments(user!.id)
      );

      // Optimistically update to the new value
      queryClient.setQueryData<Assignment[]>(
        QUERY_KEYS.photographerAssignments(user!.id),
        (old) => old?.map(a => 
          a.id === assignmentId 
            ? { ...a, status: 'declined', photographer_notes: reason, responded_at: new Date().toISOString() }
            : a
        )
      );

      // Return context with the previous value
      return { previousAssignments };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousAssignments) {
        queryClient.setQueryData(
          QUERY_KEYS.photographerAssignments(user!.id),
          context.previousAssignments
        );
      }
      console.error('Error declining assignment:', error);
      toast.error('Fehler beim Ablehnen des Auftrags');
    },
    onSuccess: () => {
      toast.success('Auftrag abgelehnt');
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
      });
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
