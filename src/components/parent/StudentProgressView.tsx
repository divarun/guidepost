'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

interface StudentInfo {
  name: string;
  email: string;
  graduationYear?: number;
  gpa?: number;
}

interface ProgressData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  upcomingDeadlines: any[];
  essayProgress: {
    total: number;
    draft: number;
    inReview: number;
    revised: number;
    final: number;
  };
  essays?: any[];
}

interface StudentProgressViewProps {
  student: StudentInfo;
  progress: ProgressData;
}

export function StudentProgressView({ student, progress }: StudentProgressViewProps) {
  const completionPercentage = getProgressPercentage(
    progress.completedTasks,
    progress.totalTasks
  );

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium text-gray-900">{student.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium text-gray-900">{student.email}</div>
            </div>
            {student.graduationYear && (
              <div>
                <div className="text-sm text-gray-600">Graduation Year</div>
                <div className="font-medium text-gray-900">{student.graduationYear}</div>
              </div>
            )}
            {student.gpa && (
              <div>
                <div className="text-sm text-gray-600">GPA</div>
                <div className="font-medium text-gray-900">{student.gpa.toFixed(2)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <div className="grid md:grid-cols-4 gap-6">
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

      {/* Overdue Warning */}
      {progress.overdueTasks > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Attention:</strong> Your student has {progress.overdueTasks} overdue{' '}
                {progress.overdueTasks === 1 ? 'task' : 'tasks'}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Deadlines and Essay Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
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
                    {task.dueDate && (
                      <div className="text-sm text-gray-600">{formatShortDate(task.dueDate)}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Essay Progress</CardTitle>
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
                  <span className="text-gray-600">Revised</span>
                  <span className="font-medium">{progress.essayProgress.revised}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Final</span>
                  <span className="font-medium text-green-600">
                    {progress.essayProgress.final}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Essays List */}
      {progress.essays && progress.essays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Essays ({progress.essays.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.essays.map((essay: any) => (
                <div key={essay.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{essay.title}</h4>
                    <span className="badge badge-info">{essay.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{essay.schoolName || 'No school specified'}</span>
                    <span>{essay.wordCount} words</span>
                  </div>
                  {essay.dueDate && (
                    <div className="text-sm text-gray-500 mt-1">
                      Due: {formatShortDate(essay.dueDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read-Only Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Read-Only View</h4>
              <p className="text-sm text-blue-800">
                This page provides a read-only view of your student's application progress. To
                make changes to tasks or essays, your student should log into their account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}