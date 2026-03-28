import { endpoints } from "../constants";
import type { AssignRolesToUserRequest, User } from "../types";

/**
 * @deprecated Usar updateUser con roleIds en su lugar
 */
export const assignRolesToUser = async (request: AssignRolesToUserRequest): Promise<User> => {
	const { userId, roleIds } = request;
	const response = await fetch(endpoints.roles(userId), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userId, roleIds }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al asignar roles al usuario");
	}

	return response.json();
};
