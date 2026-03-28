import { useEffect, useState } from "react";
import { hasRoleDataChanged, hasUserDataChanged, haveArrayValuesChanged } from "../utils/form-helpers";

/**
 * Hook para detectar cambios en formularios de edición
 */
export const useFormChanges = <T extends Record<string, unknown>>(
	original: T | null,
	current: Partial<T>,
	compareFields: (keyof T)[],
) => {
	const [hasPendingChanges, setHasPendingChanges] = useState(false);

	useEffect(() => {
		if (original) {
			const hasChanges = compareFields.some((field) => {
				const originalValue = original[field];
				const currentValue = current[field];
				return originalValue !== currentValue;
			});
			setHasPendingChanges(hasChanges);
		}
	}, [original, current, compareFields]);

	return hasPendingChanges;
};

/**
 * Hook específico para detectar cambios en formularios de usuario
 */
export const useUserFormChanges = (
	originalUser: { name: string; email: string; isActive: boolean; roles: { id: string }[] } | null,
	currentName: string,
	currentEmail: string,
	currentIsActive: boolean,
	currentRoleIds: string[],
) => {
	const [hasPendingChanges, setHasPendingChanges] = useState(false);

	useEffect(() => {
		if (originalUser) {
			const userDataChanged = hasUserDataChanged(originalUser, {
				name: currentName,
				email: currentEmail,
				isActive: currentIsActive,
			});

			const originalRoleIds = originalUser.roles.map((role) => role.id);
			const rolesChanged = haveArrayValuesChanged(originalRoleIds, currentRoleIds);

			setHasPendingChanges(userDataChanged || rolesChanged);
		}
	}, [originalUser, currentName, currentEmail, currentIsActive, currentRoleIds]);

	return hasPendingChanges;
};

/**
 * Hook específico para detectar cambios en formularios de rol
 */
export const useRoleFormChanges = (
	originalRole: { name: string; description?: string; permissions: { id: string }[] } | null,
	currentName: string,
	currentDescription: string | undefined,
	currentPermissionIds: string[],
) => {
	const [hasPendingChanges, setHasPendingChanges] = useState(false);

	useEffect(() => {
		if (originalRole) {
			const roleDataChanged = hasRoleDataChanged(originalRole, {
				name: currentName,
				description: currentDescription,
			});

			const originalPermissionIds = originalRole.permissions.map((p) => p.id);
			const permissionsChanged = haveArrayValuesChanged(originalPermissionIds, currentPermissionIds);

			setHasPendingChanges(roleDataChanged || permissionsChanged);
		}
	}, [originalRole, currentName, currentDescription, currentPermissionIds]);

	return hasPendingChanges;
};
