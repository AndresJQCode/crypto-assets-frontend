import { useState } from "react";
import type { Role } from "@/features/settings/roles/types";

/**
 * Hook para manejar la selección de roles en formularios
 */
export const useRoleSelection = (initialRoles: Role[] = []) => {
	const [selectedRoles, setSelectedRoles] = useState<Role[]>(initialRoles);

	const addRole = (role: Role) => {
		if (!selectedRoles.some((r) => r.id === role.id)) {
			setSelectedRoles((prev) => [...prev, role]);
		}
	};

	const removeRole = (roleId: string) => {
		setSelectedRoles((prev) => prev.filter((role) => role.id !== roleId));
	};

	const setRoles = (roles: Role[]) => {
		setSelectedRoles(roles);
	};

	const getRoleIds = (): string[] => {
		return selectedRoles.map((role) => role.id);
	};

	const isRoleSelected = (roleId: string): boolean => {
		return selectedRoles.some((r) => r.id === roleId);
	};

	return {
		selectedRoles,
		addRole,
		removeRole,
		setRoles,
		getRoleIds,
		isRoleSelected,
	};
};
