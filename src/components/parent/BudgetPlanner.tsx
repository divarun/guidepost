'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';

interface BudgetData {
  schoolName: string;
  tuitionCost: string;
  roomAndBoard: string;
  booksAndSupplies: string;
  otherExpenses: string;
  expectedAid: string;
  scholarships: string;
  notes: string;
}

interface BudgetPlannerProps {
  initialData?: Partial<BudgetData>;
  onSubmit: (data: BudgetData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function BudgetPlanner({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Budget',
}: BudgetPlannerProps) {
  const [formData, setFormData] = useState<BudgetData>({
    schoolName: initialData?.schoolName || '',
    tuitionCost: initialData?.tuitionCost || '',
    roomAndBoard: initialData?.roomAndBoard || '',
    booksAndSupplies: initialData?.booksAndSupplies || '',
    otherExpenses: initialData?.otherExpenses || '',
    expectedAid: initialData?.expectedAid || '',
    scholarships: initialData?.scholarships || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const totalCost =
    parseFloat(formData.tuitionCost || '0') +
    parseFloat(formData.roomAndBoard || '0') +
    parseFloat(formData.booksAndSupplies || '0') +
    parseFloat(formData.otherExpenses || '0');

  const totalAid =
    parseFloat(formData.expectedAid || '0') + parseFloat(formData.scholarships || '0');

  const netCost = totalCost - totalAid;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="School Name"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            required
            placeholder="Stanford University"
          />

          {/* Costs Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Annual Costs</h3>
            <div className="space-y-3">
              <Input
                label="Tuition & Fees"
                type="number"
                step="0.01"
                min="0"
                value={formData.tuitionCost}
                onChange={(e) => setFormData({ ...formData, tuitionCost: e.target.value })}
                required
                placeholder="55000"
                helperText="Annual tuition and mandatory fees"
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
                helperText="Dorm and meal plan costs"
              />

              <div className="grid grid-cols-2 gap-3">
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
                  onChange={(e) =>
                    setFormData({ ...formData, otherExpenses: e.target.value })
                  }
                  required
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          {/* Financial Aid Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Expected Financial Aid</h3>
            <div className="space-y-3">
              <Input
                label="Expected Aid"
                type="number"
                step="0.01"
                min="0"
                value={formData.expectedAid}
                onChange={(e) => setFormData({ ...formData, expectedAid: e.target.value })}
                required
                placeholder="30000"
                helperText="From net price calculator or award letter"
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
          </div>

          {/* Cost Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-primary-200">
            <h4 className="font-medium text-gray-900 mb-3">Cost Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Annual Cost</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Aid & Scholarships</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(totalAid)}
                </span>
              </div>
              <div className="pt-2 border-t border-primary-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Estimated Net Cost</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(netCost)}
                  </span>
                </div>
              </div>
              <div className="pt-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>4-Year Total (estimated)</span>
                  <span className="font-medium">{formatCurrency(netCost * 4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Additional notes about this school's financial aid package, deadlines, or requirements..."
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isLoading} className="flex-1">
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}