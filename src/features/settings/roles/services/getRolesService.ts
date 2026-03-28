import { endpoints } from "../constants";
import type { Role } from "../types";

export const getRoles = async (includePermissions = true): Promise<Role[]> => {
	const queryParams = includePermissions ? "?includePermissions=true" : "";
	const response = await fetch(`${endpoints.list()}${queryParams}`);

	if (!response.ok) {
		throw new Error("Error al obtener los roles");
	}

	return response.json();
};
