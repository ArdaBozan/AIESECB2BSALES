'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="confirm-modal__overlay" onClick={onClose} />
      <div className={`confirm-modal confirm-modal--${type}`}>
        <div className="confirm-modal__header">
          <div className={`confirm-modal__icon confirm-modal__icon--${type}`}>
            <AlertTriangle />
          </div>
          <button className="confirm-modal__close" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="confirm-modal__content">
          <h2 className="confirm-modal__title">{title}</h2>
          <p className="confirm-modal__message">{message}</p>
        </div>
        <div className="confirm-modal__actions">
          <button 
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal__btn confirm-modal__btn--${type}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
