
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
