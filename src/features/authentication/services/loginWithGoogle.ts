import type { LoginWithProviderOptions } from "../types";
import { getAuthConfig } from "./authConfig";

/**
 * Servicio de login con Google
 *
 * Nota: Este servicio utiliza window.location.href para redirigir al usuario
 * a la página de autenticación de Google. Esto es necesario porque:
 * 1. Es una redirección externa a un dominio diferente (accounts.google.com)
 * 2. TanStack Router no puede manejar redirecciones a dominios externos
 * 3. Es el flujo estándar de OAuth 2.0 para autenticación con proveedores externos
 *
 * @param options - Opciones opcionales; tenantName se envía en state para registro
 * @throws {Error} Si Google login no está configurado o falta el clientId
 */
export const loginWithGoogle = async (options?: LoginWithProviderOptions): Promise<void> => {
	const config = getAuthConfig();

	if (!config.google.enabled || !config.google.clientId) {
		throw new Error("Login con Google no está configurado");
	}

	const params = new URLSearchParams({
		client_id: config.google.clientId,
		redirect_uri: config.google.redirectUri,
		response_type: "code",
		scope: "openid email profile",
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

	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

	// Redirección externa necesaria para OAuth 2.0
	// Nota: Usamos window.location.href porque es una redirección externa
	// y TanStack Router no puede manejar redirecciones a dominios externos
	// eslint-disable-next-line no-restricted-globals
	globalThis.window.location.href = authUrl;
};
