/**
 * Funciones helper para formularios
 * Utilidades compartidas para detección de cambios y validaciones en formularios
 */

/**
 * Detecta si los datos de un objeto han cambiado comparando campos específicos
 */
export const hasDataChanged = <T extends Record<string, unknown>>(
	original: T,
	current: Partial<T>,
	fieldsToCompare: (keyof T)[],
): boolean => {
	return fieldsToCompare.some((field) => {
		const originalValue = original[field];
		const currentValue = current[field];
		return originalValue !== currentValue;
	});
};

/**
 * Detecta si dos arrays de números han cambiado (comparando valores, no referencias)
 */
export const haveArrayValuesChanged = (original: string[], current: string[]): boolean => {
	if (original.length !== current.length) return true;

	const sortedOriginal = [...original].sort();
	const sortedCurrent = [...current].sort();

	return !sortedOriginal.every((value, index) => value === sortedCurrent[index]);
};

/**
 * Función específica para detectar cambios en datos de usuario
 */
export const hasUserDataChanged = (
	originalUser: { name: string; email: string; isActive: boolean },
	formData: { name: string; email: string; isActive: boolean },
): boolean => {
	return (
		originalUser.name !== formData.name ||
		originalUser.email !== formData.email ||
		originalUser.isActive !== formData.isActive
	);
};

/**
 * Función específica para detectar cambios en roles
 */
export const haveRolesChanged = (originalRoles: string[], newRoles: string[]): boolean => {
	return haveArrayValuesChanged(originalRoles, newRoles);
};

/**
 * Función específica para detectar cambios en datos de rol
 */
export const hasRoleDataChanged = (
	originalRole: { name: string; description?: string },
	formData: { name: string; description?: string },
): boolean => {
	return originalRole.name !== formData.name || originalRole.description !== formData.description;
};

/**
 * Función específica para detectar cambios en permisos
 */
export const havePermissionsChanged = (originalPermissions: string[], newPermissions: string[]): boolean => {
	return haveArrayValuesChanged(originalPermissions, newPermissions);
};
