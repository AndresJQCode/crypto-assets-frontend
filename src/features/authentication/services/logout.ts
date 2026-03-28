import { endpoints } from "../constants";

/**
 * Servicio para cerrar sesión
 *
 * @param accessToken - Token de acceso del usuario
 * @returns Promise que se resuelve cuando el logout es exitoso
 * @throws {Error} Si hay un error al cerrar sesión
 */
export const logout = async (accessToken: string): Promise<void> => {
	try {
		const response = await fetch(endpoints.logout(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			let errorMessage = "Error al cerrar sesión";

			try {
				const error = await response.json();
				errorMessage = error.message || errorMessage;
			} catch {
				errorMessage = `Error ${response.status}: ${response.statusText}`;
			}

			throw new Error(errorMessage);
		}
	} catch (error) {
		// Re-lanzar errores de red o parsing
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error de conexión al cerrar sesión");
	}
};
