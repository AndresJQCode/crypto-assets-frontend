/**
 * Comprueba si el error es de red o timeout (servidor no responde, sin conexión, etc.)
 */
export function isNetworkOrTimeoutError(error: unknown): boolean {
	if (error instanceof Error) {
		if (error.name === "AbortError") return true;
		if (error.name === "TypeError" && /fetch|network|connection/i.test(error.message)) return true;
		if (/failed to fetch|network error|connection refused/i.test(error.message)) return true;
	}
	return false;
}

/**
 * Convierte un error de API/red en un mensaje amigable para el usuario en español.
 * @param error - Error capturado (puede ser Error, ApiError o desconocido)
 * @param fallbackMessage - Mensaje cuando el error no es una instancia de Error
 */
export function toUserFriendlyMessage(error: unknown, fallbackMessage?: string): string {
	if (error instanceof Error) {
		if (error.name === "AbortError") {
			return "El servidor no respondió a tiempo. Comprueba que el servicio esté disponible e inténtalo de nuevo.";
		}
		if (isNetworkOrTimeoutError(error)) {
			return "No se pudo conectar con el servidor. Comprueba que el servicio esté disponible o inténtalo más tarde.";
		}
		return error.message;
	}
	return fallbackMessage ?? "Error de conexión. Inténtalo de nuevo.";
}

/**
 * Custom error class for API errors with status code and structured data
 */
export class ApiError extends Error {
	public readonly status: number;
	public readonly statusText: string;
	public readonly data?: unknown;

	constructor(status: number, statusText: string, message?: string, data?: unknown) {
		super(message || `Error ${status}: ${statusText}`);
		this.name = "ApiError";
		this.status = status;
		this.statusText = statusText;
		this.data = data;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}

	/**
	 * Check if error is a specific HTTP status
	 */
	is(status: number): boolean {
		return this.status === status;
	}

	/**
	 * Check if error is a client error (4xx)
	 */
	isClientError(): boolean {
		return this.status >= 400 && this.status < 500;
	}

	/**
	 * Check if error is a server error (5xx)
	 */
	isServerError(): boolean {
		return this.status >= 500;
	}

	/**
	 * Check if error is unauthorized (401)
	 */
	isUnauthorized(): boolean {
		return this.status === 401;
	}

	/**
	 * Check if error is forbidden (403)
	 */
	isForbidden(): boolean {
		return this.status === 403;
	}

	/**
	 * Check if error is not found (404)
	 */
	isNotFound(): boolean {
		return this.status === 404;
	}
}

/**
 * Helper to create ApiError from fetch Response
 */
export async function createApiErrorFromResponse(response: Response, customMessage?: string): Promise<ApiError> {
	let data: unknown;

	try {
		data = await response.json();
	} catch {
		// Response body is not JSON
		data = undefined;
	}

	const message =
		customMessage || (data as { message?: string })?.message || `Error ${response.status}: ${response.statusText}`;

	return new ApiError(response.status, response.statusText, message, data);
}

/**
 * Helper to handle fetch requests with proper error handling
 */
export async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw await createApiErrorFromResponse(response);
	}

	return response.json();
}
