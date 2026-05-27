import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  className,
  id,
  value,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {showCharCount && maxLength && (
          <span className={clsx('text-xs', currentLength > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-400')}>
            {currentLength.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        maxLength={maxLength}
        value={value}
        className={clsx(
          'block w-full px-3 py-2 text-sm bg-white border rounded-lg placeholder-gray-400 transition-colors resize-y',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'hover:border-gray-300',
          error ? 'border-red-400 bg-red-50/40' : 'border-gray-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
