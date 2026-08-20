import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(null);

const TONE_CONFIG = {
  success: { icon: CheckCircle2, className: "text-verified" },
  error: { icon: AlertCircle, className: "text-red-400" },
};

let nextId = 0;

/**
 * Minimal, dependency-free toast system. Used for transient confirmations
 * (upload success, deletion, research created) and background errors
 * (auth, chat) that happen alongside — not instead of — any inline
 * error state already shown in the form/panel itself.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, tone = "success", duration = 4000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, tone }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, className } =
              TONE_CONFIG[toast.tone] || TONE_CONFIG.success;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                role="status"
                className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-md border border-line bg-surface-overlay px-4 py-3 shadow-xl"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${className}`} />
                <p className="flex-1 text-sm text-ink-100">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-ink-700 hover:text-ink-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
