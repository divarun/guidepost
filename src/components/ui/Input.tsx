import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium" style={{ color: 'var(--ink-2)' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'block w-full px-3 py-2 text-sm rounded border transition-colors',
          'placeholder-muted',
          'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
          error
            ? 'border-alert/60'
            : 'border-hairline hover:border-ink-2/40',
          className
        )}
        style={{ background: 'var(--paper)', color: 'var(--ink)' }}
        {...props}
      />
      {error && (
        <p className="text-xs" style={{ color: 'var(--alert)' }}>{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{helperText}</p>
      )}
    </div>
  );
}
