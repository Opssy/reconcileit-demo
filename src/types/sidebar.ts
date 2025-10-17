// Types for sidebar navigation system
export type UserRole = "Admin" | "Reviewer" | "Approver" | "Custom";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: string[]; // Permission IDs
  isSystemRole: boolean; // Cannot be deleted
  createdAt: Date;
  updatedAt: Date;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: SidebarSubmenuItem[];
  rolesAllowed: UserRole[];
  badge?: number;
  href?: string;
}

export interface SidebarSubmenuItem {
  id: string;
  label: string;
  rolesAllowed: UserRole[];
  badge?: number;
  href?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  isActive: boolean;
  invitedAt?: Date;
  registeredAt?: Date;
  invitedBy?: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  isAccepted: boolean;
  acceptedAt?: Date;
}
