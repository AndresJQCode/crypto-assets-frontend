import { getApiUrl } from "@/lib/env";

export const getAuthEndpoint = () => `${getApiUrl()}/auth`;

export const endpoints = {
	login: () => `${getAuthEndpoint()}/login`,
	register: () => `${getAuthEndpoint()}/register`,
	logout: () => `${getAuthEndpoint()}/logout`,
	me: () => `${getAuthEndpoint()}/me`,
	forgotPassword: () => `${getAuthEndpoint()}/forgotPassword`,
	resetPassword: () => `${getAuthEndpoint()}/reset-password`,
	exchangeCode: () => `${getAuthEndpoint()}/exchange-code`,
	config: () => `${getAuthEndpoint()}/config`,
};
