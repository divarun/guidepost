import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { validateRequest, essaySchema, updateEssaySchema } from '@/lib/utils/validators';
import { calculateWordCount } from '@/lib/utils/formatters';
import { cache, cacheKeys } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const essays = await prisma.essay.findMany({
      where: { userId: user.id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: essays,
    });
  } catch (error) {
    console.error('Get essays error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch essays' },
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
    const validation = validateRequest(essaySchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const essay = await prisma.essay.create({
      data: {
        userId: user.id,
        ...validation.data,
        dueDate: validation.data.dueDate ? new Date(validation.data.dueDate) : null,
      },
      include: {
        versions: true,
        feedback: true,
      },
    });

    // Create initial version
    await prisma.essayVersion.create({
      data: {
        essayId: essay.id,
        content: '',
        wordCount: 0,
        version: 1,
      },
    });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, data: essay }, { status: 201 });
  } catch (error) {
    console.error('Create essay error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create essay' },
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
        { success: false, error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    const validation = validateRequest(updateEssaySchema, data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingEssay = await prisma.essay.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    });

    if (!existingEssay || existingEssay.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Essay not found' }, { status: 404 });
    }

    const updateData: any = { ...validation.data };

    // If content is being updated, create a new version
    if (validation.data.content !== undefined) {
      const wordCount = calculateWordCount(validation.data.content);
      updateData.wordCount = wordCount;

      const latestVersion = existingEssay.versions[0];
      const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

      await prisma.essayVersion.create({
        data: {
          essayId: id,
          content: validation.data.content,
          wordCount,
          version: nextVersion,
        },
      });
    }

    if (validation.data.dueDate) {
      updateData.dueDate = new Date(validation.data.dueDate);
    }

    const essay = await prisma.essay.update({
      where: { id },
      data: updateData,
      include: {
        versions: { orderBy: { createdAt: 'desc' }, take: 5 },
        feedback: { orderBy: { createdAt: 'desc' } },
      },
    });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, data: essay });
  } catch (error) {
    console.error('Update essay error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update essay' },
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
        { success: false, error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingEssay = await prisma.essay.findUnique({
      where: { id },
    });

    if (!existingEssay || existingEssay.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Essay not found' }, { status: 404 });
    }

    await prisma.essay.delete({
      where: { id },
    });

    cache.del(cacheKeys.studentProgress(user.id));
    return NextResponse.json({ success: true, message: 'Essay deleted successfully' });
  } catch (error) {
    console.error('Delete essay error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete essay' },
      { status: 500 }
    );
  }
}