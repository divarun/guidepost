import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, setAuthToken } from '@/lib/auth';
import { validateRequest, registerSchema } from '@/lib/utils/validators';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request);
    const rateLimit = await rateLimiter.checkLimit(identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = validateRequest(registerSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role, graduationYear, gpa, studentEmail } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Handle parent registration - link to student
    let studentId: string | undefined;
    if (role === 'PARENT' && studentEmail) {
      const student = await prisma.user.findUnique({
        where: { email: studentEmail.toLowerCase() },
      });

      if (!student || student.role !== 'STUDENT') {
        return NextResponse.json(
          { success: false, error: 'Student account not found with provided email' },
          { status: 404 }
        );
      }

      // Check if student already has a parent
      const existingParent = await prisma.user.findFirst({
        where: { studentId: student.id },
      });

      if (existingParent) {
        return NextResponse.json(
          { success: false, error: 'This student already has a parent account linked' },
          { status: 409 }
        );
      }

      studentId = student.id;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role,
        firstName,
        lastName,
        graduationYear: role === 'STUDENT' ? graduationYear : null,
        gpa: role === 'STUDENT' ? gpa : null,
        studentId: role === 'PARENT' ? studentId : null,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    await setAuthToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        graduationYear: user.graduationYear,
        gpa: user.gpa,
        studentId: user.studentId,
      },
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}