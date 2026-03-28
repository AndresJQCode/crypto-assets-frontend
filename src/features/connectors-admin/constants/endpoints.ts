import { getApiUrl } from "@/lib/env";

// URL base para el feature de Connectors Admin
export const getConnectorsAdminEndpoint = () => `${getApiUrl()}/admin/connector-definitions`;

// Helpers para construir URLs específicas
export const endpoints = {
	list: () => getConnectorsAdminEndpoint(),
	byId: (id: string) => `${getConnectorsAdminEndpoint()}/${id}`,
	toggle: (id: string) => `${getConnectorsAdminEndpoint()}/${id}/toggle`,
};
