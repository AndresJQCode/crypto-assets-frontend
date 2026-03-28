import { endpoints } from "../constants";
import type { Role } from "../types";

export const getRoleById = async (id: string, includePermissions = true): Promise<Role> => {
	const queryParams = includePermissions ? "?includePermissions=true" : "";
	const response = await fetch(`${endpoints.byId(id)}${queryParams}`);

	if (!response.ok) {
		throw new Error("Error al obtener el rol");
	}

	return response.json();
};
