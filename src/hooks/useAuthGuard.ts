import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isPublicRoute, ROUTES } from "@/constants/routes";
import { useAuth } from "./useAuth";

// Hook para proteger rutas que requieren autenticación
export const useAuthGuard = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// No hacer nada si aún está cargando
		if (isLoading) return;

		// Si está en una ruta pública, no hacer nada
		if (isPublicRoute(location.pathname)) {
			return;
		}

		// Si no está autenticado y está en una ruta protegida, redirigir al login
		if (!isAuthenticated) {
			// eslint-disable-next-line no-console
			console.log("🚫 useAuthGuard: Usuario no autenticado, redirigiendo al login desde:", location.pathname);
			navigate({ to: ROUTES.LOGIN });
		}
	}, [isAuthenticated, isLoading, location.pathname, navigate]);

	return { isAuthenticated, isLoading };
};
