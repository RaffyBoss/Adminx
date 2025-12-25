
import React from 'react';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Users, Settings, LogOut, ChevronRight, Sparkles, Wand2, FileSearch } from 'lucide-react';
import { User, UserRole, Service, Post, Lead } from './types';

export const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['viewer', 'editor', 'admin', 'owner'] as UserRole[] },
  { label: 'Services', href: '/dashboard/services', icon: <Briefcase size={20} />, roles: ['viewer', 'editor', 'admin', 'owner'] as UserRole[] },
  { label: 'Posts', href: '/dashboard/posts', icon: <FileText size={20} />, roles: ['viewer', 'editor', 'admin', 'owner'] as UserRole[] },
  { label: 'Leads', href: '/dashboard/leads', icon: <MessageSquare size={20} />, roles: ['viewer', 'admin', 'owner'] as UserRole[] },
  { label: 'Users', href: '/dashboard/users', icon: <Users size={20} />, roles: ['owner'] as UserRole[] },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} />, roles: ['viewer', 'editor', 'admin', 'owner'] as UserRole[] },
];

export const MOCK_USER: User = {
  id: '1',
  email: 'admin@adminx.com',
  name: 'Alex Rivera',
  role: 'owner',
  avatar: 'https://picsum.photos/seed/admin/200',
};

// Fixed: Updated property names to match Service interface (title, enabled)
export const MOCK_SERVICES: Service[] = [
  { id: '1', title: 'Web Development', description: 'Custom React & Next.js applications.', price: 5000, enabled: true, created_at: '2023-10-01' },
  { id: '2', title: 'SEO Optimization', description: 'Rank higher on search engines.', price: 1200, enabled: true, created_at: '2023-11-15' },
  { id: '3', title: 'UI/UX Design', description: 'Stunning user interfaces.', price: 2500, enabled: false, created_at: '2023-12-05' },
];

// Fixed: Updated property names to match Post interface (published) and added required slug
export const MOCK_POSTS: Post[] = [
  { id: '1', title: 'Why Next.js is Awesome', slug: 'why-nextjs-is-awesome', content: 'Next.js provides the best developer experience...', published: true, author: 'Alex Rivera', created_at: '2024-01-10' },
  { id: '2', title: 'Admin Dashboards 101', slug: 'admin-dashboards-101', content: 'Creating effective admin panels requires focus on...', published: false, author: 'Alex Rivera', created_at: '2024-02-14' },
];

// Fixed: Added missing required source and corrected invalid status value
export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', source: 'Website', message: 'I need a new website for my law firm.', status: 'new', created_at: '2024-03-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@startup.io', source: 'Referral', message: 'Looking for SEO services for our upcoming launch.', status: 'contacted', created_at: '2024-03-02' },
  { id: '3', name: 'Bob Wilson', email: 'bob@corp.com', source: 'LinkedIn', message: 'Urgent UI redesign needed.', status: 'new', created_at: '2024-03-05' },
];
