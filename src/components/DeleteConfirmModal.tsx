import React from 'react';
import './DeleteConfirmModal.css';
import { X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  itemName: string;
  warning?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  message,
  itemName,
  warning
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal-content">
        <div className="delete-modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="delete-modal-body">
          <div className="trash-icon-circle">
            <Trash2 size={32} color="#ef5350" />
          </div>
          <p className="delete-main-text">
            {message}
          </p>
          <h3 className="delete-item-name">{itemName} ?</h3>
          {warning && <div className="delete-warning-box">{warning}</div>}
        </div>

        <div className="delete-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};
