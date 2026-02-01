'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

export default function StudentEssaysPage() {
  const [essays, setEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    schoolName: '',
    dueDate: '',
  });

  useEffect(() => {
    loadEssays();
  }, []);

  const loadEssays = async () => {
    try {
      const response = await fetch('/api/students/essays');
      const data = await response.json();

      if (data.success) {
        setEssays(data.data);
      }
    } catch (error) {
      showToast('Failed to load essays', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/students/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Essay created successfully', 'success');
        setShowModal(false);
        setFormData({ title: '', prompt: '', schoolName: '', dueDate: '' });
        loadEssays();
      } else {
        showToast(data.error || 'Failed to create essay', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleDelete = async (essayId: string) => {
    if (!confirm('Are you sure you want to delete this essay?')) return;

    try {
      const response = await fetch(`/api/students/essays?id=${essayId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Essay deleted successfully', 'success');
        loadEssays();
      } else {
        showToast(data.error || 'Failed to delete essay', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      DRAFT: 'badge-info',
      IN_REVIEW: 'badge-warning',
      REVISED: 'badge-warning',
      FINAL: 'badge-success',
    };
    return statusColors[status as keyof typeof statusColors] || 'badge-info';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Essays</h1>
        <Button onClick={() => setShowModal(true)}>New Essay</Button>
      </div>

      {/* Essays Grid */}
      {essays.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essays.map((essay) => (
            <Card key={essay.id} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{essay.title}</h3>
                  <span className={clsx('badge', getStatusBadge(essay.status))}>
                    {essay.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{essay.prompt}</p>

                <div className="space-y-2 text-sm mb-4">
                  {essay.schoolName && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {essay.schoolName}
                    </div>
                  )}
                  {essay.dueDate && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {formatShortDate(essay.dueDate)}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {essay.wordCount} words
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/student/essays/${essay.id}`} className="btn-primary flex-1 text-center">
                    Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(essay.id)}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-gray-500 mb-4">No essays yet</p>
            <Button onClick={() => setShowModal(true)}>Create your first essay</Button>
          </CardContent>
        </Card>
      )}

      {/* New Essay Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Essay"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Common App Essay - Personal Growth"
          />

          <Textarea
            label="Prompt"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            required
            rows={4}
            placeholder="Enter the essay prompt..."
          />

          <Input
            label="School Name (Optional)"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            placeholder="Stanford University"
          />

          <Input
            label="Due Date (Optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Essay</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}