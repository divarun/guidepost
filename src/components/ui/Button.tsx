import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans rounded-full transition-all duration-150 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:   'bg-ink text-paper hover:bg-ink-2 active:opacity-80',
    secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper active:opacity-80',
    danger:    'bg-alert text-paper hover:opacity-90 active:opacity-80',
    ghost:     'bg-transparent text-ink-2 hover:bg-hairline hover:text-ink',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}
