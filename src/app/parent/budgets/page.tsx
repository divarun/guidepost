'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/formatters';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: '',
    tuitionCost: '',
    roomAndBoard: '',
    booksAndSupplies: '',
    otherExpenses: '',
    expectedAid: '',
    scholarships: '',
    notes: '',
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await fetch('/api/parents/budgets');
      const data = await response.json();

      if (data.success) {
        setBudgets(data.data);
      }
    } catch (error) {
      showToast('Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (budget?: any) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        schoolName: budget.schoolName,
        tuitionCost: budget.tuitionCost.toString(),
        roomAndBoard: budget.roomAndBoard.toString(),
        booksAndSupplies: budget.booksAndSupplies.toString(),
        otherExpenses: budget.otherExpenses.toString(),
        expectedAid: budget.expectedAid.toString(),
        scholarships: budget.scholarships.toString(),
        notes: budget.notes || '',
      });
    } else {
      setEditingBudget(null);
      setFormData({
        schoolName: '',
        tuitionCost: '',
        roomAndBoard: '',
        booksAndSupplies: '',
        otherExpenses: '',
        expectedAid: '',
        scholarships: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        tuitionCost: parseFloat(formData.tuitionCost) || 0,
        roomAndBoard: parseFloat(formData.roomAndBoard) || 0,
        booksAndSupplies: parseFloat(formData.booksAndSupplies) || 0,
        otherExpenses: parseFloat(formData.otherExpenses) || 0,
        expectedAid: parseFloat(formData.expectedAid) || 0,
        scholarships: parseFloat(formData.scholarships) || 0,
      };

      const url = '/api/parents/budgets';
      const method = editingBudget ? 'PATCH' : 'POST';
      const body = editingBudget ? { id: editingBudget.id, ...payload } : payload;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          editingBudget ? 'Budget updated successfully' : 'Budget created successfully',
          'success'
        );
        setShowModal(false);
        loadBudgets();
      } else {
        showToast(data.error || 'Failed to save budget', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const response = await fetch(`/api/parents/budgets?id=${budgetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Budget deleted successfully', 'success');
        loadBudgets();
      } else {
        showToast(data.error || 'Failed to delete budget', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  const totalNetCost = budgets.reduce((sum, b) => sum + b.netCost, 0);

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">College Budgets</h1>
        <Button onClick={() => handleOpenModal()}>Add School Budget</Button>
      </div>

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">{budgets.length}</div>
              <div className="text-sm text-gray-600">Schools Budgeted</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {formatCurrency(totalNetCost / budgets.length)}
              </div>
              <div className="text-sm text-gray-600">Average Net Cost</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(
                  budgets.reduce(
                    (sum, b) =>
                      sum + parseFloat(b.expectedAid) + parseFloat(b.scholarships),
                    0
                  )
                )}
              </div>
              <div className="text-sm text-gray-600">Total Expected Aid</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Comparison Table */}
      {budgets.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Cost Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      School
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Tuition
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Room & Board
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Other
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Total Cost
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Aid & Scholarships
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Net Cost
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {budgets.map((budget) => {
                    const other =
                      parseFloat(budget.booksAndSupplies) +
                      parseFloat(budget.otherExpenses);
                    return (
                      <tr key={budget.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {budget.schoolName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatCurrency(parseFloat(budget.tuitionCost))}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatCurrency(parseFloat(budget.roomAndBoard))}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatCurrency(other)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                          {formatCurrency(budget.totalCost)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">
                          {formatCurrency(
                            parseFloat(budget.expectedAid) +
                              parseFloat(budget.scholarships)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-primary-600 font-bold">
                          {formatCurrency(budget.netCost)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(budget)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(budget.id)}
                              className="text-red-600"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 mb-4">No budgets yet</p>
            <Button onClick={() => handleOpenModal()}>Create your first budget</Button>
          </CardContent>
        </Card>
      )}

      {/* Budget Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBudget ? 'Edit Budget' : 'New School Budget'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="School Name"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            required
            placeholder="Stanford University"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tuition & Fees"
              type="number"
              step="0.01"
              min="0"
              value={formData.tuitionCost}
              onChange={(e) => setFormData({ ...formData, tuitionCost: e.target.value })}
              required
              placeholder="55000"
            />

            <Input
              label="Room & Board"
              type="number"
              step="0.01"
              min="0"
              value={formData.roomAndBoard}
              onChange={(e) => setFormData({ ...formData, roomAndBoard: e.target.value })}
              required
              placeholder="16000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Books & Supplies"
              type="number"
              step="0.01"
              min="0"
              value={formData.booksAndSupplies}
              onChange={(e) =>
                setFormData({ ...formData, booksAndSupplies: e.target.value })
              }
              required
              placeholder="1200"
            />

            <Input
              label="Other Expenses"
              type="number"
              step="0.01"
              min="0"
              value={formData.otherExpenses}
              onChange={(e) => setFormData({ ...formData, otherExpenses: e.target.value })}
              required
              placeholder="2000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expected Aid"
              type="number"
              step="0.01"
              min="0"
              value={formData.expectedAid}
              onChange={(e) => setFormData({ ...formData, expectedAid: e.target.value })}
              required
              placeholder="30000"
              helperText="From net price calculator"
            />

            <Input
              label="Scholarships"
              type="number"
              step="0.01"
              min="0"
              value={formData.scholarships}
              onChange={(e) => setFormData({ ...formData, scholarships: e.target.value })}
              required
              placeholder="5000"
              helperText="External scholarships"
            />
          </div>

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Additional notes about this school's financial aid package..."
          />

          {/* Estimated Net Cost */}
          {formData.tuitionCost && formData.roomAndBoard && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Estimated Net Cost:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(
                    parseFloat(formData.tuitionCost || '0') +
                      parseFloat(formData.roomAndBoard || '0') +
                      parseFloat(formData.booksAndSupplies || '0') +
                      parseFloat(formData.otherExpenses || '0') -
                      parseFloat(formData.expectedAid || '0') -
                      parseFloat(formData.scholarships || '0')
                  )}
                </span>
              </div>
            </div>
          )}

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingBudget ? 'Update' : 'Create'} Budget</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}