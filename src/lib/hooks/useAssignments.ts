import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { assignmentDataService, Assignment, AssignmentStats } from '@/lib/services/AssignmentDataService';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const usePhotographerAssignments = () => {
  const { user } = useAuth();

  return useQuery<Assignment[]>({
    queryKey: ['photographer-assignments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return assignmentDataService.fetchPhotographerAssignments(user.id);
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
