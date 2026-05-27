import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { isOverdue, isUpcoming } from '@/lib/utils/dates';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const key = cacheKeys.studentProgress(user.id);
    const cached = cache.get(key);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        headers: { 'Cache-Control': 'private, max-age=30' },
      });
    }

    const [tasks, essays] = await Promise.all([
      prisma.task.findMany({ where: { userId: user.id } }),
      prisma.essay.findMany({ where: { userId: user.id } }),
    ]);

    const completedTasks   = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks  = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const overdueTasks     = tasks.filter(
      (t) => t.dueDate && t.status !== 'COMPLETED' && isOverdue(t.dueDate)
    ).length;

    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && t.status !== 'COMPLETED' && isUpcoming(t.dueDate, 14))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);

    const essayProgress = {
      total:    essays.length,
      draft:    essays.filter((e) => e.status === 'DRAFT').length,
      inReview: essays.filter((e) => e.status === 'IN_REVIEW').length,
      revised:  essays.filter((e) => e.status === 'REVISED').length,
      final:    essays.filter((e) => e.status === 'FINAL').length,
    };

    const body = {
      success: true,
      data: {
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        upcomingDeadlines,
        essayProgress,
      },
    };

    cache.set(key, JSON.stringify(body), cacheTTL.progress);

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'private, max-age=30' },
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
