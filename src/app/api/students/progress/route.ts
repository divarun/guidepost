import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { isOverdue, isUpcoming } from '@/lib/utils/dates';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tasks
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.status !== 'COMPLETED' && isOverdue(t.dueDate)
    ).length;

    // Get upcoming deadlines
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && t.status !== 'COMPLETED' && isUpcoming(t.dueDate, 14))
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);

    // Get essay progress
    const essays = await prisma.essay.findMany({
      where: { userId: user.id },
    });

    const essayProgress = {
      total: essays.length,
      draft: essays.filter((e) => e.status === 'DRAFT').length,
      inReview: essays.filter((e) => e.status === 'IN_REVIEW').length,
      final: essays.filter((e) => e.status === 'FINAL').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        upcomingDeadlines,
        essayProgress,
      },
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}