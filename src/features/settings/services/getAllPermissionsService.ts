import type { Permission } from "@/types/permissions";
import { endpoints } from "../constants";

export const getAllPermissions = async (): Promise<Permission[]> => {
	const response = await fetch(endpoints.permissions());

	if (!response.ok) {
		throw new Error("Error al obtener los permisos");
	}

	return response.json();
};
