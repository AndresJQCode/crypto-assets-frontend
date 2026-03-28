import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthInterceptor } from "@/hooks/useAuthInterceptor";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

// Componente para inicializar el estado de autenticación
export const AuthInitializer = () => {
	const { isAuthenticated } = useAuth();

	// Solo inicializar el refresh token si el usuario está autenticado
	useTokenRefresh();

	// Configurar el interceptor para excluir el endpoint de refresh token
	useAuthInterceptor({
		includeAllBackendRoutes: true,
		excludePaths: [
			"/auth/login",
			"/auth/register",
			"/auth/forgotPassword",
			"/auth/resetPassword",
			"/auth/exchange-code",
		],
	});

	// Log para debugging (solo en desarrollo)
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			// eslint-disable-next-line no-console
			console.log("🔐 AuthInitializer: Estado de autenticación:", { isAuthenticated });
		}
	}, [isAuthenticated]);

	return null; // Este componente no renderiza nada
};
