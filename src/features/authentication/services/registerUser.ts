import { createApiErrorFromResponse } from "@/lib/api-error";
import { endpoints } from "../constants";
import type { AuthResponse, RegisterCredentials } from "../types";

/**
 * Servicio de registro de usuario
 *
 * @throws {ApiError} Si la respuesta no es ok
 * @throws {Error} Errores de red o parsing
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
	try {
		const response = await fetch(endpoints.register(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: credentials.name,
				tenantName: credentials.tenantName,
				email: credentials.email,
				countryName: credentials.countryName,
				countryPhoneCode: credentials.countryPhoneCode,
				whatsappNumber: credentials.whatsappNumber.trim(),
				password: credentials.password,
				RecaptchaToken: credentials.recaptchaToken,
			}),
		});

		if (!response.ok) {
			throw await createApiErrorFromResponse(response);
		}

		return response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error de conexión al intentar crear la cuenta");
	}
};
