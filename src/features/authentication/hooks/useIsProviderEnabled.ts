import type { AuthProvider } from "../types";
import { useAuthConfig } from "./useAuthConfig";

// Hook para verificar si un proveedor está habilitado
export const useIsProviderEnabled = (provider: AuthProvider) => {
	const { data: config } = useAuthConfig();

	if (!config) return false;

	return config[provider].enabled;
};
