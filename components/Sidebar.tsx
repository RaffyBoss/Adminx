
import React from 'react';
// Next.js equivalents would be imported here in a real project
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { Link, useLocation as usePathname } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { UserRole } from '../types';
import { ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, role }) => {
  const pathname = usePathname().pathname; // Adapting react-router to pathname mock

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(role));

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full flex flex-col z-40 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">A</div>
          <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">AdminX</span>
        </div>

        <nav className="space-y-1.5">
          {filteredNav.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isActive ? 'text-white' : 'text-indigo-500'}>
                    {item.icon}
                  </div>
                  {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">System Status</div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Online & Secure
          </div>
        </div>
      </div>
    </aside>
  );
};
