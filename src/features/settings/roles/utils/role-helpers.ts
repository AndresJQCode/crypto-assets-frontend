/**
 * Utilidades específicas para roles
 * Funciones helper para operaciones relacionadas con roles
 */

/**
 * Obtiene las iniciales de un nombre de rol (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
};
