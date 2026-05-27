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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="font-mono text-[11px] uppercase tracking-[0.12em]"
    style={{ color: 'var(--muted)' }}
  >
    {children}
  </div>
);

export default function HomePage() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>

      {/* Top nav */}
      <header
        className="flex items-center justify-between px-5 md:px-14 py-[22px]"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Logotype />
        <nav className="hidden md:flex gap-8 text-[13.5px]" style={{ color: 'var(--ink-2)' }}>
          <Link href="/explore/students">For students</Link>
          <Link href="/explore/parents">For parents</Link>
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
        className="px-5 md:px-14 pt-10 md:pt-20 pb-10 md:pb-16"
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

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mt-8 md:mt-14 md:items-end">
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
              Get started →
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
        className="px-5 md:px-14 py-16"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="mb-10">
          <SectionLabel>What&apos;s inside</SectionLabel>
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
              t: 'Task tracker',
              d: 'Tasks and deadlines organized by category, with priorities and due dates.',
            },
            {
              n: 'ii.',
              t: 'Essay workshop',
              d: 'Write and revise essays with version history and AI feedback on demand.',
            },
            {
              n: 'iii.',
              t: 'Financial aid',
              d: 'Track FAFSA and CSS deadlines, compare net costs across schools.',
            },
            {
              n: 'iv.',
              t: 'Four-year timeline',
              d: 'A grade-by-grade guide from sophomore year through decision day.',
            },
            {
              n: 'v.',
              t: 'Parent view',
              d: 'A separate account for parents to track student progress and manage financial aid.',
            },
            {
              n: 'vi.',
              t: 'Counselor export',
              d: 'Export summaries to share with school counselors and advisors. Coming soon.',
            },
          ].map((f) => (
            <div
              key={f.t}
              className="px-4 py-6 md:px-7 md:py-8 min-h-[160px] md:min-h-[200px]"
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
        className="px-5 md:px-14 py-16 flex flex-col md:flex-row gap-16"
      >
        <div className="md:w-[280px] shrink-0">
          <SectionLabel>Preview vs. account</SectionLabel>
          <h3
            className="font-serif font-normal mt-4 mb-0"
            style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.015em' }}
          >
            Look around
            <br />
            <span className="italic" style={{ color: 'var(--muted)' }}>before signing up.</span>
          </h3>
        </div>

        <div
          className="flex-1 grid grid-cols-1 md:grid-cols-2"
          style={{ border: '1px solid var(--hairline)' }}
        >
          {/* Preview */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--hairline)' }}>
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
          <div className="p-6 md:p-8" style={{ background: 'var(--accent-soft)' }}>
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
        className="px-5 md:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px]"
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
