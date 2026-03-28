import { endpoints } from "../constants";
import type { UserWithDetails } from "../types";

export const getUserById = async (id: string): Promise<UserWithDetails> => {
	const response = await fetch(endpoints.byId(id));

	if (!response.ok) {
		throw new Error("Error al obtener el usuario");
	}

	return response.json();
};
