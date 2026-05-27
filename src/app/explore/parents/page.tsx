import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockParentTasks, mockBudgets } from '@/lib/constants/mockData';
import { parentTimeline } from '@/lib/constants/timelineData';
import { formatShortDate, formatCurrency } from '@/lib/utils/formatters';

export default function ExploreParentsPage() {
  const totalCost = mockBudgets.reduce((sum, b) => {
    return sum + b.tuitionCost + b.roomAndBoard + b.booksAndSupplies + b.otherExpenses;
  }, 0);

  const totalAid = mockBudgets.reduce((sum, b) => {
    return sum + b.expectedAid + b.scholarships;
  }, 0);

  const netCost = totalCost - totalAid;

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
              <Link href="/explore/students" className="text-gray-600 hover:text-gray-900">
                Student View
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Create Parent Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-12">
        {/* Preview Banner */}
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                <strong>Preview Mode:</strong> This is example data showing how Guidepost helps parents navigate financial aid and college costs.{' '}
                <Link href="/auth/register" className="font-medium underline">
                  Create an account
                </Link>{' '}
                to start planning your family's college journey.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Portal</h1>
          <p className="text-lg text-gray-600">
            Track financial aid deadlines, create college budgets, and support your student's success.
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(totalCost)}
              </div>
              <div className="text-sm text-gray-600">Total Cost (All Schools)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(totalAid)}
              </div>
              <div className="text-sm text-gray-600">Expected Aid & Scholarships</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {formatCurrency(netCost)}
              </div>
              <div className="text-sm text-gray-600">Estimated Net Cost</div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Aid Tasks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Financial Aid Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400 mb-3 italic">Timing shown is approximate. Verify deadlines with each school and program.</p>
            <div className="space-y-3">
              {mockParentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={(task.status as string) === 'COMPLETED'} readOnly className="h-4 w-4" />
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

        {/* College Budgets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>College Cost Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400 mb-3 italic">Figures are illustrative examples. Actual costs and aid vary — verify with each school.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">School</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Tuition</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Room & Board</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total Cost</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Expected Aid</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Net Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockBudgets.map((budget, index) => {
                    const total = budget.tuitionCost + budget.roomAndBoard + budget.booksAndSupplies + budget.otherExpenses;
                    const net = total - budget.expectedAid - budget.scholarships;
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{budget.schoolName}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(budget.tuitionCost)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(budget.roomAndBoard)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{formatCurrency(total)}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(budget.expectedAid + budget.scholarships)}</td>
                        <td className="px-4 py-3 text-sm text-right text-primary-600 font-bold">{formatCurrency(net)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Aid Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {parentTimeline.slice(0, 4).map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to support your student?</h2>
          <p className="text-gray-600 mb-6">
            Create your free parent account and start tracking financial aid deadlines and college costs.
          </p>
          <Link href="/auth/register" className="btn-primary btn text-lg px-8 py-3">
            Create Parent Account
          </Link>
        </div>
      </main>
    </div>
  );
}