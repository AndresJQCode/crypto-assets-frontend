import type React from "react";
import { usePermissions } from "@/contexts/usePermissions";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface PermissionDropdownItemProps extends React.ComponentProps<typeof DropdownMenuItem> {
	resource: string;
	action: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

// Componente que se muestra solo si el usuario tiene el permiso requerido
export const PermissionDropdownItem: React.FC<PermissionDropdownItemProps> = ({
	resource,
	action,
	children,
	fallback = null,
	...dropdownItemProps
}) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<DropdownMenuItem disabled {...dropdownItemProps}>
				Cargando...
			</DropdownMenuItem>
		);
	}

	if (!hasPermission(resource, action)) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Elemento de menú oculto: Se requiere Recurso "${resource}", Acción "${action}"`);
		return <>{fallback}</>;
	}

	return <DropdownMenuItem {...dropdownItemProps}>{children}</DropdownMenuItem>;
};
