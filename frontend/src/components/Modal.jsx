import { useState } from 'react';

export function Modal({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {message && <p className="modal-message">{message}</p>}
        <div className="modal-actions">
          <button className="btn secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={danger ? 'btn danger' : 'btn primary'} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useModal() {
  const [state, setState] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });

  const openModal = ({ title, message, onConfirm, danger = false }) => {
    setState({ open: true, title, message, onConfirm, danger });
  };

  const closeModal = () => {
    setState((s) => ({ ...s, open: false }));
  };

  const confirm = () => {
    state.onConfirm?.();
    closeModal();
  };

  return { ...state, openModal, closeModal, confirm };
}
