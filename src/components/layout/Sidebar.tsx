'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  href: string;
}

interface SidebarProps {
  navItems: NavItem[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    graduationYear?: number;
  };
}

const Mark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
    <path d="M12 3.5 L13.6 11 L20 12 L13.6 13 L12 20.5 L10.4 13 L4 12 L10.4 11 Z" fill="var(--ink)" />
  </svg>
);

export function Sidebar({ navItems, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const roleLabel: Record<string, string> = {
    STUDENT: 'Student',
    PARENT: 'Parent',
    ADMIN: 'Admin',
  };

  const roleSubLabel = () => {
    if (!user) return null;
    if (user.role === 'STUDENT' && user.graduationYear) return `Class of ${user.graduationYear}`;
    if (user.role === 'PARENT') return 'Parent account';
    return roleLabel[user.role] ?? user.role;
  };

  return (
    <aside
      className="w-[var(--sidebar-width)] shrink-0 flex flex-col"
      style={{ background: 'var(--paper)', borderRight: '1px solid var(--hairline)' }}
    >
      {/* Logo */}
      <div
        className="px-[22px] py-[22px]"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Mark size={20} />
          <span
            className="font-serif text-[19px] tracking-[-0.01em]"
            style={{ color: 'var(--ink)', fontWeight: 400 }}
          >
            Guidepost
          </span>
        </Link>
      </div>

      {/* Role label + nav */}
      <div className="px-4 pt-5 pb-2">
        {user && (
          <div
            className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3 pl-2.5"
            style={{ color: 'var(--muted)' }}
          >
            {roleLabel[user.role] ?? user.role} · {user.firstName}
          </div>
        )}

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center px-2.5 py-2 rounded text-[13.5px] transition-all duration-150',
                  isActive
                    ? 'text-paper bg-ink'
                    : 'text-ink-2 hover:bg-hairline hover:text-ink'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="h-rule mx-4 my-4" />

      {/* User footer */}
      {user && (
        <div
          className="mt-auto px-4 py-4"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-serif text-[13px] italic"
              style={{ background: 'var(--accent)', color: 'var(--paper)' }}
            >
              {user.firstName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] truncate" style={{ color: 'var(--ink)' }}>
                {user.firstName} {user.lastName}
              </div>
              <div
                className="font-mono text-[10.5px] truncate"
                style={{ color: 'var(--muted)' }}
              >
                {roleSubLabel()}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left text-[12.5px] px-2.5 py-1.5 rounded transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--alert)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}

// Student navigation
export const studentNavItems: NavItem[] = [
  { name: 'Overview',   href: '/student/dashboard' },
  { name: 'Tasks',      href: '/student/tasks' },
  { name: 'Essays',     href: '/student/essays' },
  { name: 'Timeline',   href: '/student/timeline' },
];

// Parent navigation
export const parentNavItems: NavItem[] = [
  { name: 'Overview',          href: '/parent/dashboard' },
  { name: 'Financial Aid',     href: '/parent/financial-aid' },
  { name: 'Budgets',           href: '/parent/budgets' },
  { name: 'Student Progress',  href: '/parent/student-progress' },
];
