
export type UserRole = 'viewer' | 'editor' | 'admin' | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  enabled: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  author: string;
  created_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export interface DashboardStats {
  servicesCount: number;
  postsCount: number;
  leadsCount: number;
  revenue: number;
}
