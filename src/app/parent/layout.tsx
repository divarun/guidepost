'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, parentNavItems } from '@/components/layout/Sidebar';
import { Loading } from '@/components/ui/Spinner';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || data.user.role !== 'PARENT') {
          router.push('/auth/login');
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>
      <Sidebar navItems={parentNavItems} user={user} />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden pb-14 md:pb-0">{children}</main>
    </div>
  );
}
