import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddingStyles = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  return (
    <div
      className={clsx(
        'rounded border border-hairline',
        hover && 'transition-colors hover:border-ink-2/40',
        paddingStyles[padding],
        className
      )}
      style={{ background: 'var(--paper)' }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={clsx('mb-5', className)}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-base font-medium tracking-tight', className)} style={{ color: 'var(--ink)' }}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
