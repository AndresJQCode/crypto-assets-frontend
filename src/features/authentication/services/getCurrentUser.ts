import { endpoints } from "../constants";
import type { AuthUser } from "../types";

/**
 * Servicio para obtener el usuario actual autenticado
 *
 * @returns Promise con el usuario autenticado o null si no está autenticado
 * @throws {Error} Si hay un error al obtener el usuario
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
	try {
		const response = await fetch(endpoints.me(), {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			// Si el usuario no está autenticado, retornar null en lugar de lanzar error
			if (response.status === 401) {
				return null;
			}

			let errorMessage = "Error al obtener el usuario actual";

			try {
				const error = await response.json();
				errorMessage = error.message || errorMessage;
			} catch {
				errorMessage = `Error ${response.status}: ${response.statusText}`;
			}

			throw new Error(errorMessage);
		}

		return response.json();
	} catch (error) {
		// Re-lanzar errores de red o parsing
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error de conexión al obtener el usuario actual");
	}
};
