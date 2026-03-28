import { endpoints } from "../constants";
import type { Role, UpdateRole } from "../types";

export const updateRole = async (role: UpdateRole): Promise<Role> => {
	const { id, ...updateData } = role;
	const response = await fetch(endpoints.byId(id), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updateData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al actualizar el rol");
	}

	return response.json();
};
