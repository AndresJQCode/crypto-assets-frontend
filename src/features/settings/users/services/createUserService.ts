import { endpoints } from "../constants";
import type { CreateUser, User } from "../types";

export const createUser = async (user: CreateUser): Promise<User> => {
	const response = await fetch(endpoints.list(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al crear el usuario");
	}

	return response.json();
};
