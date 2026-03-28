import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { isAuthRequiredRoute, ROUTES } from "@/constants/routes";
import { getApiUrl } from "@/lib/env";
import { useAuth } from "./useAuth";

// Hook para manejar el refresh automático del token
export const useTokenRefresh = () => {
	const {
		accessToken,
		refreshToken,
		isAuthenticated,
		startRefreshToken,
		successRefreshToken,
		isLoading,
		failureRefreshToken,
	} = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	// Función para verificar si la ruta actual requiere autenticación
	const checkAuthRequired = useCallback(() => {
		return isAuthRequiredRoute(location.pathname);
	}, [location.pathname]);

	const refreshAccessToken = useCallback(async () => {
		if (!refreshToken || isLoading) {
			// No hacer logout automático aquí para evitar interferir con la navegación
			// El logout ya se maneja en otros lugares del sistema
			return;
		}

		try {
			startRefreshToken();

			// Aquí deberías hacer la llamada a tu API para refrescar el token
			// Por ahora, simulamos la respuesta
			const response = await fetch(`${getApiUrl()}/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
			});

			if (!response.ok) {
				// navigate to login
				navigate({ to: ROUTES.LOGIN });
				throw new Error("Failed to refresh token");
			}

			const data = await response.json();
			successRefreshToken({
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
			});
		} catch (error) {
			// Solo mostrar error si estamos en una ruta que requiere autenticación
			if (checkAuthRequired()) {
				const msg = "Error al renovar el token";
				// eslint-disable-next-line no-console
				console.error(msg, error);
			}
		}
		failureRefreshToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		refreshToken,
		isLoading,
		startRefreshToken,
		successRefreshToken,
		navigate,
		checkAuthRequired,
		failureRefreshToken,
	]);

	useEffect(() => {
		// Solo ejecutar si hay tokens válidos y el usuario está autenticado
		if (!accessToken || !refreshToken || !isAuthenticated) return;

		// Solo ejecutar en rutas que requieren autenticación
		if (!checkAuthRequired()) return;

		// Verificar si el token está próximo a expirar (ejemplo: 5 minutos antes)
		const checkTokenExpiration = () => {
			try {
				// Decodificar el JWT para obtener la fecha de expiración
				const payload = JSON.parse(atob(accessToken.split(".")[1]));
				const expirationTime = payload.exp * 1000; // Convertir a milisegundos
				const currentTime = Date.now();
				const timeUntilExpiry = expirationTime - currentTime;

				// Si el token expira en menos de 5 minutos, renovarlo
				if (timeUntilExpiry < 5 * 60 * 1000) {
					refreshAccessToken();
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Error checking token expiration:", error);
			}
		};

		// Verificar inmediatamente
		checkTokenExpiration();

		// Verificar cada minuto
		const interval = setInterval(checkTokenExpiration, 60 * 1000); // 1 minuto

		return () => clearInterval(interval);
	}, [accessToken, refreshToken, isAuthenticated, checkAuthRequired, refreshAccessToken]);

	return { refreshAccessToken };
};
