import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { UserPermission } from "@/types/permissions";
import type { RootState } from "../redux/store";
import { PermissionsContext } from "./PermissionsContext.instance";
import type { PermissionsContextType } from "./PermissionsContext.types";

interface PermissionsProviderProps {
	children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
	// Obtener permisos desde Redux
	const { user, isLoading: isUserLoading } = useSelector((state: RootState) => state.authState);

	// Los permisos vienen directamente del usuario autenticado
	const permissions: UserPermission[] = user?.permissions || [];

	// Función para verificar si el usuario tiene un permiso específico
	const hasPermission = (resource: string, action: string): boolean => {
		if (!permissions || permissions.length === 0) return false;

		const permissionKey = `${resource}.${action}`;

		return permissions.some((permission) => permission.permissionKey === permissionKey);
	};

	// Función para verificar si el usuario tiene al menos uno de los permisos especificados
	const hasAnyPermission = (requiredPermissions: Array<{ resource: string; action: string }>): boolean => {
		if (!permissions || permissions.length === 0) return false;

		return requiredPermissions.some(({ resource, action }) => hasPermission(resource, action));
	};

	// Función para verificar si el usuario tiene todos los permisos especificados
	const hasAllPermissions = (requiredPermissions: Array<{ resource: string; action: string }>): boolean => {
		if (!permissions || permissions.length === 0) return false;

		return requiredPermissions.every(({ resource, action }) => hasPermission(resource, action));
	};

	const contextValue: PermissionsContextType = {
		permissions,
		isLoading: isUserLoading,
		error: null, // Los errores de permisos se manejan a través del estado de autenticación
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
	};

	return <PermissionsContext.Provider value={contextValue}>{children}</PermissionsContext.Provider>;
};
