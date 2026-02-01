'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
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
        <Sidebar navItems={parentNavItems} />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}