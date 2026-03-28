import { endpoints } from "../constants";
import type { ForgotPasswordCredentials } from "../types";

/**
 * Servicio para solicitar recuperación de contraseña
 *
 * @param credentials - Credenciales con el email del usuario
 * @returns Promise con mensaje de confirmación
 * @throws {Error} Si hay un error al procesar la solicitud
 */
export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<{ message: string }> => {
	try {
		const response = await fetch(endpoints.forgotPassword(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: credentials.email,
				recaptchaToken: credentials.recaptchaToken,
			}),
		});

		if (!response.ok) {
			let errorMessage = "Error al solicitar recuperación de contraseña";

			try {
				const error = await response.json();
				errorMessage = error.message || errorMessage;
			} catch {
				// Si no se puede parsear el error, usar el mensaje por defecto
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
		throw new Error("Error de conexión al solicitar recuperación de contraseña");
	}
};
