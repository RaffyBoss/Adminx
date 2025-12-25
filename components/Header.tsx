
import React from 'react';
import { Menu, Sun, Moon, Bell, Search, LogOut } from 'lucide-react';
import { User } from '../types';
// Next.js equivalent
// import { useRouter } from 'next/navigation';
import { useNavigate as useRouter } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleDarkMode, user }) => {
  const router = useRouter();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 md:px-8 flex items-center justify-between z-30 sticky top-0 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search commands (⌘K)" 
            className="pl-11 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400 transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400 relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden lg:block text-right">
            <div className="text-sm font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{user.name}</div>
            <div className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{user.role}</div>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-xl border border-gray-100 dark:border-slate-600 shadow-sm"
          />
          <button 
            onClick={() => router('/login')}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors rounded-xl"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
