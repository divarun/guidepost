'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { getProgressPercentage } from '@/lib/utils/formatters';

interface ProgressTrackerProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  essayProgress: {
    total: number;
    draft: number;
    inReview: number;
    final: number;
  };
  showDetails?: boolean;
}

export function ProgressTracker({
  totalTasks,
  completedTasks,
  inProgressTasks,
  overdueTasks,
  essayProgress,
  showDetails = true,
}: ProgressTrackerProps) {
  const completionPercentage = getProgressPercentage(completedTasks, totalTasks);

  return (
    <div className="space-y-6">
      {/* Overall Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-primary-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-primary-600 to-secondary-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage > 10 && (
              <span className="text-xs font-medium text-white">{completionPercentage}%</span>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
                <div className="text-xs text-gray-600">Total Tasks</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                <div className="text-xs text-gray-600">In Progress</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                <div className="text-xs text-gray-600">Overdue</div>
              </CardContent>
            </Card>
          </div>

          {/* Essay Progress */}
          <Card>
            <CardContent className="py-4">
              <h4 className="font-medium text-gray-900 mb-3">Essay Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Essays</span>
                  <span className="text-lg font-bold text-gray-900">{essayProgress.total}</span>
                </div>
                {essayProgress.total > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${getProgressPercentage(
                            essayProgress.final,
                            essayProgress.total
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-200 rounded" />
                        <span className="text-gray-600">
                          Draft: {essayProgress.draft}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded" />
                        <span className="text-gray-600">
                          Review: {essayProgress.inReview}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded" />
                        <span className="text-gray-600">
                          Final: {essayProgress.final}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-900">On Track</div>
              <div className="text-xs text-green-700 mt-1">
                {completionPercentage >= 70 ? '✓' : '-'}
              </div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm font-medium text-yellow-900">Needs Attention</div>
              <div className="text-xs text-yellow-700 mt-1">
                {overdueTasks > 0 ? `${overdueTasks} overdue` : 'None'}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900">Active Tasks</div>
              <div className="text-xs text-blue-700 mt-1">{inProgressTasks}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}