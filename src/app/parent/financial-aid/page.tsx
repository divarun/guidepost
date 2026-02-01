'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

export default function FinancialAidPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'FAFSA',
    priority: 1,
    dueDate: '',
  });

  const [aiFormData, setAiFormData] = useState({
    documentType: 'fafsa',
    content: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/parents/tasks');
      const data = await response.json();

      if (data.success) {
        // Filter for financial aid related tasks
        const financialTasks = data.data.filter((t: any) =>
          ['FAFSA', 'CSS_PROFILE', 'FINANCIAL_AID', 'SCHOLARSHIP'].includes(t.category)
        );
        setTasks(financialTasks);
      }
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        category: 'FAFSA',
        priority: 1,
        dueDate: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/parents/tasks';
      const method = editingTask ? 'PATCH' : 'POST';
      const body = editingTask ? { id: editingTask.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          editingTask ? 'Task updated successfully' : 'Task created successfully',
          'success'
        );
        setShowModal(false);
        loadTasks();
      } else {
        showToast(data.error || 'Failed to save task', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      const newStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';

      const response = await fetch('/api/parents/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        loadTasks();
      }
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/parents/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Task deleted successfully', 'success');
        loadTasks();
      } else {
        showToast(data.error || 'Failed to delete task', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleGetAISummary = async () => {
    if (!aiFormData.content || aiFormData.content.trim().length < 20) {
      showToast('Please enter at least 20 characters of document content', 'warning');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/financial-aid-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiFormData),
      });

      const data = await response.json();

      if (data.success) {
        setAiSummary(data.summary);
        showToast('Summary generated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to generate summary', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'FAFSA', label: 'FAFSA' },
    { value: 'CSS_PROFILE', label: 'CSS Profile' },
    { value: 'FINANCIAL_AID', label: 'Financial Aid' },
    { value: 'SCHOLARSHIP', label: 'Scholarship' },
  ];

  const documentTypeOptions = [
    { value: 'fafsa', label: 'FAFSA' },
    { value: 'award-letter', label: 'Award Letter' },
    { value: 'scholarship', label: 'Scholarship' },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Financial Aid</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowAIModal(true)} variant="secondary">
            AI Document Summary
          </Button>
          <Button onClick={() => handleOpenModal()}>Add Task</Button>
        </div>
      </div>

      {/* Important Deadlines */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <div className="text-sm text-blue-900 font-medium mb-1">FAFSA Opens</div>
            <div className="text-2xl font-bold text-blue-900">October 1</div>
            <div className="text-sm text-blue-700 mt-1">Open annually on Oct 1</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="py-6">
            <div className="text-sm text-purple-900 font-medium mb-1">CSS Profile</div>
            <div className="text-2xl font-bold text-purple-900">School Specific</div>
            <div className="text-sm text-purple-700 mt-1">Check individual schools</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="py-6">
            <div className="text-sm text-green-900 font-medium mb-1">Priority Deadline</div>
            <div className="text-2xl font-bold text-green-900">February 1</div>
            <div className="text-sm text-green-700 mt-1">Many schools' priority date</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Category */}
      <div className="space-y-6">
        {['FAFSA', 'CSS_PROFILE', 'SCHOLARSHIP', 'FINANCIAL_AID'].map((category) => {
          const categoryTasks = tasks.filter((t) => t.category === category);
          if (categoryTasks.length === 0) return null;

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle>
                  {category.replace('_', ' ')} Tasks ({categoryTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryTasks.map((task) => (
                    <div
                      key={task.id}
                      className={clsx(
                        'p-4 rounded-lg border',
                        task.overdue
                          ? 'bg-red-50 border-red-200'
                          : task.status === 'COMPLETED'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={task.status === 'COMPLETED'}
                          onChange={() => handleToggleComplete(task)}
                          className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={clsx(
                                  'font-medium',
                                  task.status === 'COMPLETED'
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-900'
                                )}
                              >
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <div
                                  className={clsx(
                                    'text-sm mt-2',
                                    task.overdue ? 'text-red-600 font-medium' : 'text-gray-500'
                                  )}
                                >
                                  Due: {formatShortDate(task.dueDate)}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal(task)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(task.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No financial aid tasks yet</p>
            <Button onClick={() => handleOpenModal()}>Create your first task</Button>
          </CardContent>
        </Card>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTask ? 'Edit Task' : 'New Financial Aid Task'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Complete FAFSA application"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Optional details..."
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categoryOptions}
            required
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingTask ? 'Update' : 'Create'} Task</Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* AI Summary Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => {
          setShowAIModal(false);
          setAiSummary(null);
          setAiFormData({ documentType: 'fafsa', content: '' });
        }}
        title="AI Document Summary"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Document Type"
            value={aiFormData.documentType}
            onChange={(e) => setAiFormData({ ...aiFormData, documentType: e.target.value })}
            options={documentTypeOptions}
          />

          <Textarea
            label="Document Content"
            value={aiFormData.content}
            onChange={(e) => setAiFormData({ ...aiFormData, content: e.target.value })}
            rows={6}
            placeholder="Paste your FAFSA, award letter, or scholarship document content here..."
            helperText="The AI will extract key information and action items"
          />

          <Button onClick={handleGetAISummary} isLoading={aiLoading} className="w-full">
            Generate Summary
          </Button>

          {aiSummary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {aiSummary.keyPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {aiSummary.importantDeadlines.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Important Deadlines</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {aiSummary.importantDeadlines.map((deadline: string, index: number) => (
                      <li key={index}>{deadline}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSummary.actionItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Action Items</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {aiSummary.actionItems.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSummary.financialBreakdown && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Financial Breakdown</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {aiSummary.financialBreakdown.totalAid && (
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-600">Total Aid</div>
                        <div className="font-medium">${aiSummary.financialBreakdown.totalAid}</div>
                      </div>
                    )}
                    {aiSummary.financialBreakdown.grants && (
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-600">Grants</div>
                        <div className="font-medium">${aiSummary.financialBreakdown.grants}</div>
                      </div>
                    )}
                    {aiSummary.financialBreakdown.loans && (
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-600">Loans</div>
                        <div className="font-medium">${aiSummary.financialBreakdown.loans}</div>
                      </div>
                    )}
                    {aiSummary.financialBreakdown.workStudy && (
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-600">Work Study</div>
                        <div className="font-medium">${aiSummary.financialBreakdown.workStudy}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}