import { NextResponse } from 'next/server';
import { clearAuthToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await clearAuthToken();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}