import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { JWTPayload, AuthUser } from '@/lib/types/auth';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}` });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // In a real app, you'd fetch the user from the database here
  // For now, we'll return the payload as is
  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    firstName: '',
    lastName: '',
  };
}

export function requireAuth(roles?: UserRole[]) {
  return async (): Promise<AuthUser> => {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    if (roles && !roles.includes(user.role)) {
      throw new Error('Forbidden');
    }

    return user;
  };
}

export async function checkPermission(userId: string, resourceOwnerId: string, allowedRoles: UserRole[] = []): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) return false;

  // Users can access their own resources
  if (user.id === userId || user.id === resourceOwnerId) return true;

  // Check role-based access
  if (allowedRoles.includes(user.role)) return true;

  return false;
}