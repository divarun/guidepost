'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const dotColor: Record<ToastType, string> = {
    success: 'var(--accent)',
    error:   'var(--alert)',
    warning: '#C4820A',
    info:    'var(--muted)',
  };

  return (
    <div
      className={clsx(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded border animate-slide-in',
        'min-w-[280px] max-w-sm text-sm'
      )}
      style={{ background: 'var(--ink)', borderColor: 'var(--ink-2)', color: 'var(--paper)' }}
    >
      <span
        className="h-2 w-2 rounded-full flex-shrink-0"
        style={{ background: dotColor[toast.type] }}
      />
      <p className="flex-1 leading-snug font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="transition-opacity opacity-50 hover:opacity-100"
        style={{ color: 'var(--paper)' }}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
