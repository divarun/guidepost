'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/Card';
import { studentTimeline } from '@/lib/constants/timelineData';

export default function StudentTimelinePage() {
  return (
    <>
      <TopBar crumbs={['Timeline']} />

      <div className="flex-1 overflow-auto" style={{ padding: '40px 48px 64px' }}>
        <div className="mb-8">
          <p className="text-[13.5px]" style={{ color: 'var(--muted)' }}>
            A grade-by-grade guide through the college application process.
            Timing is approximate — verify deadlines with each school.
          </p>
        </div>

        <div className="space-y-4">
          {studentTimeline.map((event, index) => (
            <Card key={index}>
              <CardContent className="py-5">
                <div className="flex gap-5">
                  {/* Step number */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px]"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--muted)' }}>
                      {event.grade}
                    </div>
                    <h3 className="text-[15px] mb-1" style={{ color: 'var(--ink)' }}>
                      {event.season}: {event.title}
                    </h3>
                    <p className="text-[13px] mb-3" style={{ color: 'var(--ink-2)' }}>
                      {event.description}
                    </p>

                    <ul className="space-y-1.5">
                      {event.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--ink-2)' }}>
                          <span className="mt-[3px] shrink-0" style={{ color: 'var(--accent)' }}>—</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className="mt-8 p-5 rounded text-[13px]"
          style={{ border: '1px solid var(--hairline)', color: 'var(--muted)' }}
        >
          Every student's path is different. Use this as a reference, not a rulebook.
          Requirements vary by school — always verify with your counselor and each institution.
        </div>
      </div>
    </>
  );
}
