import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockStudentTasks, mockEssays, mockStudentProgress } from '@/lib/constants/mockData';
import { studentTimeline } from '@/lib/constants/timelineData';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

export default function ExploreStudentsPage() {
  const completionPercentage = getProgressPercentage(
    mockStudentProgress.completedTasks,
    mockStudentProgress.totalTasks
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Guidepost
            </Link>
            <div className="flex gap-4">
              <Link href="/explore/parents" className="text-gray-600 hover:text-gray-900">
                Parent View
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Create Student Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-12">
        {/* Preview Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Preview Mode:</strong> This is example data showing how Guidepost helps students organize their college applications.{' '}
                <Link href="/auth/register" className="font-medium underline">
                  Create an account
                </Link>{' '}
                to start tracking your own progress.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
          <p className="text-lg text-gray-600">
            Organize your college applications, manage deadlines, and get AI-powered essay feedback.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary-600">{completionPercentage}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-gray-900">{mockStudentProgress.totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">{mockStudentProgress.completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{mockStudentProgress.inProgressTasks}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400 mb-3 italic">Timing shown is approximate. Verify deadlines with each school and program.</p>
            <div className="space-y-3">
              {mockStudentTasks.slice(0, 5).map((task) => (
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
                  {task.dueLabel ? (
                    <div className="text-sm text-gray-500">{task.dueLabel}</div>
                  ) : task.dueDate ? (
                    <div className="text-sm text-gray-500">{formatShortDate(task.dueDate)}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Essays Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Essays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEssays.map((essay) => (
                <div key={essay.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{essay.title}</h4>
                    <span className="badge badge-info">{essay.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{essay.prompt}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{essay.schoolName}</span>
                    {essay.dueLabel ? (
                      <span>{essay.dueLabel}</span>
                    ) : essay.dueDate ? (
                      <span>{formatShortDate(essay.dueDate)}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {studentTimeline.slice(0, 4).map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-900">
                    {event.grade}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-900 mb-1">{event.season}: {event.title}</div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {event.tasks.slice(0, 3).map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Create your free student account and start organizing your college applications today.
          </p>
          <Link href="/auth/register" className="btn-primary btn text-lg px-8 py-3">
            Create Student Account
          </Link>
        </div>
      </main>
    </div>
  );
}