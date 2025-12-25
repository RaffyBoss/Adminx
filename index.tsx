
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages - simulating Next.js page structure within this environment's constraints
import DashboardLayout from './app/dashboard/layout.tsx';
import DashboardPage from './app/dashboard/page.tsx';
import ServicesPage from './app/dashboard/services/page.tsx';
import PostsPage from './app/dashboard/posts/page.tsx';
import LeadsPage from './app/dashboard/leads/page.tsx';
import { Landing } from './pages/Landing.tsx';
import { Login } from './pages/Login.tsx';
import { Users } from './pages/Users.tsx';
import { Settings } from './pages/Settings.tsx';

/**
 * While this simulation still uses HashRouter to facilitate the interactive demo,
 * the components themselves have been refactored to use Next.js App Router patterns
 * (children-based layouts, server components structure, and navigation hooks).
 */
const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
