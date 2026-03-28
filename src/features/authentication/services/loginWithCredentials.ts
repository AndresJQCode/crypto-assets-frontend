import { createApiErrorFromResponse, toUserFriendlyMessage } from "@/lib/api-error";
import { endpoints } from "../constants";
import type { AuthResponse, LoginCredentials } from "../types";

/**
 * Servicio de login con email y password
 *
 * @param credentials - Credenciales de login (email y password)
 * @returns Promise con la respuesta de autenticación (tokens y usuario)
 * @throws {ApiError} Si la respuesta no es ok (incluye status para decidir retry)
 * @throws {Error} Errores de red o parsing
 */
export const loginWithCredentials = async (credentials: LoginCredentials): Promise<AuthResponse> => {
	try {
		const response = await fetch(endpoints.login(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: credentials.email,
				password: credentials.password,
				recaptchaToken: credentials.recaptchaToken,
			}),
		});

		if (!response.ok) {
			throw await createApiErrorFromResponse(response);
		}

		return response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(toUserFriendlyMessage(error, "Ocurrió un error al iniciar sesión"));
		}
		throw new Error("Error de conexión al intentar iniciar sesión");
	}
};
