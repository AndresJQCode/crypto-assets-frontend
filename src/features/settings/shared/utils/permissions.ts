import type { Permission, UserPermission } from "@/types/permissions";

/**
 * Utilidades para permisos
 * Funciones helper para operaciones relacionadas con permisos
 */

/**
 * Agrupa permisos completos (Permission) por recurso
 */
export const groupPermissionsByResource = (permissions: Permission[]) => {
	const groups = permissions.reduce(
		(acc, permission) => {
			const resource = permission.resource;
			if (!acc[resource]) {
				acc[resource] = {
					resource,
					displayName: resource,
					permissions: [],
				};
			}
			acc[resource].permissions.push(permission);
			return acc;
		},
		{} as Record<string, { resource: string; displayName: string; permissions: Permission[] }>,
	);

	return Object.values(groups);
};

/**
 * Agrupa permisos de usuario (UserPermission) por recurso
 * Retorna un Record donde la clave es el recurso y el valor es un array de acciones
 */
export const groupUserPermissionsByResource = (permissions: UserPermission[]): Record<string, string[]> => {
	return permissions.reduce(
		(acc, permission) => {
			if (!acc[permission.resource]) {
				acc[permission.resource] = [];
			}
			acc[permission.resource].push(permission.action);
			return acc;
		},
		{} as Record<string, string[]>,
	);
};
