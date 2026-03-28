import type { ReactNode } from "react";
import { usePermissions } from "@/contexts/usePermissions";

interface PermissionGuardProps {
	children: ReactNode;
	resource: string;
	action: string;
	fallback?: ReactNode;
	requireAll?: boolean;
}

interface MultiplePermissionsGuardProps {
	children: ReactNode;
	permissions: Array<{ resource: string; action: string }>;
	fallback?: ReactNode;
	requireAll?: boolean; // true = requiere todos, false = requiere al menos uno
}

// Componente para proteger con un solo permiso
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, resource, action, fallback = null }) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return <div>Cargando permisos...</div>;
	}

	if (!hasPermission(resource, action)) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Permiso denegado: Recurso "${resource}", Acción "${action}"`);
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

// Componente para proteger con múltiples permisos
export const MultiplePermissionsGuard: React.FC<MultiplePermissionsGuardProps> = ({
	children,
	permissions,
	fallback = null,
	requireAll = false,
}) => {
	const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

	if (isLoading) {
		return <div>Cargando permisos...</div>;
	}

	const hasRequiredPermissions = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

	if (!hasRequiredPermissions) {
		const permissionList = permissions.map((p) => `"${p.resource}:${p.action}"`).join(", ");
		const requirement = requireAll ? "todos" : "al menos uno";
		// eslint-disable-next-line no-console
		console.warn(`🚫 Permisos denegados: Se requiere ${requirement} de [${permissionList}]`);
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

// Componente para mostrar contenido solo si NO tiene permiso
export const NoPermissionGuard: React.FC<PermissionGuardProps> = ({ children, resource, action, fallback = null }) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return <div>Cargando permisos...</div>;
	}

	if (hasPermission(resource, action)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

// Componente para mostrar contenido basado en roles (usando permisos como proxy)
export const RoleGuard: React.FC<{
	children: ReactNode;
	roles: string[]; // Nombres de roles
	fallback?: ReactNode;
}> = ({ children, roles, fallback = null }) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return <div>Cargando permisos...</div>;
	}

	// Verificar si tiene permisos de administrador (todos los permisos)
	const hasAdminPermissions =
		hasPermission("Permissions", "Read") && hasPermission("Users", "Read") && hasPermission("Roles", "Read");

	// Verificar si tiene permisos de editor
	const hasEditorPermissions = hasPermission("Products", "Create") && hasPermission("Users", "Read");
	// Verificar si tiene permisos básicos de usuario
	const hasUserPermissions = hasPermission("Auth", "Login");

	const hasRequiredRole = roles.some((role) => {
		switch (role.toLowerCase()) {
			case "administrator":
			case "admin":
				return hasAdminPermissions;
			case "editor":
				return hasEditorPermissions;
			case "user":
				return hasUserPermissions;
			default:
				return false;
		}
	});

	if (!hasRequiredRole) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Rol denegado: Se requiere uno de los roles [${roles.join(", ")}]`);
		return <>{fallback}</>;
	}

	return <>{children}</>;
};
