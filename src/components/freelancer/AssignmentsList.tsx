import { Card, CardContent } from '@/components/ui/card';
import { Assignment } from '@/lib/services/AssignmentDataService';
import { AssignmentCard } from './AssignmentCard';

export interface AssignmentsListProps {
  assignments: Assignment[];
  emptyMessage?: string;
  onAccept?: (assignmentId: string) => void;
  onDecline?: (assignmentId: string) => void;
}

export const AssignmentsList = ({ 
  assignments, 
  emptyMessage = 'Keine Aufträge', 
  onAccept,
  onDecline 
}: AssignmentsListProps) => {
  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment as any}
          onViewDetails={() => {}}
          onAccept={onAccept ? () => onAccept(assignment.id) : undefined}
          onDecline={onDecline ? () => onDecline(assignment.id) : undefined}
        />
      ))}
    </div>
  );
};
