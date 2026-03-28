import type { LoginWithProviderOptions } from "../types";
import { getAuthConfig } from "./authConfig";

/**
 * Servicio de login con Microsoft
 *
 * Nota: Este servicio utiliza window.location.href para redirigir al usuario
 * a la página de autenticación de Microsoft. Esto es necesario porque:
 * 1. Es una redirección externa a un dominio diferente (login.microsoftonline.com)
 * 2. TanStack Router no puede manejar redirecciones a dominios externos
 * 3. Es el flujo estándar de OAuth 2.0 para autenticación con proveedores externos
 *
 * @param options - Opciones opcionales; tenantName se envía en state para registro
 * @throws {Error} Si Microsoft login no está configurado o falta el clientId/tenantId
 */
export const loginWithMicrosoft = async (options?: LoginWithProviderOptions): Promise<void> => {
	const config = getAuthConfig();

	if (!config.microsoft.enabled || !config.microsoft.clientId) {
		throw new Error("Login con Microsoft no está configurado");
	}

	const params = new URLSearchParams({
		client_id: config.microsoft.clientId,
		response_type: "code",
		redirect_uri: config.microsoft.redirectUri,
		scope: "openid email profile",
		response_mode: "query",
		prompt: "select_account",
	});

	// Siempre enviar state con el flow (login o register) para que el callback sepa qué flujo era
	const flow = options?.flow ?? "login";
	params.set(
		"state",
		encodeURIComponent(
			JSON.stringify({
				flow,
				...(options?.tenantName && { tenantName: options.tenantName }),
				...(options?.countryName && { countryName: options.countryName }),
				...(options?.countryPhoneCode && { countryPhoneCode: options.countryPhoneCode }),
				...(options?.whatsappNumber && { whatsappNumber: options.whatsappNumber }),
			}),
		),
	);

	const tenantId = config.microsoft.tenantId;
	const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`;

	// Redirección externa necesaria para OAuth 2.0
	// Nota: Usamos window.location.href porque es una redirección externa
	// y TanStack Router no puede manejar redirecciones a dominios externos
	// eslint-disable-next-line no-restricted-globals
	globalThis.window.location.href = authUrl;
};
