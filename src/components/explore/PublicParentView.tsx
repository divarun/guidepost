import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockParentTasks, mockBudgets } from '@/constants/mockData';
import { formatShortDate, formatCurrency } from '@/lib/utils/formatters';

export function PublicParentView() {
  const totalCost = mockBudgets.reduce((sum, b) => {
    return sum + b.tuitionCost + b.roomAndBoard + b.booksAndSupplies + b.otherExpenses;
  }, 0);

  const totalAid = mockBudgets.reduce((sum, b) => {
    return sum + b.expectedAid + b.scholarships;
  }, 0);

  const netCost = totalCost - totalAid;

  return (
    <div className="space-y-8">
      {/* Financial Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost)}</div>
            <div className="text-sm text-gray-600">Total Cost (All Schools)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalAid)}</div>
            <div className="text-sm text-gray-600">Expected Aid & Scholarships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-primary-600">{formatCurrency(netCost)}</div>
            <div className="text-sm text-gray-600">Estimated Net Cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Aid Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Aid Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Stay on top of FAFSA, CSS Profile, scholarship deadlines, and document requirements.
          </p>
          <div className="space-y-3">
            {mockParentTasks.map((task) => (
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

      {/* Budget Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>College Cost Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Compare costs across schools and plan your family's college budget with detailed breakdowns.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">School</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total Cost</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Aid</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Net Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockBudgets.map((budget, index) => {
                  const total = budget.tuitionCost + budget.roomAndBoard + budget.booksAndSupplies + budget.otherExpenses;
                  const aid = budget.expectedAid + budget.scholarships;
                  const net = total - aid;
                  return (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{budget.schoolName}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(total)}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(aid)}</td>
                      <td className="px-4 py-3 text-sm text-right text-primary-600 font-bold">{formatCurrency(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-2">FAFSA & CSS Tracking</h3>
            <p className="text-sm text-gray-600">
              Manage federal and institutional financial aid applications
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900 mb-2">Budget Planning</h3>
            <p className="text-sm text-gray-600">
              Compare college costs and plan your family's budget
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
            <h3 className="font-semibold text-gray-900 mb-2">AI Document Help</h3>
            <p className="text-sm text-gray-600">
              Get summaries and insights from financial aid documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Deadlines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Key Financial Aid Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-blue-900 mb-1">FAFSA Opens</div>
              <div className="text-2xl font-bold text-blue-900 mb-1">October 1</div>
              <div className="text-sm text-blue-700">File as early as possible</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">CSS Profile</div>
              <div className="text-2xl font-bold text-purple-900 mb-1">School Specific</div>
              <div className="text-sm text-purple-700">Check individual deadlines</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-green-900 mb-1">Priority Filing</div>
              <div className="text-2xl font-bold text-green-900 mb-1">February 1</div>
              <div className="text-sm text-green-700">Many schools' priority date</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-secondary-50 to-primary-50 border-secondary-200">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to plan your family's college journey?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Create your free parent account to track financial aid deadlines, plan budgets, and
            monitor your student's progress.
          </p>
          <Link href="/auth/register" className="btn-primary inline-block">
            Create Parent Account
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}