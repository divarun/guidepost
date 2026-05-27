import Link from 'next/link';
import { mockStudentTasks, mockEssays, mockStudentProgress } from '@/lib/constants/mockData';
import { studentTimeline } from '@/lib/constants/timelineData';
import { formatShortDate, getProgressPercentage } from '@/lib/utils/formatters';

const Mark = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
    <path d="M12 3.5 L13.6 11 L20 12 L13.6 13 L12 20.5 L10.4 13 L4 12 L10.4 11 Z" fill="var(--ink)" />
  </svg>
);

const statusLabel: Record<string, string> = {
  COMPLETED: 'Done',
  IN_PROGRESS: 'In progress',
  NOT_STARTED: 'Not started',
  OVERDUE: 'Overdue',
};

const essayStatusLabel: Record<string, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In review',
  REVISED: 'Revised',
  FINAL: 'Final',
};

export default function ExploreStudentsPage() {
  const completionPercentage = getProgressPercentage(
    mockStudentProgress.completedTasks,
    mockStudentProgress.totalTasks
  );

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-5 md:px-14 py-[22px]"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-serif tracking-[-0.01em]" style={{ fontSize: 19, color: 'var(--ink)', fontWeight: 400 }}>
            Guidepost
          </span>
        </Link>
        <nav className="hidden md:flex gap-8 text-[13.5px]" style={{ color: 'var(--ink-2)' }}>
          <Link href="/explore/parents">For parents</Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link href="/auth/login" className="text-[13.5px]" style={{ color: 'var(--ink-2)' }}>
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="text-[13px] px-4 py-2 rounded-full"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Create account →
          </Link>
        </div>
      </header>

      {/* Preview notice */}
      <div
        className="px-5 md:px-14 py-3 text-[13px]"
        style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--muted)' }}
      >
        Preview — example data only. Nothing is saved.{' '}
        <Link href="/auth/register" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
          Create an account
        </Link>{' '}
        to track your own progress.
      </div>

      {/* Page title */}
      <section className="px-5 md:px-14 pt-14 pb-10" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--muted)' }}>
          Student view
        </p>
        <h1
          className="font-serif font-normal m-0"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          Application tracker
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed max-w-[480px]" style={{ color: 'var(--ink-2)' }}>
          Tasks, essays, and your four-year timeline — organized in one place.
        </p>
      </section>

      {/* Stats */}
      <section
        className="px-5 md:px-14 py-0"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderLeft: '1px solid var(--hairline)' }}
        >
          {[
            { value: `${completionPercentage}%`, label: 'Complete' },
            { value: mockStudentProgress.totalTasks, label: 'Total tasks' },
            { value: mockStudentProgress.completedTasks, label: 'Done' },
            { value: mockStudentProgress.inProgressTasks, label: 'In progress' },
          ].map((s) => (
            <div
              key={s.label}
              className="px-5 py-6 md:px-8 md:py-8"
              style={{ borderRight: '1px solid var(--hairline)' }}
            >
              <div className="font-serif" style={{ fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div className="mt-2 text-[12.5px] font-mono uppercase tracking-[0.08em]" style={{ color: 'var(--muted)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tasks */}
      <section className="px-5 md:px-14 py-12" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <h2 className="font-serif font-normal mb-6" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>
          Upcoming tasks
        </h2>
        <p className="text-[12px] mb-5" style={{ color: 'var(--muted)' }}>
          Timing shown is approximate. Verify deadlines with each school.
        </p>
        <div style={{ borderTop: '1px solid var(--hairline)' }}>
          {mockStudentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{
                    border: '1px solid var(--hairline)',
                    background: task.status === 'COMPLETED' ? 'var(--ink)' : 'transparent',
                  }}
                />
                <div>
                  <div className="text-[14px]" style={{ color: task.status === 'COMPLETED' ? 'var(--muted)' : 'var(--ink)' }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0 ml-8">
                <span className="text-[12.5px]" style={{ color: 'var(--muted)' }}>
                  {task.dueLabel ?? (task.dueDate ? formatShortDate(task.dueDate) : '')}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--muted)' }}>
                  {statusLabel[task.status] ?? task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Essays */}
      <section className="px-5 md:px-14 py-12" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <h2 className="font-serif font-normal mb-6" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>
          Essays
        </h2>
        <div style={{ borderTop: '1px solid var(--hairline)' }}>
          {mockEssays.map((essay) => (
            <div
              key={essay.id}
              className="py-5"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[14px]">{essay.title}</span>
                    <span
                      className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full"
                      style={{ border: '1px solid var(--hairline)', color: 'var(--muted)' }}
                    >
                      {essayStatusLabel[essay.status] ?? essay.status}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--ink-2)' }}>
                    {essay.prompt}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[13px]" style={{ color: 'var(--muted)' }}>{essay.schoolName}</div>
                  <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    {essay.dueLabel ?? (essay.dueDate ? formatShortDate(essay.dueDate) : '')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 md:px-14 py-12" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <h2 className="font-serif font-normal mb-8" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>
          Application timeline
        </h2>
        <div className="space-y-8">
          {studentTimeline.slice(0, 4).map((event, index) => (
            <div key={index} className="flex gap-10">
              <div className="flex-shrink-0 w-28">
                <div className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--muted)' }}>
                  {event.grade}
                </div>
                <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>{event.season}</div>
              </div>
              <div className="flex-1" style={{ borderTop: '1px solid var(--hairline)', paddingTop: 2 }}>
                <div className="text-[14px] mb-1">{event.title}</div>
                <p className="text-[13px] leading-relaxed mb-3 m-0" style={{ color: 'var(--ink-2)' }}>
                  {event.description}
                </p>
                <ul className="m-0 p-0 space-y-1">
                  {event.tasks.slice(0, 3).map((task, idx) => (
                    <li key={idx} className="flex gap-2 text-[13px]" style={{ color: 'var(--muted)', listStyle: 'none' }}>
                      <span>—</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-14 py-16">
        <h2 className="font-serif font-normal mb-4" style={{ fontSize: 32, letterSpacing: '-0.015em' }}>
          Ready to start?
        </h2>
        <p className="text-[15px] mb-8 max-w-[400px]" style={{ color: 'var(--ink-2)' }}>
          Create a free account and track your own tasks, essays, and deadlines.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/auth/register"
            className="text-[14px] px-[22px] py-[13px] rounded-full"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Create student account →
          </Link>
          <Link
            href="/auth/login"
            className="text-[14px] px-[22px] py-[13px] rounded-full"
            style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}
          >
            Log in
          </Link>
        </div>
      </section>

    </div>
  );
}
