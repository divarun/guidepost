import React from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, helperText, className, id, options, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-[13px] font-medium" style={{ color: 'var(--ink-2)' }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'block w-full px-3 py-2 text-sm rounded border transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
          'hover:border-ink-2/40 appearance-none cursor-pointer',
          error ? 'border-alert/60' : 'border-hairline',
          className
        )}
        style={{
          background: 'var(--paper)',
          color: 'var(--ink)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%237E8475' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          backgroundSize: '16px',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs" style={{ color: 'var(--alert)' }}>{error}</p>}
      {helperText && !error && <p className="text-xs" style={{ color: 'var(--muted)' }}>{helperText}</p>}
    </div>
  );
}
