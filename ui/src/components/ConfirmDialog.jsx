import React, { useEffect, useRef } from "react";

/** Basit, erişilebilir onay modalı – modern uyarı kartı ile */
export default function ConfirmDialog({
  open,
  title = "Emin misiniz?",
  message = "Bu işlem geri alınamaz.",
  confirmText = "Tamam",
  cancelText = "İptal",
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", onKey);
    setTimeout(() => confirmBtnRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay")) onCancel?.();
      }}
    >
      <div className="modal-card confirm-card" role="document">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel} aria-label="Kapat">×</button>
        </div>

        <div className="modal-body">
          {/* Modern uyarı kutusu */}
          <div className="warning-box">
            <div className="warning-icon">!</div>
            <div className="warning-content">
              <div className="warning-title">Bu işlem geri alınamaz</div>
              <div className="warning-text">
                {message}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button ref={confirmBtnRef} className="btn-danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
