import { z } from 'zod';
import { UserRole, TaskCategory, TaskStatus, EssayStatus } from '@prisma/client';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole),
  graduationYear: z.number().int().min(2024).max(2035).optional(),
  gpa: z.number().min(0).max(4.0).optional(),
  studentEmail: emailSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  category: z.nativeEnum(TaskCategory),
  priority: z.number().int().min(0).max(10).default(0),
  dueDate: z.string().optional().refine((v) => !v || !isNaN(Date.parse(v)), { message: 'Invalid date' }),
});

export const updateTaskSchema = taskSchema.partial().extend({
  status: z.nativeEnum(TaskStatus).optional(),
});

export const essaySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  prompt: z.string().min(1, 'Prompt is required'),
  schoolName: z.string().max(200).optional(),
  dueDate: z.string().optional().refine((v) => !v || !isNaN(Date.parse(v)), { message: 'Invalid date' }),
});

export const updateEssaySchema = essaySchema.partial().extend({
  content: z.string().max(10000).optional(),
  status: z.nativeEnum(EssayStatus).optional(),
});

export const budgetSchema = z.object({
  schoolName: z.string().min(1, 'School name is required').max(200),
  tuitionCost: z.number().min(0).max(500000),
  roomAndBoard: z.number().min(0).max(100000),
  booksAndSupplies: z.number().min(0).max(10000),
  otherExpenses: z.number().min(0).max(50000),
  expectedAid: z.number().min(0).max(500000),
  scholarships: z.number().min(0).max(500000),
  notes: z.string().max(2000).optional(),
});

export const updateBudgetSchema = budgetSchema.partial();

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}