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

export default function StudentTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'APPLICATION',
    priority: 0,
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, [filterCategory, filterStatus]);

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('status', filterStatus);

      const response = await fetch(`/api/students/tasks?${params}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
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
        category: 'APPLICATION',
        priority: 0,
        dueDate: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/students/tasks';
      const method = editingTask ? 'PATCH' : 'POST';
      const body = editingTask
        ? { id: editingTask.id, ...formData }
        : formData;

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

      const response = await fetch('/api/students/tasks', {
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
      const response = await fetch(`/api/students/tasks?id=${taskId}`, {
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

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'ESSAY', label: 'Essay' },
    { value: 'TESTING', label: 'Testing' },
    { value: 'EXTRACURRICULAR', label: 'Extracurricular' },
    { value: 'APPLICATION', label: 'Application' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const taskCategoryOptions = categoryOptions.filter((opt) => opt.value !== '');

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button onClick={() => handleOpenModal()}>Add Task</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          options={categoryOptions}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Tasks List */}
      <Card>
        <CardContent className="p-0">
          {tasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={clsx(
                    'p-4 hover:bg-gray-50 transition-colors',
                    task.overdue && 'bg-red-50'
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
                          <div className="flex gap-2 mt-2">
                            <span className="badge badge-info">{task.category}</span>
                            {task.dueDate && (
                              <span
                                className={clsx(
                                  'badge',
                                  task.overdue ? 'badge-danger' : 'badge-warning'
                                )}
                              >
                                Due: {formatShortDate(task.dueDate)}
                              </span>
                            )}
                          </div>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tasks found</p>
              <Button onClick={() => handleOpenModal()}>Create your first task</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Complete Common App essay"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Optional details about this task..."
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={taskCategoryOptions}
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
    </div>
  );
}