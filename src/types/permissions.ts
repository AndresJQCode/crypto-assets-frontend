// Tipos para el sistema de permisos

export interface Permission {
	id: string;
	name: string;
	description: string;
	resource: string;
	action: string;
	isActive: boolean;
}

export interface CreatePermission {
	name: string;
	description: string;
	resource: string;
	action: string;
	isActive: boolean;
}

export interface UpdatePermission {
	id: string;
	name?: string;
	description?: string;
	resource?: string;
	action?: string;
	isActive?: boolean;
}

export interface PermissionFilters {
	search?: string;
	resource?: string;
	action?: string;
	isActive?: boolean;
	sortBy?: "name" | "resource" | "action" | "createdOn";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface RolePermission {
	id: string;
	roleId: number;
	permissionId: string;
	assignedOn: string;
	assignedBy?: string;
	isActive: boolean;
	permission?: Permission;
}

export interface UserPermission {
	permissionKey: string; // Formato: "Resource.Action"
	resource: string;
	action: string;
}

export interface PermissionCheck {
	hasPermission: boolean;
	permissionKey: string;
}

// Tipos para las operaciones de permisos
export interface AssignPermissionToRoleRequest {
	roleId: number;
	permissionId: number;
}

export interface RemovePermissionFromRoleRequest {
	roleId: number;
	permissionId: number;
}

// Constantes para recursos y acciones comunes
export const PERMISSION_RESOURCES = {
	USERS: "Users",
	PRODUCTS: "Products",
	ROLES: "Roles",
	PERMISSIONS: "Permissions",
	DASHBOARD: "Dashboard",
	REPORTS: "Reports",
	CONNECTORS_INSTANCES: "ConnectorInstances",
	CONNECTORS_DEFINITIONS: "ConnectorDefinitions",
} as const;

export const PERMISSION_ACTIONS = {
	READ: "Read",
	CREATE: "Create",
	UPDATE: "Update",
	DELETE: "Delete",
	EXPORT: "Export",
	IMPORT: "Import",
} as const;

// Helper para crear claves de permisos
export const createPermissionKey = (resource: string, action: string): string => {
	return `${resource}.${action}`;
};

// Helper para parsear claves de permisos
export const parsePermissionKey = (permissionKey: string): { resource: string; action: string } => {
	const [resource, action] = permissionKey.split(".");
	return { resource, action };
};
