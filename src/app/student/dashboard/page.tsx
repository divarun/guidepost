'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Spinner';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

export default function StudentDashboard() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgress(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!progress) {
    return <div className="p-8">Failed to load progress data</div>;
  }

  const completionPercentage = getProgressPercentage(
    progress.completedTasks,
    progress.totalTasks
  );

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">{progress.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {progress.completedTasks}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {progress.inProgressTasks}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alert */}
      {progress.overdueTasks > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Attention:</strong> You have {progress.overdueTasks} overdue{' '}
                {progress.overdueTasks === 1 ? 'task' : 'tasks'}.{' '}
                <Link href="/student/tasks" className="font-medium underline">
                  View tasks
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Link
                href="/student/tasks"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {progress.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {progress.upcomingDeadlines.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.category}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatShortDate(task.dueDate)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
            )}
          </CardContent>
        </Card>

        {/* Essay Progress */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Essay Progress</CardTitle>
              <Link
                href="/student/essays"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Essays</span>
                <span className="text-2xl font-bold text-gray-900">
                  {progress.essayProgress.total}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Draft</span>
                  <span className="font-medium">{progress.essayProgress.draft}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Review</span>
                  <span className="font-medium">{progress.essayProgress.inReview}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Final</span>
                  <span className="font-medium text-green-600">
                    {progress.essayProgress.final}
                  </span>
                </div>
              </div>
              <Link href="/student/essays" className="btn-primary w-full mt-4">
                Manage Essays
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/student/tasks"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Add Task</div>
                  <div className="text-sm text-gray-600">Track a new deadline</div>
                </div>
              </div>
            </Link>

            <Link
              href="/student/essays"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">New Essay</div>
                  <div className="text-sm text-gray-600">Start writing</div>
                </div>
              </div>
            </Link>

            <Link
              href="/student/timeline"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">View Timeline</div>
                  <div className="text-sm text-gray-600">Application roadmap</div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}