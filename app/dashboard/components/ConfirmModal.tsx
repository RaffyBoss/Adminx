
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-600 shadow-xl shadow-red-100' : 'bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-100'}`}>
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200/50' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/50'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
