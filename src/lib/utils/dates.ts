import { addDays, addWeeks, addMonths, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';

export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return isBefore(endOfDay(due), new Date());
}

export function isUpcoming(dueDate: Date | string, daysAhead: number = 7): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const future = addDays(now, daysAhead);
  return isAfter(due, now) && isBefore(due, future);
}

export function getDaysUntil(targetDate: Date | string): number {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = startOfDay(new Date());
  const targetDay = startOfDay(target);
  const diffMs = targetDay.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getAcademicYear(): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;

  return {
    start: new Date(year, 7, 1), // August 1
    end: new Date(year + 1, 5, 30), // June 30
  };
}

export function getApplicationSeasonMilestones(graduationYear: number) {
  const seniorYear = graduationYear - 1;

  return [
    {
      name: 'Early Decision/Early Action Deadline',
      date: new Date(seniorYear, 10, 1), // November 1
      description: 'Typical deadline for early applications',
    },
    {
      name: 'Regular Decision Deadline',
      date: new Date(graduationYear, 0, 1), // January 1
      description: 'Common deadline for regular applications',
    },
    {
      name: 'FAFSA Opens',
      date: new Date(seniorYear, 9, 1), // October 1
      description: 'Financial aid application becomes available',
    },
    {
      name: 'Decision Notification',
      date: new Date(graduationYear, 2, 15), // March 15
      description: 'Typical timeframe for hearing back from colleges',
    },
    {
      name: 'National Decision Day',
      date: new Date(graduationYear, 4, 1), // May 1
      description: 'Deadline to commit to a college',
    },
  ];
}

export function sortByDueDate<T extends { dueDate: Date | string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    const dateA = typeof a.dueDate === 'string' ? new Date(a.dueDate) : a.dueDate;
    const dateB = typeof b.dueDate === 'string' ? new Date(b.dueDate) : b.dueDate;
    return dateA.getTime() - dateB.getTime();
  });
}