import { endpoints } from "../constants";

export const toggleUserStatus = async (id: string, isActive: boolean): Promise<{ id: string; isActive: boolean }> => {
	const response = await fetch(endpoints.status(id), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isActive }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al cambiar el estado del usuario");
	}

	if (response.status === 204) {
		return { id, isActive };
	}

	return response.json();
};
