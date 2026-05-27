'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

const statusBadge: Record<string, string> = {
  DRAFT:     'badge-info',
  IN_REVIEW: 'badge-warning',
  REVISED:   'badge-warning',
  FINAL:     'badge-success',
};

const emptyForm = { title: '', prompt: '', schoolName: '', dueDate: '' };

export default function StudentEssaysPage() {
  const { showToast } = useToast();

  const [essays, setEssays]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData]     = useState(emptyForm);

  useEffect(() => { loadEssays(); }, []);

  const loadEssays = async () => {
    try {
      const res  = await fetch('/api/students/essays');
      const data = await res.json();
      if (data.success) setEssays(data.data);
    } catch {
      showToast('Failed to load essays', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res  = await fetch('/api/students/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Essay created', 'success');
        setShowModal(false);
        setFormData(emptyForm);
        loadEssays();
      } else {
        showToast(data.error || 'Failed to create essay', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res  = await fetch(`/api/students/essays?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Essay deleted', 'success');
        loadEssays();
      } else {
        showToast(data.error || 'Failed to delete essay', 'error');
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
        crumbs={['Essays']}
        action="New essay"
        onAction={() => setShowModal(true)}
      />

      <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
        {essays.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {essays.map((essay) => (
              <Card key={essay.id}>
                <CardContent>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[14px] font-medium pr-2" style={{ color: 'var(--ink)' }}>
                      {essay.title}
                    </h3>
                    <span className={clsx('badge shrink-0', statusBadge[essay.status] ?? 'badge-info')}>
                      {essay.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[12.5px] mb-3 line-clamp-3" style={{ color: 'var(--ink-2)' }}>
                    {essay.prompt}
                  </p>

                  <div className="space-y-1 text-[12px] mb-4" style={{ color: 'var(--muted)' }}>
                    {essay.schoolName && <div>{essay.schoolName}</div>}
                    {essay.dueDate && <div>{formatShortDate(essay.dueDate)}</div>}
                    <div>{essay.wordCount} words</div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/student/essays/${essay.id}`}
                      className="btn-primary flex-1 text-center text-[12.5px]"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(essay.id)}
                      style={{ color: 'var(--alert)' }}
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
            <CardContent className="text-center py-16">
              <p className="text-[13.5px] mb-4" style={{ color: 'var(--muted)' }}>No essays yet</p>
              <Button onClick={() => setShowModal(true)}>Create your first essay</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New essay modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Essay" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Common App Essay — Personal Growth"
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
            label="School (optional)"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            placeholder="Stanford University"
          />
          <Input
            label="Due Date (optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create Essay</Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete essay?" size="sm">
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
