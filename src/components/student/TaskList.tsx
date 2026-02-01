'use client';

import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  priority: number;
  dueDate?: Date | string;
  overdue?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  readOnly?: boolean;
  showCategory?: boolean;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  readOnly = false,
  showCategory = true,
}: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (b.status === 'COMPLETED' && a.status !== 'COMPLETED') return -1;

    // Then by priority
    if (b.priority !== a.priority) return b.priority - a.priority;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    return 0;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ESSAY: 'bg-purple-100 text-purple-800',
      TESTING: 'bg-blue-100 text-blue-800',
      EXTRACURRICULAR: 'bg-green-100 text-green-800',
      APPLICATION: 'bg-primary-100 text-primary-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIndicator = (priority: number) => {
    if (priority >= 3) return '🔴';
    if (priority >= 2) return '🟡';
    return '🟢';
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-gray-500">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={clsx(
            'p-4 rounded-lg border transition-all',
            task.overdue && task.status !== 'COMPLETED'
              ? 'bg-red-50 border-red-200'
              : task.status === 'COMPLETED'
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200 hover:border-primary-300'
          )}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
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
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                )}
              </div>
            )}

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {task.priority > 0 && (
                      <span className="text-lg">{getPriorityIndicator(task.priority)}</span>
                    )}
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
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>

                {/* Actions */}
                {!readOnly && (onEdit || onDelete) && (
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(task)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(task.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {showCategory && (
                  <span className={clsx('badge text-xs', getCategoryColor(task.category))}>
                    {task.category}
                  </span>
                )}
                {task.dueDate && (
                  <span
                    className={clsx(
                      'text-xs',
                      task.overdue && task.status !== 'COMPLETED'
                        ? 'text-red-600 font-medium'
                        : 'text-gray-500'
                    )}
                  >
                    {task.overdue && task.status !== 'COMPLETED' && '⚠️ '}
                    Due: {formatShortDate(task.dueDate)}
                  </span>
                )}
                {task.status === 'IN_PROGRESS' && (
                  <span className="badge badge-warning text-xs">In Progress</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}