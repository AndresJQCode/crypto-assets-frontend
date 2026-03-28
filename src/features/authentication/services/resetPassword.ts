import { endpoints } from "../constants";
import type { ResetPasswordCredentials } from "../types";

// Servicio para restablecer contraseña
export const resetPassword = async (credentials: ResetPasswordCredentials): Promise<{ message: string }> => {
	const response = await fetch(endpoints.resetPassword(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentials),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al restablecer contraseña");
	}

	return response.json();
};
