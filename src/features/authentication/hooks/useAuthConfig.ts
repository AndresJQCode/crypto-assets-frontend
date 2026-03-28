import { useQuery } from "@tanstack/react-query";
import { getAuthConfig } from "../services";

// Hook para obtener la configuración de autenticación
export const useAuthConfig = () => {
	return useQuery({
		queryKey: ["auth-config"],
		queryFn: getAuthConfig,
		staleTime: Number.POSITIVE_INFINITY, // La configuración no cambia durante la sesión
	});
};
