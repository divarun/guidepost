'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Spinner';
import { formatShortDate, formatCurrency } from '@/lib/utils/formatters';

export default function ParentDashboard() {
  const [studentProgress, setStudentProgress] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/parents/student-progress').then((r) => r.json()),
      fetch('/api/parents/tasks').then((r) => r.json()),
      fetch('/api/parents/budgets').then((r) => r.json()),
    ])
      .then(([progressData, tasksData, budgetsData]) => {
        if (progressData.success) setStudentProgress(progressData.data);
        if (tasksData.success) setTasks(tasksData.data);
        if (budgetsData.success) setBudgets(budgetsData.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const totalBudgeted = budgets.reduce((sum, b) => {
    const total = Number(b.tuitionCost) + Number(b.roomAndBoard) + Number(b.booksAndSupplies) + Number(b.otherExpenses);
    const net = total - Number(b.expectedAid) - Number(b.scholarships);
    return sum + net;
  }, 0);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Parent Dashboard</h1>

      {/* Student Info */}
      {studentProgress && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{studentProgress.student.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{studentProgress.student.email}</div>
              </div>
              {studentProgress.student.graduationYear && (
                <div>
                  <div className="text-sm text-gray-600">Graduation Year</div>
                  <div className="font-medium">{studentProgress.student.graduationYear}</div>
                </div>
              )}
              {studentProgress.student.gpa && (
                <div>
                  <div className="text-sm text-gray-600">GPA</div>
                  <div className="font-medium">{studentProgress.student.gpa.toFixed(2)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {formatCurrency(totalBudgeted)}
            </div>
            <div className="text-sm text-gray-600">Total Net Cost (Est.)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{budgets.length}</div>
            <div className="text-sm text-gray-600">Schools Budgeted</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{upcomingTasks.length}</div>
            <div className="text-sm text-gray-600">Pending Tasks</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Financial Aid Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Financial Aid Tasks</CardTitle>
              <Link
                href="/parent/financial-aid"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.category}</div>
                    </div>
                    {task.dueDate && (
                      <div className="text-sm text-gray-600">{formatShortDate(task.dueDate)}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
            )}
          </CardContent>
        </Card>

        {/* Student Progress */}
        {studentProgress && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student's Progress</CardTitle>
                <Link
                  href="/parent/student-progress"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View details
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="text-2xl font-bold text-green-600">
                    {studentProgress.progress.completedTasks} / {studentProgress.progress.totalTasks}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Essays (Total)</span>
                    <span className="font-medium">{studentProgress.progress.essayProgress.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Essays (Final)</span>
                    <span className="font-medium text-green-600">
                      {studentProgress.progress.essayProgress.final}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/parent/financial-aid"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">FAFSA / CSS</div>
                  <div className="text-sm text-gray-600">Track financial aid</div>
                </div>
              </div>
            </Link>

            <Link
              href="/parent/budgets"
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Add Budget</div>
                  <div className="text-sm text-gray-600">Plan college costs</div>
                </div>
              </div>
            </Link>

            <Link
              href="/parent/student-progress"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Check Progress</div>
                  <div className="text-sm text-gray-600">View student status</div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}