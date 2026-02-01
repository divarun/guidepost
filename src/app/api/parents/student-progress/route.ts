import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { isOverdue, isUpcoming } from '@/lib/utils/dates';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify parent has a linked student
    if (!user.studentId) {
      return NextResponse.json(
        { success: false, error: 'No student linked to this parent account' },
        { status: 404 }
      );
    }

    // Get student information
    const student = await prisma.user.findUnique({
      where: { id: user.studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        graduationYear: true,
        gpa: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get student's tasks
    const tasks = await prisma.task.findMany({
      where: { userId: student.id },
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
      where: { userId: student.id },
      select: {
        id: true,
        title: true,
        status: true,
        schoolName: true,
        dueDate: true,
        wordCount: true,
      },
    });

    const essayProgress = {
      total: essays.length,
      draft: essays.filter((e) => e.status === 'DRAFT').length,
      inReview: essays.filter((e) => e.status === 'IN_REVIEW').length,
      revised: essays.filter((e) => e.status === 'REVISED').length,
      final: essays.filter((e) => e.status === 'FINAL').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          graduationYear: student.graduationYear,
          gpa: student.gpa,
        },
        progress: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          overdueTasks,
          upcomingDeadlines,
          essayProgress,
          essays,
        },
      },
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student progress' },
      { status: 500 }
    );
  }
}