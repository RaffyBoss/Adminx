
import React from 'react';

interface StatusBadgeProps {
  status: string | boolean;
  type?: 'boolean' | 'lead' | 'post';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'boolean' }) => {
  const getStyles = () => {
    if (type === 'boolean') {
      return status 
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
    
    switch (status) {
      case 'new': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
      case 'contacted': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300';
      case 'closed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'published': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'draft': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getLabel = () => {
    if (type === 'boolean') return status ? 'Enabled' : 'Disabled';
    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};
