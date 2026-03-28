/**
 * Utilidades específicas para usuarios
 * Funciones helper para operaciones relacionadas con usuarios
 */

/**
 * Obtiene las iniciales de un nombre (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

/**
 * Obtiene el texto del estado de un usuario
 */
export const getStatusText = (isActive: boolean): string => {
	return isActive ? "Activo" : "Inactivo";
};

/**
 * Obtiene las clases CSS para el estado de un usuario
 */
export const getStatusColor = (isActive: boolean): string => {
	return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
};
