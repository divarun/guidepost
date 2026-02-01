'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

interface FinancialTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  dueDate?: Date | string;
  overdue?: boolean;
}

interface FinancialAidTrackerProps {
  tasks: FinancialTask[];
  onToggleComplete?: (taskId: string) => void;
  readOnly?: boolean;
}

export function FinancialAidTracker({
  tasks,
  onToggleComplete,
  readOnly = false
}: FinancialAidTrackerProps) {
  const tasksByCategory = {
    FAFSA: tasks.filter((t) => t.category === 'FAFSA'),
    CSS_PROFILE: tasks.filter((t) => t.category === 'CSS_PROFILE'),
    SCHOLARSHIP: tasks.filter((t) => t.category === 'SCHOLARSHIP'),
    FINANCIAL_AID: tasks.filter((t) => t.category === 'FINANCIAL_AID'),
  };

  const categoryLabels = {
    FAFSA: 'FAFSA',
    CSS_PROFILE: 'CSS Profile',
    SCHOLARSHIP: 'Scholarships',
    FINANCIAL_AID: 'Financial Aid',
  };

  const categoryColors = {
    FAFSA: 'border-blue-200 bg-blue-50',
    CSS_PROFILE: 'border-purple-200 bg-purple-50',
    SCHOLARSHIP: 'border-green-200 bg-green-50',
    FINANCIAL_AID: 'border-yellow-200 bg-yellow-50',
  };

  return (
    <div className="space-y-6">
      {(Object.keys(tasksByCategory) as Array<keyof typeof tasksByCategory>).map((category) => {
        const categoryTasks = tasksByCategory[category];
        if (categoryTasks.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle>
                {categoryLabels[category]} ({categoryTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className={clsx(
                      'p-4 rounded-lg border transition-all',
                      task.overdue && task.status !== 'COMPLETED'
                        ? 'bg-red-50 border-red-200'
                        : task.status === 'COMPLETED'
                        ? 'bg-green-50 border-green-200'
                        : categoryColors[category]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {!readOnly && onToggleComplete && (
                        <input
                          type="checkbox"
                          checked={task.status === 'COMPLETED'}
                          onChange={() => onToggleComplete(task.id)}
                          className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                        />
                      )}
                      {readOnly && (
                        <div className="mt-1">
                          {task.status === 'COMPLETED' ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4
                          className={clsx(
                            'font-medium',
                            task.status === 'COMPLETED'
                              ? 'text-gray-500 line-through'
                              : 'text-gray-900'
                          )}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {task.dueDate && (
                            <span
                              className={clsx(
                                'text-sm',
                                task.overdue && task.status !== 'COMPLETED'
                                  ? 'text-red-600 font-medium'
                                  : 'text-gray-500'
                              )}
                            >
                              Due: {formatShortDate(task.dueDate)}
                            </span>
                          )}
                          <span className="badge badge-info text-xs">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {tasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500">No financial aid tasks yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}