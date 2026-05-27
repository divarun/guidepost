'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const Mark = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
    <path d="M12 3.5 L13.6 11 L20 12 L13.6 13 L12 20.5 L10.4 13 L4 12 L10.4 11 Z" fill="var(--ink)" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (data.user.role === 'PARENT') {
        router.push('/parent/dashboard');
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--paper)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <Mark />
            <span
              className="font-serif text-[19px] tracking-[-0.01em]"
              style={{ color: 'var(--ink)', fontWeight: 400 }}
            >
              Guidepost
            </span>
          </Link>
          <h2
            className="text-[22px] font-serif font-normal"
            style={{ color: 'var(--ink)', letterSpacing: '-0.015em' }}
          >
            Welcome back
          </h2>
          <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted)' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="underline underline-offset-2"
              style={{ color: 'var(--ink)' }}
            >
              Sign up free
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="px-4 py-3 rounded text-sm border"
                style={{ background: 'transparent', borderColor: 'var(--alert)', color: 'var(--alert)' }}
              >
                {error}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="h-rule mb-5" />
            <div
              className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3"
              style={{ color: 'var(--muted)' }}
            >
              Demo accounts
            </div>
            <div className="space-y-2 text-sm">
              <div
                className="p-3 rounded border text-[12.5px]"
                style={{ background: 'var(--surface)', borderColor: 'var(--hairline)' }}
              >
                <div className="font-medium" style={{ color: 'var(--ink)' }}>Student</div>
                <div className="mt-0.5 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
                  student1@example.com / password123
                </div>
              </div>
              <div
                className="p-3 rounded border text-[12.5px]"
                style={{ background: 'var(--surface)', borderColor: 'var(--hairline)' }}
              >
                <div className="font-medium" style={{ color: 'var(--ink)' }}>Parent</div>
                <div className="mt-0.5 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
                  parent1@example.com / password123
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
