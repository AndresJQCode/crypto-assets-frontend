/**
 * API Client - Cliente HTTP configurado para comunicarse con el backend
 */

import { getApiUrl } from "./env";
import { ApiError, createApiErrorFromResponse } from "./api-error";

/**
 * Obtiene el token de autenticación del localStorage
 */
function getAuthToken(): string | null {
	return localStorage.getItem("access_token");
}

/**
 * Opciones de configuración para las peticiones API
 */
export interface ApiRequestOptions extends RequestInit {
	/**
	 * Si es true, no incluye el header de autenticación
	 */
	skipAuth?: boolean;

	/**
	 * Query parameters para agregar a la URL
	 */
	params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Cliente API base con autenticación y manejo de errores
 */
class ApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = getApiUrl();
	}

	/**
	 * Construye la URL completa con query parameters
	 */
	private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
		const url = new URL(endpoint, this.baseUrl);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		return url.toString();
	}

	/**
	 * Prepara los headers de la petición
	 */
	private prepareHeaders(options?: ApiRequestOptions): Headers {
		const headers = new Headers(options?.headers);

		// Agregar Content-Type si no está presente y hay body
		if (options?.body && !headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}

		// Agregar token de autenticación si no se solicita skipAuth
		if (!options?.skipAuth) {
			const token = getAuthToken();
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		return headers;
	}

	/**
	 * Realiza una petición HTTP
	 */
	private async request<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
		const url = this.buildUrl(endpoint, options?.params);
		const headers = this.prepareHeaders(options);

		const fetchOptions: RequestInit = {
			...options,
			headers,
		};

		try {
			const response = await fetch(url, fetchOptions);

			if (!response.ok) {
				throw await createApiErrorFromResponse(response);
			}

			// Si la respuesta es 204 No Content, retornar null
			if (response.status === 204) {
				return null as T;
			}

			return await response.json();
		} catch (error) {
			// Si ya es un ApiError, re-lanzarlo
			if (error instanceof ApiError) {
				throw error;
			}

			// Para errores de red, lanzar un error genérico
			throw new Error("Error de conexión con el servidor");
		}
	}

	/**
	 * GET request
	 */
	async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "GET",
		});
	}

	/**
	 * POST request
	 */
	async post<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	/**
	 * PUT request
	 */
	async put<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	/**
	 * PATCH request
	 */
	async patch<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "PATCH",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "DELETE",
		});
	}
}

/**
 * Instancia única del cliente API
 */
export const apiClient = new ApiClient();
