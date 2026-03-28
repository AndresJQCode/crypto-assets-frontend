import type { AuthConfig } from "@/features/authentication/types";
import { getAuthConfig as getValidatedAuthConfig } from "@/lib/env";

// Configuración basada en variables de entorno validadas
export const getAuthConfig = (): AuthConfig => {
	return getValidatedAuthConfig();
};
