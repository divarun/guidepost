'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar, studentNavItems } from '@/components/layout/Sidebar';
import { Loading } from '@/components/ui/Spinner';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || data.user.role !== 'STUDENT') {
          router.push('/auth/login');
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        router.push('/auth/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar navItems={studentNavItems} />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}