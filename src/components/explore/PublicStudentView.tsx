import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockStudentTasks, mockEssays, mockStudentProgress } from '@/constants/mockData';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

export function PublicStudentView() {
  const completionPercentage = getProgressPercentage(
    mockStudentProgress.completedTasks,
    mockStudentProgress.totalTasks
  );

  return (
    <div className="space-y-8">
      {/* Stats Preview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-primary-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-gray-900">{mockStudentProgress.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600">
              {mockStudentProgress.completedTasks}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600">
              {mockStudentProgress.inProgressTasks}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Organize essays, testing, extracurriculars, and application deadlines all in one place.
          </p>
          <div className="space-y-3">
            {mockStudentTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={task.status === 'COMPLETED'} readOnly className="h-4 w-4" />
                  <div>
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-600">{task.description}</div>
                    )}
                  </div>
                </div>
                {task.dueDate && (
                  <div className="text-sm text-gray-500">{formatShortDate(task.dueDate)}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Essays Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Essay Manager with AI Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Write, revise, and get AI-powered feedback on your college essays with version history.
          </p>
          <div className="space-y-4">
            {mockEssays.map((essay) => (
              <div key={essay.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{essay.title}</h4>
                  <span className="badge badge-info">{essay.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{essay.prompt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{essay.schoolName}</span>
                  {essay.dueDate && <span>Due: {formatShortDate(essay.dueDate)}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
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
            <h3 className="font-semibold text-gray-900 mb-2">Task Tracking</h3>
            <p className="text-sm text-gray-600">
              Never miss a deadline with organized task management and reminders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-2">AI Feedback</h3>
            <p className="text-sm text-gray-600">
              Get structured feedback on your essays powered by local AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <svg
              className="w-12 h-12 text-primary-600 mx-auto mb-4"
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
            <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Visualize your progress and stay on track throughout the year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to get organized?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Create your free student account and start tracking your college application journey
            today. Everything you need to stay organized and meet your deadlines.
          </p>
          <Link href="/auth/register" className="btn-primary inline-block">
            Create Student Account
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}