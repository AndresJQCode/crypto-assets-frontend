import { endpoints } from "../constants";
import type { CreateRoleWithPermissions, Role } from "../types";

export const createRole = async (role: CreateRoleWithPermissions): Promise<Role> => {
	const response = await fetch(endpoints.list(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(role),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al crear el rol");
	}

	return response.json();
};
