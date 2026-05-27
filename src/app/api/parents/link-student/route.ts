import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { cache, cacheKeys } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'PARENT') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const studentEmail = typeof body.studentEmail === 'string' ? body.studentEmail.trim().toLowerCase() : '';

    if (!studentEmail) {
      return NextResponse.json({ success: false, error: 'Student email is required' }, { status: 400 });
    }

    const parent = await prisma.user.findUnique({
      where: { id: user.id },
      select: { studentId: true },
    });

    if (parent?.studentId) {
      return NextResponse.json({ success: false, error: 'Already linked to a student. Contact support to change this.' }, { status: 409 });
    }

    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
      select: { id: true, role: true, firstName: true, lastName: true },
    });

    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json({ success: false, error: 'No student account found with that email' }, { status: 404 });
    }

    const alreadyClaimed = await prisma.user.findFirst({
      where: { studentId: student.id },
      select: { id: true },
    });

    if (alreadyClaimed) {
      return NextResponse.json({ success: false, error: 'That student account is already linked to another parent.' }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { studentId: student.id },
    });

    cache.del(cacheKeys.user(user.id));

    return NextResponse.json({
      success: true,
      student: { name: `${student.firstName} ${student.lastName}` },
    });
  } catch (error) {
    console.error('Link student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to link student' }, { status: 500 });
  }
}
