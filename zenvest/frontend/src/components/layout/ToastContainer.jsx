import React from 'react';

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" id="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
