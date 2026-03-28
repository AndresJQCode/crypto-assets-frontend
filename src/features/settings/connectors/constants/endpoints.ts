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

// Bybit endpoints
export const CONNECTORS_ENDPOINTS = {
	BASE: "/connector-instances",
	GET_ALL: "/connector-instances",
	GET_BY_ID: (id: string) => `/connector-instances/${id}`,
	TOGGLE: (id: string) => `/connector-instances/${id}/toggle`,
	DISCONNECT: (id: string) => `/connector-instances/${id}`,
	INITIATE_OAUTH: "/connector-instances/oauth/initiate",
	CONNECT_BYBIT: "/bybit/connect",
	SYNC_BYBIT_HISTORY: "/bybit/sync-history",
};
