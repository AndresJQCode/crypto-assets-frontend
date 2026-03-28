// Constantes de permisos para el sistema
// Evita la repetición y facilita el mantenimiento

// Recursos del sistema
export const RESOURCES = {
	DASHBOARD: "Dashboard",
	USERS: "Users",
	ROLES: "Roles",
	PERMISSIONS: "Permissions",
	SETTINGS: "Settings",
	CONNECTORS_DEFINITIONS: "ConnectorDefinitions",
	CONNECTORS_INSTANCES: "ConnectorInstances",
	CRYPTO_ASSETS: "CryptoAssets",
} as const;

// Acciones disponibles
export const ACTIONS = {
	READ: "Read",
	CREATE: "Create",
	UPDATE: "Update",
	DELETE: "Delete",
} as const;

// Tipos para TypeScript
export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

// Tipo para permisos simples (solo resource + action)
export interface SimplePermission {
	resource: Resource;
	action: Action;
}

// Permisos predefinidos para facilitar el uso
export const PERMISSIONS = {
	// Dashboard
	DASHBOARD_READ: { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ },

	// Users
	USERS_READ: { resource: RESOURCES.USERS, action: ACTIONS.READ },
	USERS_CREATE: { resource: RESOURCES.USERS, action: ACTIONS.CREATE },
	USERS_UPDATE: { resource: RESOURCES.USERS, action: ACTIONS.UPDATE },
	USERS_DELETE: { resource: RESOURCES.USERS, action: ACTIONS.DELETE },

	// Roles
	ROLES_READ: { resource: RESOURCES.ROLES, action: ACTIONS.READ },
	ROLES_CREATE: { resource: RESOURCES.ROLES, action: ACTIONS.CREATE },
	ROLES_UPDATE: { resource: RESOURCES.ROLES, action: ACTIONS.UPDATE },
	ROLES_DELETE: { resource: RESOURCES.ROLES, action: ACTIONS.DELETE },

	// Permissions
	PERMISSIONS_READ: { resource: RESOURCES.PERMISSIONS, action: ACTIONS.READ },
	PERMISSIONS_CREATE: { resource: RESOURCES.PERMISSIONS, action: ACTIONS.CREATE },
	PERMISSIONS_UPDATE: { resource: RESOURCES.PERMISSIONS, action: ACTIONS.UPDATE },
	PERMISSIONS_DELETE: { resource: RESOURCES.PERMISSIONS, action: ACTIONS.DELETE },

	// Settings
	SETTINGS_READ: { resource: RESOURCES.SETTINGS, action: ACTIONS.READ },
	SETTINGS_UPDATE: { resource: RESOURCES.SETTINGS, action: ACTIONS.UPDATE },

	// Connectors (Tenants)
	CONNECTORS_READ: { resource: RESOURCES.CONNECTORS_DEFINITIONS, action: ACTIONS.READ },
	CONNECTORS_CREATE: { resource: RESOURCES.CONNECTORS_DEFINITIONS, action: ACTIONS.CREATE },
	CONNECTORS_UPDATE: { resource: RESOURCES.CONNECTORS_DEFINITIONS, action: ACTIONS.UPDATE },
	CONNECTORS_DELETE: { resource: RESOURCES.CONNECTORS_DEFINITIONS, action: ACTIONS.DELETE },

	// Connectors Admin (Super Admin)
	CONNECTORS_ADMIN_READ: { resource: RESOURCES.CONNECTORS_INSTANCES, action: ACTIONS.READ },
	CONNECTORS_ADMIN_CREATE: { resource: RESOURCES.CONNECTORS_INSTANCES, action: ACTIONS.CREATE },
	CONNECTORS_ADMIN_UPDATE: { resource: RESOURCES.CONNECTORS_INSTANCES, action: ACTIONS.UPDATE },
	CONNECTORS_ADMIN_DELETE: { resource: RESOURCES.CONNECTORS_INSTANCES, action: ACTIONS.DELETE },

	// Crypto Assets
	CRYPTO_ASSETS_READ: { resource: RESOURCES.CRYPTO_ASSETS, action: ACTIONS.READ },
	CRYPTO_ASSETS_CREATE: { resource: RESOURCES.CRYPTO_ASSETS, action: ACTIONS.CREATE },
	CRYPTO_ASSETS_UPDATE: { resource: RESOURCES.CRYPTO_ASSETS, action: ACTIONS.UPDATE },
	CRYPTO_ASSETS_DELETE: { resource: RESOURCES.CRYPTO_ASSETS, action: ACTIONS.DELETE },
} as const;

// Función helper para crear permisos dinámicamente
export const createPermission = (resource: Resource, action: Action): SimplePermission => ({
	resource,
	action,
});

// Función helper para verificar si un permiso simple es válido
export const isValidSimplePermission = (permission: unknown): permission is SimplePermission => {
	if (!permission || typeof permission !== "object") {
		return false;
	}

	const perm = permission as Record<string, unknown>;

	return (
		"resource" in perm &&
		"action" in perm &&
		typeof perm.resource === "string" &&
		typeof perm.action === "string" &&
		Object.values(RESOURCES).includes(perm.resource as Resource) &&
		Object.values(ACTIONS).includes(perm.action as Action)
	);
};
