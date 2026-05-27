'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';
import { clsx } from 'clsx';

const essayStatusBadge: Record<string, string> = {
  DRAFT:     'badge-info',
  IN_REVIEW: 'badge-warning',
  REVISED:   'badge-warning',
  FINAL:     'badge-success',
};

export default function StudentProgressPage() {
  const { showToast } = useToast();

  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [notLinked, setNotLinked]       = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [linking, setLinking]           = useState(false);

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/parents/student-progress');
      const data = await res.json();
      if (data.success) {
        setProgressData(data.data);
        setNotLinked(false);
      } else if (res.status === 404) {
        setNotLinked(true);
      } else {
        showToast(data.error || 'Failed to load progress', 'error');
      }
    } catch {
      showToast('Failed to load progress', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinking(true);
    try {
      const res  = await fetch('/api/parents/link-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Linked to ${data.student.name}`, 'success');
        setStudentEmail('');
        loadProgress();
      } else {
        showToast(data.error || 'Failed to link student', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setLinking(false);
    }
  };

  if (loading) return <Loading />;

  if (notLinked) {
    return (
      <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Progress</h1>
          <p className="text-sm text-gray-500 mb-8">
            Link your student&apos;s account to view their application progress.
          </p>

          <Card>
            <CardContent className="py-8">
              <form onSubmit={handleLinkStudent} className="space-y-4">
                <Input
                  label="Student's email address"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  placeholder="student@example.com"
                />
                <Button type="submit" isLoading={linking} className="w-full">
                  Link student account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!progressData) return null;

  const { student, progress } = progressData;
  const completionPct = getProgressPercentage(progress.completedTasks, progress.totalTasks);
  const total = progress.totalTasks || 1;

  return (
    <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
      {/* Student header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{student.name}</h1>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{student.email}</span>
          {student.graduationYear && <span>Class of {student.graduationYear}</span>}
          {student.gpa && <span>GPA: {student.gpa}</span>}
        </div>
      </div>

      {/* Overdue alert */}
      {progress.overdueTasks > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded mb-8 text-[13.5px]"
          style={{ border: '1px solid var(--alert)', color: 'var(--alert)' }}
        >
          <span>—</span>
          <span>
            {progress.overdueTasks} overdue {progress.overdueTasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div
        className="mb-10"
        style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: '22px 0' }}
      >
        <div className="flex justify-between mb-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--muted)' }}>
            Application progress
          </span>
          <span className="font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
            {progress.completedTasks} of {progress.totalTasks} complete
          </span>
        </div>

        <div className="flex gap-[3px] mb-3">
          {Array.from({ length: Math.min(total, 40) }).map((_, i) => {
            const completedCount   = Math.round((progress.completedTasks / total) * Math.min(total, 40));
            const inProgressCount  = Math.round((progress.inProgressTasks / total) * Math.min(total, 40));
            let bg = 'var(--hairline)';
            let opacity = 0.6;
            if (i < completedCount) { bg = 'var(--ink)'; opacity = 1; }
            else if (i < completedCount + inProgressCount) { bg = 'var(--accent)'; opacity = 1; }
            return <div key={i} style={{ flex: 1, height: 18, background: bg, opacity }} />;
          })}
        </div>

        <div className="flex gap-6 text-[12px]" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--ink)' }} />
            Complete ({progress.completedTasks})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
            In progress ({progress.inProgressTasks})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--hairline)', outline: '1px solid var(--hairline)' }} />
            Not started ({Math.max(0, progress.totalTasks - progress.completedTasks - progress.inProgressTasks)})
          </span>
          {progress.overdueTasks > 0 && (
            <span className="flex items-center gap-1.5" style={{ color: 'var(--alert)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--alert)' }} />
              Overdue ({progress.overdueTasks})
            </span>
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid gap-14" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Upcoming deadlines */}
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3 mb-4" style={{ color: 'var(--muted)' }}>
            <span style={{ color: 'var(--ink)' }}>i</span>
            <span>Up next</span>
          </div>

          {progress.upcomingDeadlines.length === 0 ? (
            <div
              className="py-4 text-[13.5px]"
              style={{ borderTop: '1px solid var(--hairline)', color: 'var(--muted)' }}
            >
              No upcoming deadlines
            </div>
          ) : (
            progress.upcomingDeadlines.map((task: any, i: number) => (
              <div
                key={task.id}
                className="grid gap-4 items-baseline py-[14px]"
                style={{
                  gridTemplateColumns: '64px 1fr',
                  borderTop: i === 0 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                <div>
                  <div className="font-mono text-[10.5px]" style={{ color: 'var(--muted)' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short' }) : '—'}
                  </div>
                  <div className="font-serif text-[19px] tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                    {task.dueDate ? formatShortDate(task.dueDate) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[14.5px] mb-1.5" style={{ color: 'var(--ink)' }}>{task.title}</div>
                  <span
                    className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full border"
                    style={{ color: 'var(--ink-2)', borderColor: 'var(--hairline)' }}
                  >
                    {task.category?.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Essay status + at-a-glance */}
        <div className="flex flex-col gap-9">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3 mb-4" style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--ink)' }}>ii</span>
              <span>Essays</span>
            </div>

            {[
              { label: 'Total',     value: progress.essayProgress.total },
              { label: 'Draft',     value: progress.essayProgress.draft },
              { label: 'In review', value: progress.essayProgress.inReview + progress.essayProgress.revised },
              { label: 'Final',     value: progress.essayProgress.final },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex justify-between items-baseline py-3"
                style={{
                  borderTop: i === 0 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                <span className="text-[13.5px]" style={{ color: 'var(--ink-2)' }}>{row.label}</span>
                <span className="font-serif text-[22px] tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3 mb-4" style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--ink)' }}>iii</span>
              <span>At a glance</span>
            </div>
            <div style={{ border: '1px solid var(--hairline)' }}>
              {[
                { l: 'Total tasks',      v: progress.totalTasks.toString() },
                { l: 'Completed',        v: progress.completedTasks.toString() },
                { l: 'In progress',      v: progress.inProgressTasks.toString() },
                { l: 'Overall progress', v: `${completionPct}%` },
              ].map((c, i) => (
                <div
                  key={c.l}
                  className="px-[18px] py-4 flex items-baseline justify-between"
                  style={{ borderBottom: i < 3 ? '1px solid var(--hairline)' : 'none' }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--muted)' }}>
                    {c.l}
                  </div>
                  <div className="font-serif text-[26px] tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
                    {c.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Essays list */}
      {progress.essays.length > 0 && (
        <div className="mt-14">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3 mb-4" style={{ color: 'var(--muted)' }}>
            <span style={{ color: 'var(--ink)' }}>iv</span>
            <span>Essay details</span>
          </div>
          <div style={{ border: '1px solid var(--hairline)' }}>
            {progress.essays.map((essay: any, i: number) => (
              <div
                key={essay.id}
                className="px-5 py-4 flex items-center justify-between gap-4"
                style={{ borderBottom: i < progress.essays.length - 1 ? '1px solid var(--hairline)' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] mb-1" style={{ color: 'var(--ink)' }}>{essay.title}</div>
                  <div className="flex gap-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                    {essay.schoolName && <span>{essay.schoolName}</span>}
                    {essay.dueDate && <span>{formatShortDate(essay.dueDate)}</span>}
                    <span>{essay.wordCount} words</span>
                  </div>
                </div>
                <span className={clsx('badge shrink-0', essayStatusBadge[essay.status] ?? 'badge-info')}>
                  {essay.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
