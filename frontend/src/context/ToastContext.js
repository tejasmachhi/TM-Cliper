'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, ExternalLink } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, link, duration = 4000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, type, title, message, link };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (message, title = 'Success', link = null) =>
      showToast({ type: 'success', title, message, link }),
    error: (message, title = 'Error') =>
      showToast({ type: 'error', title, message, duration: 6000 }),
    warning: (message, title = 'Warning') =>
      showToast({ type: 'warning', title, message, duration: 5000 }),
    info: (message, title = 'Notice') =>
      showToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const accentColor = isSuccess ? '#22c55e' : isError ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6';
          const bgColor = 'var(--bg-card, #ffffff)';
          const borderColor = isSuccess ? 'rgba(34, 197, 94, 0.4)' : isError ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color, #e2e8f0)';

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bgColor,
                border: `1.5px solid ${borderColor}`,
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'slideInRight 0.25s ease-out forwards',
                backdropFilter: 'blur(8px)',
                color: 'var(--text-primary, #0f172a)'
              }}
            >
              <div style={{ color: accentColor, marginTop: '2px', flexShrink: 0 }}>
                {isSuccess && <CheckCircle2 size={18} />}
                {isError && <AlertTriangle size={18} />}
                {isWarning && <AlertCircle size={18} />}
                {!isSuccess && !isError && !isWarning && <Info size={18} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px', color: 'var(--text-primary, #0f172a)' }}>
                    {t.title}
                  </div>
                )}
                {t.message && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', lineHeight: '1.4' }}>
                    {t.message}
                  </div>
                )}
                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: accentColor,
                      marginTop: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Open Link</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  flexShrink: 0
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
