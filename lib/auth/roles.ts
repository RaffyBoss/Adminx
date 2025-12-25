
import { UserRole } from '../../types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageContent(role: UserRole): boolean {
  return ['owner', 'admin', 'editor'].includes(role);
}

export function canViewLeads(role: UserRole): boolean {
  return ['owner', 'admin'].includes(role);
}
