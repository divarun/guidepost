'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

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
const taskStatusOptions   = statusOptions.filter((opt) => opt.value !== '');

const emptyForm = {
  title: '',
  description: '',
  category: 'APPLICATION',
  status: 'NOT_STARTED',
  priority: 0,
  dueDate: '',
};

export default function StudentTasksPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [tasks, setTasks]               = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editingTask, setEditingTask]   = useState<any>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [formData, setFormData]         = useState(emptyForm);

  useEffect(() => {
    loadTasks();
  }, [filterCategory, filterStatus]);

  // Auto-open modal when navigated here with ?new=true
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleOpenModal();
      router.replace('/student/tasks');
    }
  }, [searchParams]);

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus)   params.append('status', filterStatus);
      const res  = await fetch(`/api/students/tasks?${params}`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title:       task.title,
        description: task.description || '',
        category:    task.category,
        status:      task.status,
        priority:    task.priority,
        dueDate:     task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTask ? 'PATCH' : 'POST';
      const body   = editingTask ? { id: editingTask.id, ...formData } : formData;
      const res    = await fetch('/api/students/tasks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingTask ? 'Task updated' : 'Task created', 'success');
        setShowModal(false);
        loadTasks();
      } else {
        showToast(data.error || 'Failed to save task', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      const newStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
      const res  = await fetch('/api/students/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) loadTasks();
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res  = await fetch(`/api/students/tasks?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Task deleted', 'success');
        loadTasks();
      } else {
        showToast(data.error || 'Failed to delete task', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <TopBar
        crumbs={['Tasks']}
        action="New task"
        onAction={() => handleOpenModal()}
      />

      <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
        {/* Filters */}
        <div className="flex gap-3 mb-6">
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

        {/* Task list */}
        <Card>
          <CardContent className="p-0">
            {tasks.length > 0 ? (
              <div className="divide-y" style={{ borderColor: 'var(--hairline)' }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={clsx('p-4', task.overdue && 'bg-red-50')}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={task.status === 'COMPLETED'}
                        onChange={() => handleToggleComplete(task)}
                        className="mt-1 h-4 w-4 cursor-pointer"
                        style={{ accentColor: 'var(--ink)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p
                              className={clsx(
                                'text-[14px]',
                                task.status === 'COMPLETED' ? 'line-through' : ''
                              )}
                              style={{ color: task.status === 'COMPLETED' ? 'var(--muted)' : 'var(--ink)' }}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="badge badge-info">{task.category.toLowerCase().replace('_', ' ')}</span>
                              <span className={clsx('badge', task.status === 'COMPLETED' ? 'badge-success' : task.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-gray')}>
                                {task.status.toLowerCase().replace('_', ' ')}
                              </span>
                              {task.dueDate && (
                                <span className={clsx('badge', task.overdue ? 'badge-danger' : 'badge-gray')}>
                                  {formatShortDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(task)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingId(task.id)}
                              style={{ color: 'var(--alert)' }}
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
              <div className="text-center py-16">
                <p className="text-[13.5px] mb-4" style={{ color: 'var(--muted)' }}>No tasks found</p>
                <Button onClick={() => handleOpenModal()}>Create your first task</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit modal */}
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
            placeholder="Optional details..."
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={taskCategoryOptions}
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={taskStatusOptions}
            required
          />
          <Input
            label="Due Date (optional)"
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

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete task?"
        size="sm"
      >
        <p className="text-[13.5px] mb-6" style={{ color: 'var(--ink-2)' }}>
          This cannot be undone.
        </p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button onClick={handleDelete} style={{ background: 'var(--alert)', color: 'var(--paper)' }}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
