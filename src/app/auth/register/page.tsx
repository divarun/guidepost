'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const Mark = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
    <path d="M12 3.5 L13.6 11 L20 12 L13.6 13 L12 20.5 L10.4 13 L4 12 L10.4 11 Z" fill="var(--ink)" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT' as 'STUDENT' | 'PARENT',
    graduationYear: new Date().getFullYear() + 1,
    gpa: '',
    studentEmail: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.role === 'PARENT' && !formData.studentEmail) {
      setError('Student email is required for parent accounts');
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      };

      if (formData.role === 'STUDENT') {
        payload.graduationYear = formData.graduationYear;
        if (formData.gpa) {
          payload.gpa = parseFloat(formData.gpa);
        }
      } else if (formData.role === 'PARENT') {
        payload.studentEmail = formData.studentEmail;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (data.user.role === 'PARENT') {
        router.push('/parent/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'PARENT', label: 'Parent' },
  ];

  const graduationYearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--paper)' }}
    >
      <div className="w-full max-w-md">
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
            Create your account
          </h2>
          <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="underline underline-offset-2"
              style={{ color: 'var(--ink)' }}
            >
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="px-4 py-3 rounded text-sm border"
                style={{ borderColor: 'var(--alert)', color: 'var(--alert)' }}
              >
                {error}
              </div>
            )}

            <Select
              label="I am a..."
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              options={roleOptions}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                placeholder="John"
              />
              <Input
                label="Last name"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />

            {formData.role === 'STUDENT' && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Graduation year"
                  value={formData.graduationYear.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, graduationYear: parseInt(e.target.value) })
                  }
                  options={graduationYearOptions}
                  required
                />
                <Input
                  label="GPA (optional)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
            )}

            {formData.role === 'PARENT' && (
              <Input
                label="Student's email address"
                type="email"
                value={formData.studentEmail}
                onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                required
                placeholder="student@example.com"
                helperText="Enter your student's email to link accounts"
              />
            )}

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              helperText="At least 8 characters with uppercase, lowercase, and a number"
            />

            <Input
              label="Confirm password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
