// Tipos para la gestión de roles en settings

import type { Permission } from "@/types/permissions";

export interface Role {
	id: string;
	name: string;
	description?: string;
	isActive: boolean;
	permissions: Permission[]; // IDs de permisos
	userCount?: number; // Número de usuarios con este rol
}

export interface CreateRole {
	name: string;
	description?: string;
}

export interface CreateRoleWithPermissions {
	name: string;
	description?: string;
	permissionIds: string[];
}

export interface UpdateRole {
	id: string;
	name?: string;
	description?: string;
	isActive?: boolean;
	permissionIds?: string[];
}
