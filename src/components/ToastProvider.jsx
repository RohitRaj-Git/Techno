import { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import { ToastContext } from '../context/ToastContext';

let nextId = 0;

const ICONS = {
  success: 'checkCircle',
  error: 'alert',
  info: 'info',
  warning: 'alert',
};

function Toast({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      className={`toast toast--${toast.type} ${exiting ? 'toast--exit' : ''}`}
      role="status"
      aria-live="polite"
    >
      <Icon name={ICONS[toast.type] || 'info'} size={20} />
      <span className="toast__msg">{toast.message}</span>
      <button
        className="toast__close"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Dismiss"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-label="Notifications">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
