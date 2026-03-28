import type { AuthProvider } from "../types";
import { useAuthConfig } from "./useAuthConfig";

// Hook para obtener todos los proveedores habilitados
export const useEnabledProviders = () => {
	const { data: config } = useAuthConfig();

	if (!config) return [];

	const providers: AuthProvider[] = [];

	if (config.microsoft.enabled) {
		providers.push("microsoft");
	}

	if (config.google.enabled) {
		providers.push("google");
	}

	return providers;
};
