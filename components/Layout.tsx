
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIHelperPanel } from './AIHelperPanel';
import { UserRole } from '../types';
import { MOCK_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = MOCK_USER; // In real app, this would come from Auth Context

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const canAccessAI = ['editor', 'admin', 'owner'].includes(user.role);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} role={user.role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          user={user}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {canAccessAI && <AIHelperPanel />}
    </div>
  );
};
