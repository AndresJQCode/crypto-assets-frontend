import type React from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/contexts/usePermissions";

type ButtonProps = React.ComponentProps<typeof Button>;

interface PermissionButtonProps extends ButtonProps {
	resource: string;
	action: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
	requireAll?: boolean;
}

interface MultiplePermissionsButtonProps extends ButtonProps {
	permissions: Array<{ resource: string; action: string }>;
	children: React.ReactNode;
	fallback?: React.ReactNode;
	requireAll?: boolean;
}

// Botón que se muestra solo si el usuario tiene el permiso requerido
export const PermissionButton: React.FC<PermissionButtonProps> = ({
	resource,
	action,
	children,
	fallback = null,
	...buttonProps
}) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<Button disabled {...buttonProps}>
				Cargando...
			</Button>
		);
	}

	if (!hasPermission(resource, action)) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Botón oculto: Se requiere Recurso "${resource}", Acción "${action}"`);
		return <>{fallback}</>;
	}

	return <Button {...buttonProps}>{children}</Button>;
};

// Botón que se muestra solo si el usuario tiene los permisos requeridos
export const MultiplePermissionsButton: React.FC<MultiplePermissionsButtonProps> = ({
	permissions,
	children,
	fallback = null,
	requireAll = false,
	...buttonProps
}) => {
	const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<Button disabled {...buttonProps}>
				Cargando...
			</Button>
		);
	}

	const hasRequiredPermissions = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

	if (!hasRequiredPermissions) {
		const permissionList = permissions.map((p) => `"${p.resource}:${p.action}"`).join(", ");
		const requirement = requireAll ? "todos" : "al menos uno";
		// eslint-disable-next-line no-console
		console.warn(`🚫 Botón oculto: Se requiere ${requirement} de [${permissionList}]`);
		return <>{fallback}</>;
	}

	return <Button {...buttonProps}>{children}</Button>;
};

// Botón que se deshabilita si no tiene permiso
export const ConditionalPermissionButton: React.FC<PermissionButtonProps> = ({
	resource,
	action,
	children,
	...buttonProps
}) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<Button disabled {...buttonProps}>
				Cargando...
			</Button>
		);
	}

	const hasPermissionValue = hasPermission(resource, action);

	if (!hasPermissionValue) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Botón deshabilitado: Se requiere Recurso "${resource}", Acción "${action}"`);
	}

	return (
		<Button disabled={!hasPermissionValue} {...buttonProps}>
			{children}
		</Button>
	);
};
