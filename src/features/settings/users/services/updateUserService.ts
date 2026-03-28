import { endpoints } from "../constants";
import type { UpdateUser, User } from "../types";

export const updateUser = async (user: UpdateUser): Promise<User> => {
	const { id, ...updateData } = user;
	const response = await fetch(endpoints.byId(id), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updateData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al actualizar el usuario");
	}

	return response.json();
};
