import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { isOverdue, isUpcoming } from '@/lib/utils/dates';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.studentId) {
      return NextResponse.json(
        { success: false, error: 'No student linked to this parent account' },
        { status: 404 }
      );
    }

    const key = cacheKeys.parentProgress(user.id);
    const cached = cache.get(key);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        headers: { 'Cache-Control': 'private, max-age=30' },
      });
    }

    const [student, tasks, essays] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          graduationYear: true,
          gpa: true,
        },
      }),
      prisma.task.findMany({ where: { userId: user.studentId } }),
      prisma.essay.findMany({
        where: { userId: user.studentId },
        select: {
          id: true,
          title: true,
          status: true,
          schoolName: true,
          dueDate: true,
          wordCount: true,
        },
      }),
    ]);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

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
        student: {
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          graduationYear: student.graduationYear,
          gpa: student.gpa,
        },
        progress: {
          totalTasks: tasks.length,
          completedTasks,
          inProgressTasks,
          overdueTasks,
          upcomingDeadlines,
          essayProgress,
          essays,
        },
      },
    };

    cache.set(key, JSON.stringify(body), cacheTTL.progress);

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'private, max-age=30' },
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student progress' },
      { status: 500 }
    );
  }
}
