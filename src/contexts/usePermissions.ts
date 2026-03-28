import { useContext } from "react";
import { PermissionsContext } from "./PermissionsContext.instance";
import type { PermissionsContextType } from "./PermissionsContext.types";

// Hook para usar el contexto de permisos
export const usePermissions = (): PermissionsContextType => {
	const context = useContext(PermissionsContext);
	if (context === undefined) {
		throw new Error("usePermissions debe ser usado dentro de un PermissionsProvider");
	}
	return context;
};

// Hook simplificado para verificar un permiso específico
export const useHasPermission = (resource: string, action: string): boolean => {
	const { hasPermission } = usePermissions();
	return hasPermission(resource, action);
};

// Hook para verificar múltiples permisos (cualquiera)
export const useHasAnyPermission = (permissions: Array<{ resource: string; action: string }>): boolean => {
	const { hasAnyPermission } = usePermissions();
	return hasAnyPermission(permissions);
};

// Hook para verificar múltiples permisos (todos)
export const useHasAllPermissions = (permissions: Array<{ resource: string; action: string }>): boolean => {
	const { hasAllPermissions } = usePermissions();
	return hasAllPermissions(permissions);
};
