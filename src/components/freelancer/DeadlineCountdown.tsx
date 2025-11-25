import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  calculateAssignmentDeadline, 
  formatTimeRemaining, 
  getDeadlineColorClass,
  isDeadlinePassed,
  isUrgentDeadline 
} from '@/lib/assignmentDeadline';

interface DeadlineCountdownProps {
  assignedAt: string;
  scheduledDate: string | null;
  status: string;
}

export const DeadlineCountdown = ({ 
  assignedAt, 
  scheduledDate, 
  status 
}: DeadlineCountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [colorClass, setColorClass] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Only show countdown for pending assignments
    if (status !== 'pending') return;

    const updateCountdown = () => {
      const deadline = calculateAssignmentDeadline(assignedAt, scheduledDate);
      setTimeRemaining(formatTimeRemaining(deadline));
      setColorClass(getDeadlineColorClass(deadline));
      setIsUrgent(isUrgentDeadline(deadline));
    };

    // Update immediately
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [assignedAt, scheduledDate, status]);

  // Don't show for non-pending assignments
  if (status !== 'pending') return null;

  const deadline = calculateAssignmentDeadline(assignedAt, scheduledDate);
  const isPassed = isDeadlinePassed(deadline);

  return (
    <div className={`flex items-center gap-2 text-sm ${colorClass}`}>
      <Clock className={`h-4 w-4 ${isUrgent || isPassed ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
        <span className="font-medium">
          {isPassed ? 'Frist abgelaufen' : `Antwortfrist: ${timeRemaining}`}
        </span>
        {isUrgent && !isPassed && (
          <span className="text-xs font-semibold">Dringend!</span>
        )}
      </div>
    </div>
  );
};
