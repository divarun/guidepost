import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const key = cacheKeys.user(currentUser.id);
    const cached = cache.get(key);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        headers: { 'Cache-Control': 'private, max-age=60' },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        graduationYear: true,
        gpa: true,
        studentId: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = { success: true, user };
    cache.set(key, JSON.stringify(body), cacheTTL.user);

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'private, max-age=60' },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
