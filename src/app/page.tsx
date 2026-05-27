import Link from 'next/link';

const Mark = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
    <path d="M12 3.5 L13.6 11 L20 12 L13.6 13 L12 20.5 L10.4 13 L4 12 L10.4 11 Z" fill="var(--ink)" />
  </svg>
);

const Logotype = ({ small = false }: { small?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <Mark />
    <span
      className="font-serif tracking-[-0.01em]"
      style={{ fontSize: small ? 14 : 19, color: 'var(--ink)', fontWeight: 400 }}
    >
      Guidepost
    </span>
  </div>
);

const SectionLabel = ({ number, children }: { number: string; children: React.ReactNode }) => (
  <div
    className="font-mono text-[11px] uppercase tracking-[0.12em] flex items-center gap-3"
    style={{ color: 'var(--muted)' }}
  >
    <span style={{ color: 'var(--ink)' }}>{number}</span>
    <span>{children}</span>
  </div>
);

export default function HomePage() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>

      {/* Top nav */}
      <header
        className="flex items-center justify-between px-14 py-[22px]"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Logotype />
        <nav className="hidden md:flex gap-8 text-[13.5px]" style={{ color: 'var(--ink-2)' }}>
          <Link href="/explore/students">For students</Link>
          <Link href="/explore/parents">For parents</Link>
          <a href="#features">Timeline</a>
        </nav>
        <div className="flex gap-4 items-center">
          <Link
            href="/auth/login"
            className="text-[13.5px]"
            style={{ color: 'var(--ink-2)' }}
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="text-[13px] px-4 py-2 rounded-full"
            style={{ background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '-0.005em' }}
          >
            Create account →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="px-14 pt-20 pb-16"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <h1
          className="font-serif font-normal m-0 max-w-[960px]"
          style={{
            fontSize: 'clamp(52px, 7vw, 88px)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
          }}
        >
          College planning,
          <br />
          <span className="italic" style={{ color: 'var(--muted)' }}>
            all in one place.
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-16 mt-14 md:items-end">
          <p
            className="text-[16.5px] leading-[1.55] max-w-[460px] m-0"
            style={{ color: 'var(--ink-2)' }}
          >
            Track tasks and deadlines, write and revise your essays, manage financial
            aid — for students and parents, in one shared workspace.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/auth/register"
              className="text-[14px] px-[22px] py-[13px] rounded-full"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              Start with sophomore year →
            </Link>
            <Link
              href="/explore/students"
              className="text-[14px] px-[22px] py-[13px] rounded-full"
              style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)' }}
            >
              Tour the platform
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section
        id="features"
        className="px-14 py-16"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="flex justify-between items-baseline mb-10">
          <SectionLabel number="02">What&apos;s inside</SectionLabel>
          <span className="font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
            Five modules · one workspace
          </span>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            borderTop: '1px solid var(--hairline)',
            borderLeft: '1px solid var(--hairline)',
          }}
        >
          {[
            {
              n: 'i.',
              t: 'Application tracker',
              d: 'Every school, every supplement, every deadline in one chronological view.',
            },
            {
              n: 'ii.',
              t: 'Essay workshop',
              d: 'Drafting space with version history and structured AI feedback when you want it.',
            },
            {
              n: 'iii.',
              t: 'Financial aid',
              d: 'FAFSA and CSS deadlines, net price modelling, side-by-side award comparison.',
            },
            {
              n: 'iv.',
              t: 'Four-year timeline',
              d: 'A grade-by-grade roadmap from tenth-grade course planning through decision day.',
            },
            {
              n: 'v.',
              t: 'Parent companion',
              d: 'A linked, read-mostly view for parents — informed without being intrusive.',
            },
            {
              n: 'vi.',
              t: 'Counselor handoff',
              d: 'Export summaries to share with school counselors and advisors. Coming soon.',
            },
          ].map((f) => (
            <div
              key={f.t}
              className="px-7 py-8 min-h-[200px]"
              style={{ borderRight: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}
            >
              <div
                className="font-serif italic text-[22px] mb-[18px]"
                style={{ color: 'var(--muted)' }}
              >
                {f.n}
              </div>
              <div
                className="text-[17px] mb-2.5"
                style={{ color: 'var(--ink)', letterSpacing: '-0.005em' }}
              >
                {f.t}
              </div>
              <div
                className="text-[13.5px] leading-[1.55]"
                style={{ color: 'var(--ink-2)' }}
              >
                {f.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account vs preview */}
      <section
        className="px-14 py-16 flex flex-col md:flex-row gap-16"
      >
        <div className="md:w-[280px] shrink-0">
          <SectionLabel number="03" >Account vs. preview</SectionLabel>
          <h3
            className="font-serif font-normal mt-4 mb-0"
            style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.015em' }}
          >
            Look around before
            <br />
            <span className="italic" style={{ color: 'var(--muted)' }}>signing up.</span>
          </h3>
        </div>

        <div
          className="flex-1 grid grid-cols-1 md:grid-cols-2"
          style={{ border: '1px solid var(--hairline)' }}
        >
          {/* Preview */}
          <div className="p-8" style={{ borderRight: '1px solid var(--hairline)' }}>
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-1 rounded-full"
              style={{ border: '1px solid var(--hairline)', color: 'var(--ink-2)' }}
            >
              Preview · no account
            </span>
            <ul className="mt-5 space-y-2.5 list-none p-0">
              {[
                'Sample student & parent workspaces',
                'Browse the timeline & essay surface',
                'Read-only — nothing is saved',
              ].map((x) => (
                <li key={x} className="flex gap-2.5 text-[13.5px]" style={{ color: 'var(--ink-2)' }}>
                  <span style={{ color: 'var(--muted)' }}>—</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="p-8" style={{ background: 'var(--accent-soft)' }}>
            <span
              className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-1 rounded-full"
              style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
            >
              Free account
            </span>
            <ul className="mt-5 space-y-2.5 list-none p-0">
              {[
                'Save your own tasks, essays, schools',
                'Structured AI feedback on every draft',
                'Parent companion view, linked to yours',
                'Award letter comparison & net price modelling',
              ].map((x) => (
                <li key={x} className="flex gap-2.5 text-[13.5px]" style={{ color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--accent)' }}>+</span>
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/auth/register"
                className="text-[13px] px-4 py-2 rounded-full inline-block"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Create free account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px]"
        style={{ borderTop: '1px solid var(--hairline)', color: 'var(--muted)' }}
      >
        <Logotype small />
        <div className="flex gap-6">
          <Link href="/explore/students" className="hover:text-ink transition-colors">Students</Link>
          <Link href="/explore/parents" className="hover:text-ink transition-colors">Parents</Link>
          <Link href="/auth/login" className="hover:text-ink transition-colors">Log in</Link>
        </div>
        <span className="font-mono text-[11px]">MMXXVI · ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  );
}
