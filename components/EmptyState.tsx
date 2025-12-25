
import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <div className="py-24 flex flex-col items-center justify-center text-center px-6 bg-gray-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800/50">
    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-8 shadow-2xl shadow-indigo-500/10 border border-gray-100 dark:border-slate-700 animate-in zoom-in duration-500">
      {icon || <Inbox size={48} />}
    </div>
    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium mb-8">{description}</p>
    {action && <div className="animate-in slide-in-from-bottom-2 duration-700">{action}</div>}
  </div>
);
