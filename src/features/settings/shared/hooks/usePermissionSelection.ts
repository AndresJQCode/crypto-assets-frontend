import { useState } from "react";
import type { Permission } from "@/types/permissions";

/**
 * Hook para manejar la selección de permisos en formularios
 */
export const usePermissionSelection = (initialPermissions: Permission[] = []) => {
	const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(initialPermissions);

	const togglePermission = (permission: Permission) => {
		setSelectedPermissions((prev) => {
			const isSelected = prev.some((p) => p.id === permission.id);
			if (isSelected) {
				return prev.filter((p) => p.id !== permission.id);
			}
			return [...prev, permission];
		});
	};

	const selectAll = (allPermissions: Permission[]) => {
		setSelectedPermissions(allPermissions);
	};

	const deselectAll = () => {
		setSelectedPermissions([]);
	};

	const toggleAll = (allPermissions: Permission[]) => {
		const allSelected = allPermissions.length === selectedPermissions.length;
		if (allSelected) {
			deselectAll();
		} else {
			selectAll(allPermissions);
		}
	};

	const toggleResourcePermissions = (resource: string, resourcePermissions: Permission[]) => {
		const selectedResourcePermissions = selectedPermissions.filter((p) => p.resource === resource);
		const allResourceSelected = resourcePermissions.length === selectedResourcePermissions.length;

		if (allResourceSelected) {
			// Deseleccionar todos los permisos del recurso
			setSelectedPermissions((prev) => prev.filter((p) => p.resource !== resource));
		} else {
			// Seleccionar todos los permisos del recurso
			const otherPermissions = selectedPermissions.filter((p) => p.resource !== resource);
			setSelectedPermissions([...otherPermissions, ...resourcePermissions]);
		}
	};

	const setPermissions = (permissions: Permission[]) => {
		setSelectedPermissions(permissions);
	};

	const getPermissionIds = (): string[] => {
		return selectedPermissions.map((permission) => permission.id);
	};

	const isPermissionSelected = (permissionId: string): boolean => {
		return selectedPermissions.some((p) => p.id === permissionId);
	};

	return {
		selectedPermissions,
		togglePermission,
		selectAll,
		deselectAll,
		toggleAll,
		toggleResourcePermissions,
		setPermissions,
		getPermissionIds,
		isPermissionSelected,
	};
};
