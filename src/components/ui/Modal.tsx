'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-ink/30" onClick={onClose} />

      {/* Panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative w-full rounded border border-hairline animate-slide-in',
            sizeClasses[size]
          )}
          style={{ background: 'var(--paper)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              {title && (
                <h3 className="text-[15px] font-medium tracking-tight" style={{ color: 'var(--ink)' }}>
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto p-1 rounded transition-colors"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx('flex items-center justify-end gap-3 pt-4 mt-2', className)}
      style={{ borderTop: '1px solid var(--hairline)' }}
    >
      {children}
    </div>
  );
}
