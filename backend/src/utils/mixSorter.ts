import { ITask, TaskPriority } from '../models/Task';

/**
 * Calculates a dynamic score for a task based on Priority, Deadline Urgency, and Scheduled Time.
 * Higher score = higher priority in the list.
 */
export const calculateTaskMixScore = (task: ITask): number => {
  if (task.isCompleted) {
    return -10000; // Push completed tasks to the end
  }

  const now = new Date().getTime();

  // 1. Priority Base Weight
  const priorityWeights: Record<TaskPriority, number> = {
    urgent: 1000,
    high: 600,
    medium: 300,
    low: 100,
  };

  const priorityScore = priorityWeights[task.priority] || 300;

  // 2. Deadline Urgency Score
  let deadlineScore = 0;
  if (task.deadline) {
    const deadlineTime = new Date(task.deadline).getTime();
    const hoursRemaining = (deadlineTime - now) / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      // Overdue! Critical urgency!
      const hoursOverdue = Math.abs(hoursRemaining);
      deadlineScore = 2000 + Math.min(hoursOverdue * 50, 1000);
    } else if (hoursRemaining <= 3) {
      // Due within 3 hours
      deadlineScore = 1500;
    } else if (hoursRemaining <= 12) {
      // Due within 12 hours
      deadlineScore = 1000;
    } else if (hoursRemaining <= 24) {
      // Due within 1 day
      deadlineScore = 600;
    } else if (hoursRemaining <= 72) {
      // Due within 3 days
      deadlineScore = 300;
    } else {
      // Future deadline
      deadlineScore = Math.max(100 - (hoursRemaining / 24) * 10, 0);
    }
  }

  // 3. Scheduled Date-Time Factor
  let timeScore = 0;
  if (task.dateTime) {
    const scheduledTime = new Date(task.dateTime).getTime();
    const diffHours = (now - scheduledTime) / (1000 * 60 * 60);

    if (diffHours >= 0) {
      // Scheduled time has arrived or passed (ready to work on)
      timeScore = 200 + Math.min(diffHours * 10, 300);
    } else {
      // Scheduled for the future
      timeScore = Math.max(0, 100 - Math.abs(diffHours) * 5);
    }
  }

  return priorityScore + deadlineScore + timeScore;
};

/**
 * Sorts array of tasks using the Smart Mix Sorting Algorithm.
 */
export const sortTasksByMixAlgorithm = <T extends ITask>(tasks: T[]): T[] => {
  return [...tasks].sort((a, b) => {
    const scoreA = calculateTaskMixScore(a);
    const scoreB = calculateTaskMixScore(b);
    return scoreB - scoreA; // Descending score order
  });
};
