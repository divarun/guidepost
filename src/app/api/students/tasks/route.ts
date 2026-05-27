import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { validateRequest, taskSchema, updateTaskSchema } from '@/lib/utils/validators';
import { isOverdue } from '@/lib/utils/dates';
import { cache, cacheKeys } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as any }),
        ...(category && { category: category as any }),
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });

    const tasksWithOverdue = tasks.map((task) => ({
      ...task,
      overdue: task.dueDate && task.status !== 'COMPLETED' ? isOverdue(task.dueDate) : false,
    }));

    return NextResponse.json({
      success: true,
      data: tasksWithOverdue,
    });
  } catch (error) {
    console.error('Get student tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateRequest(taskSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        ...validation.data,
        dueDate: validation.data.dueDate ? new Date(validation.data.dueDate) : null,
      },
    });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error('Create student task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const validation = validateRequest(updateTaskSchema, data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const updateData: any = { ...validation.data };
    if (validation.data.dueDate) {
      updateData.dueDate = new Date(validation.data.dueDate);
    } else if ('dueDate' in data && !data.dueDate) {
      updateData.dueDate = null;
    }
    if (validation.data.status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const task = await prisma.task.update({ where: { id }, data: updateData });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Update student task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete student task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
