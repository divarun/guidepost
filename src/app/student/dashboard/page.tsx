'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Loading } from '@/components/ui/Spinner';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

export default function StudentDashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProgress(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!progress) return (
    <div className="p-8 text-[14px]" style={{ color: 'var(--muted)' }}>Failed to load progress data.</div>
  );

  const completionPct = getProgressPercentage(progress.completedTasks, progress.totalTasks);
  const total = progress.totalTasks || 1;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <TopBar crumbs={['Overview']} action="New task" onAction={() => router.push('/student/tasks?new=true')} />

      <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 36 }}>
          <div
            className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
            style={{ color: 'var(--muted)' }}
          >
            {today}
          </div>
          <h1
            className="font-serif font-normal m-0"
            style={{ fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1.05 }}
          >
            {greeting()}.
            <br />
            <span className="italic" style={{ color: 'var(--muted)' }}>
              You&apos;re {completionPct}% through your tasks.
            </span>
          </h1>
        </div>

        {/* Overdue alert */}
        {progress.overdueTasks > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded mb-8 text-[13.5px]"
            style={{ border: '1px solid var(--alert)', color: 'var(--alert)' }}
          >
            <span>—</span>
            <span>
              {progress.overdueTasks} overdue {progress.overdueTasks === 1 ? 'task' : 'tasks'}.{' '}
              <Link href="/student/tasks" className="underline underline-offset-2">View tasks</Link>
            </span>
          </div>
        )}

        {/* Progress meter */}
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

          {/* Segmented bar */}
          <div className="flex gap-[3px] mb-3">
            {Array.from({ length: Math.min(total, 40) }).map((_, i) => {
              const completedCount = Math.round((progress.completedTasks / total) * Math.min(total, 40));
              const inProgressCount = Math.round((progress.inProgressTasks / total) * Math.min(total, 40));
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
            <div className="flex justify-between items-baseline mb-4">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3" style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--ink)' }}>i</span>
                <span>Up next</span>
              </span>
              <Link href="/student/tasks" className="text-[12px] underline underline-offset-[3px]" style={{ color: 'var(--ink-2)' }}>
                All tasks →
              </Link>
            </div>

            <div>
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
                      gridTemplateColumns: '64px 1fr auto',
                      borderTop: i === 0 ? '1px solid var(--hairline)' : 'none',
                      borderBottom: '1px solid var(--hairline)',
                    }}
                  >
                    {/* Date column */}
                    <div>
                      <div className="font-mono text-[10.5px]" style={{ color: 'var(--muted)' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short' }) : '—'}
                      </div>
                      <div className="font-serif text-[19px] tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                        {task.dueDate ? formatShortDate(task.dueDate) : '—'}
                      </div>
                    </div>

                    {/* Task info */}
                    <div>
                      <div className="text-[14.5px] mb-1.5 tracking-[-0.005em]" style={{ color: 'var(--ink)' }}>
                        {task.title}
                      </div>
                      <span
                        className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full border"
                        style={{ color: 'var(--ink-2)', borderColor: 'var(--hairline)' }}
                      >
                        {task.category?.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ border: '1.5px solid var(--hairline)' }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Essay progress */}
          <div className="flex flex-col gap-9">
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3" style={{ color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--ink)' }}>ii</span>
                  <span>Essays in progress</span>
                </span>
                <Link href="/student/essays" className="text-[12px] underline underline-offset-[3px]" style={{ color: 'var(--ink-2)' }}>
                  Open editor →
                </Link>
              </div>

              <div>
                {[
                  { label: 'Total', value: progress.essayProgress.total, suffix: null },
                  { label: 'Draft', value: progress.essayProgress.draft, suffix: null },
                  { label: 'In review', value: progress.essayProgress.inReview, suffix: null },
                  { label: 'Final', value: progress.essayProgress.final, suffix: null },
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
            </div>

            {/* At-a-glance grid */}
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] flex items-center gap-3 mb-4" style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--ink)' }}>iii</span>
                <span>At a glance</span>
              </div>
              <div style={{ border: '1px solid var(--hairline)' }}>
                {[
                  { l: 'Total tasks', v: progress.totalTasks.toString() },
                  { l: 'Completed', v: progress.completedTasks.toString() },
                  { l: 'In progress', v: progress.inProgressTasks.toString() },
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
      </div>
    </>
  );
}
