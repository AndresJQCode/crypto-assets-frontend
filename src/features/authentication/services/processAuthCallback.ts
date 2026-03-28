import type { AuthProvider, AuthResponse } from "@/features/authentication/types";
import { createApiErrorFromResponse, toUserFriendlyMessage } from "@/lib/api-error";
import { endpoints } from "../constants";

export interface ProcessAuthCallbackParams {
	provider: AuthProvider;
	code: string;
	/** State devuelto por el proveedor OAuth (p. ej. con tenantName para registro) */
	state?: string;
}

/**
 * Servicio para procesar callback de proveedores externos (OAuth)
 *
 * @param params - provider, code y opcionalmente state (con tenantName para registro)
 * @returns Promise con la respuesta de autenticación (tokens y usuario)
 * @throws {Error} Si el código es inválido, expirado, el servidor no responde o hay error de red
 */
export const processAuthCallback = async (params: ProcessAuthCallbackParams): Promise<AuthResponse> => {
	const { provider, code, state } = params;

	try {
		const body: { code: string; provider: AuthProvider; state?: string } = { code, provider };
		if (state) body.state = state;

		const response = await fetch(endpoints.exchangeCode(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
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
