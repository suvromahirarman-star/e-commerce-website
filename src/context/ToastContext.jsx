import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Floating Animated Toast Container */}
      <aside
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border text-sm font-medium ${
                toast.type === 'success'
                  ? 'bg-neutral-900 text-white border-neutral-800'
                  : toast.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-800'
                  : 'bg-neutral-800 text-neutral-100 border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                {toast.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                {toast.type === 'info' && (
                  <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
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
