
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar.tsx';
import { Header } from '../../components/Header.tsx';
import { AIHelperPanel } from '../../components/AIHelperPanel.tsx';
import { MOCK_USER } from '../../constants.tsx';
import { canManageContent } from '../../lib/auth/roles.ts';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

/**
 * App Router Dashboard Layout.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = MOCK_USER;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

      {canManageContent(user.role) && <AIHelperPanel />}
    </div>
  );
}
