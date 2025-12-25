
import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => (
  <div className="py-24 flex flex-col items-center justify-center text-center px-6 bg-gray-50/30 dark:bg-slate-900/30 rounded-[2.5rem]">
    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-gray-300 dark:text-slate-600 mb-8 shadow-sm border border-gray-100 dark:border-slate-700">
      {icon || <Inbox size={48} />}
    </div>
    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">{description}</p>
  </div>
);
