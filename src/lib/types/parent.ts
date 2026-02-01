import { Budget, Task } from '@prisma/client';

export interface BudgetWithCalculations extends Budget {
  totalCost: number;
  netCost: number;
}

export interface CreateBudgetRequest {
  schoolName: string;
  tuitionCost: number;
  roomAndBoard: number;
  booksAndSupplies: number;
  otherExpenses: number;
  expectedAid: number;
  scholarships: number;
  notes?: string;
}

export interface UpdateBudgetRequest {
  schoolName?: string;
  tuitionCost?: number;
  roomAndBoard?: number;
  booksAndSupplies?: number;
  otherExpenses?: number;
  expectedAid?: number;
  scholarships?: number;
  notes?: string;
}

export interface ParentDashboard {
  studentInfo: {
    name: string;
    email: string;
    graduationYear?: number;
    gpa?: number;
  };
  financialAidTasks: Task[];
  budgets: BudgetWithCalculations[];
  upcomingDeadlines: Task[];
  totalEstimatedCost: number;
  totalExpectedAid: number;
}