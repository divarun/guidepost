import { Task, Essay, EssayVersion, EssayFeedback, TaskStatus, TaskCategory, EssayStatus } from '@prisma/client';

export interface TaskWithDetails extends Task {
  overdue?: boolean;
}

export interface EssayWithDetails extends Essay {
  versions: EssayVersion[];
  feedback: EssayFeedback[];
  latestVersion?: EssayVersion;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category: TaskCategory;
  priority?: number;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  priority?: number;
  dueDate?: string;
}

export interface CreateEssayRequest {
  title: string;
  prompt: string;
  schoolName?: string;
  dueDate?: string;
}

export interface UpdateEssayRequest {
  title?: string;
  prompt?: string;
  content?: string;
  status?: EssayStatus;
  schoolName?: string;
  dueDate?: string;
}

export interface StudentProgress {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  upcomingDeadlines: TaskWithDetails[];
  essayProgress: {
    total: number;
    draft: number;
    inReview: number;
    final: number;
  };
}