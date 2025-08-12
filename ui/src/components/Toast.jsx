import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children, defaultDuration = 3000 }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((type, message, duration = defaultDuration) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, type, message }]);
    // otomatik kapat
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, [defaultDuration]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    success: (msg, ms) => add("success", msg, ms),
    error:   (msg, ms) => add("error", msg, ms),
    info:    (msg, ms) => add("info", msg, ms),
    warn:    (msg, ms) => add("warn", msg, ms),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
