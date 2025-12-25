
import React from 'react';

interface StatusBadgeProps {
  status: string | boolean;
  type?: 'boolean' | 'lead' | 'post';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'boolean' }) => {
  const getStyles = () => {
    if (type === 'boolean') {
      return status 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400';
    }
    
    switch (status) {
      case 'new': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
      case 'contacted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'closed': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'published': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'draft': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getLabel = () => {
    if (type === 'boolean') return status ? 'Enabled' : 'Disabled';
    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};
