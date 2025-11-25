import { differenceInHours, differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Calculates the response deadline for an assignment based on scheduling urgency
 * Matches the database function calculate_assignment_deadline logic
 */
export function calculateAssignmentDeadline(
  assignedAt: string,
  scheduledDate: string | null
): Date {
  const assignedTime = new Date(assignedAt);
  
  // If no scheduled date, default to 12 hours
  if (!scheduledDate) {
    return new Date(assignedTime.getTime() + 12 * 60 * 60 * 1000);
  }
  
  // Calculate time between assignment and scheduled date
  const scheduledTime = new Date(scheduledDate);
  const hoursUntilShoot = differenceInHours(scheduledTime, assignedTime);
  
  // Determine response window based on how soon the shoot is
  let hoursToAdd: number;
  if (hoursUntilShoot <= 24) {
    hoursToAdd = 4;
  } else if (hoursUntilShoot <= 48) {
    hoursToAdd = 6;
  } else {
    hoursToAdd = 12;
  }
  
  return new Date(assignedTime.getTime() + hoursToAdd * 60 * 60 * 1000);
}

/**
 * Gets the time remaining until deadline in minutes
 */
export function getTimeRemainingMinutes(deadline: Date): number {
  return differenceInMinutes(deadline, new Date());
}

/**
 * Checks if an assignment deadline is urgent (< 2 hours remaining)
 */
export function isUrgentDeadline(deadline: Date): boolean {
  const minutesRemaining = getTimeRemainingMinutes(deadline);
  return minutesRemaining < 120 && minutesRemaining > 0;
}

/**
 * Checks if an assignment deadline has passed
 */
export function isDeadlinePassed(deadline: Date): boolean {
  return getTimeRemainingMinutes(deadline) <= 0;
}

/**
 * Formats the time remaining in a human-readable way
 */
export function formatTimeRemaining(deadline: Date): string {
  const minutesRemaining = getTimeRemainingMinutes(deadline);
  
  if (minutesRemaining <= 0) {
    return 'Abgelaufen';
  }
  
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;
  
  if (hours === 0) {
    return `${minutes}min`;
  }
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}min`;
}

/**
 * Gets a color class based on urgency
 */
export function getDeadlineColorClass(deadline: Date): string {
  const minutesRemaining = getTimeRemainingMinutes(deadline);
  
  if (minutesRemaining <= 0) {
    return 'text-destructive';
  }
  
  if (minutesRemaining < 60) {
    return 'text-destructive';
  }
  
  if (minutesRemaining < 120) {
    return 'text-orange-600 dark:text-orange-500';
  }
  
  return 'text-muted-foreground';
}
