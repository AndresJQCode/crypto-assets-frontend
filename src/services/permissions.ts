import { getApiUrl } from "@/lib/env";
import type { Permission } from "@/types/permissions";

// Obtener permisos con paginación y filtros
export const getPermissions = async (): Promise<Permission[]> => {
	const apiUrl = getApiUrl();

	const response = await fetch(`${apiUrl}/permissions`);

	if (!response.ok) {
		throw new Error("Error al obtener los permisos");
	}

	return response.json();
};
