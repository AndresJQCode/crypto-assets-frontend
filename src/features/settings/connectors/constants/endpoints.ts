import { getApiUrl } from "@/lib/env";

// URL base para el feature de Connectors (Tenants)
export const getConnectorsEndpoint = () => `${getApiUrl()}/connector-instances`;

// Helpers para construir URLs específicas
export const endpoints = {
	list: () => getConnectorsEndpoint(),
	byId: (id: string) => `${getConnectorsEndpoint()}/${id}`,
	toggle: (id: string) => `${getConnectorsEndpoint()}/${id}/toggle`,
	oauthInitiate: () => `${getConnectorsEndpoint()}/oauth/initiate`,
};
