import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { getApiUrl } from "@/lib/env";
import { logout } from "@/redux/slices/auth.slice";
import { store } from "@/redux/store";
import { useAuth } from "./useAuth";

// Configuración del interceptor
interface AuthInterceptorConfig {
	// Rutas que deben incluir el token (por defecto: todas las rutas del backend)
	includePaths?: string[];
	// Rutas que NO deben incluir el token
	excludePaths?: string[];
	// Si debe incluir el token en todas las rutas del backend (por defecto: true)
	includeAllBackendRoutes?: boolean;
	// Ruta a la que redirigir cuando se reciba un 401 (por defecto: "/login")
	unauthorizedRedirectTo?: string;
}

// Hook para configurar interceptores HTTP con el token de autorización
// El token se obtiene directamente del estado de Redux (que se persiste automáticamente)
export const useAuthInterceptor = (config: AuthInterceptorConfig = {}) => {
	const { accessToken } = useAuth();
	const navigate = useNavigate();
	const {
		includePaths = [],
		excludePaths = [],
		includeAllBackendRoutes = true,
		unauthorizedRedirectTo = ROUTES.LOGIN,
	} = config;

	useEffect(() => {
		// Interceptor para agregar el token a las peticiones
		const originalFetch = window.fetch;

		window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
			const url = typeof input === "string" ? input : input.toString();
			const apiUrl = getApiUrl();

			// Determinar si esta petición debe incluir el token
			let shouldIncludeToken = false;

			if (accessToken) {
				// Verificar si es una petición al backend
				const isBackendRequest = url.startsWith(apiUrl);

				if (isBackendRequest) {
					// Si includeAllBackendRoutes es true, incluir token en todas las rutas del backend
					if (includeAllBackendRoutes) {
						shouldIncludeToken = true;
					}

					// Verificar rutas específicas a incluir
					if (includePaths.length > 0) {
						const shouldIncludeByPath = includePaths.some((path) => url.includes(path) || url.endsWith(path));
						if (shouldIncludeByPath) {
							shouldIncludeToken = true;
						}
					}

					// Verificar rutas específicas a excluir
					if (excludePaths.length > 0) {
						const shouldExcludeByPath = excludePaths.some((path) => url.includes(path) || url.endsWith(path));
						if (shouldExcludeByPath) {
							shouldIncludeToken = false;
						}
					}
				}
			}

			let response: Response;

			if (shouldIncludeToken) {
				const headers = new Headers(init?.headers);
				headers.set("Authorization", `Bearer ${accessToken}`);

				response = await originalFetch(input, {
					...init,
					headers,
				});
			} else {
				response = await originalFetch(input, init);
			}

			// Interceptar respuestas con error 401 (Unauthorized)
			if (response.status === 401) {
				// Limpiar el estado de autenticación
				store.dispatch(logout());

				// Redirigir a la página de no autorizado
				navigate({ to: unauthorizedRedirectTo });

				// Log para debugging (solo en desarrollo)
				if (process.env.NODE_ENV === "development") {
					// eslint-disable-next-line no-console
					console.warn("🚫 Interceptor: Token inválido detectado, redirigiendo a:", unauthorizedRedirectTo);
				}
			}

			return response;
		};

		// Cleanup function
		return () => {
			window.fetch = originalFetch;
		};
	}, [accessToken, includePaths, excludePaths, includeAllBackendRoutes, unauthorizedRedirectTo, navigate]);
};
